/**
 * Bloqueo biometrico (huella / Face ID / Windows Hello) via WebAuthn,
 * usado como una simple "llave" local del dispositivo. Como esta app no
 * tiene backend, no hay servidor que verifique la firma: solo se
 * comprueba que el dispositivo pueda generar y volver a usar una
 * credencial de plataforma, lo cual alcanza para bloquear la pantalla.
 */

export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

function randomChallenge(): ArrayBuffer {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return bytes.buffer.slice(0) as ArrayBuffer
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function registerBiometric(userId: string): Promise<string | null> {
  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: randomChallenge(),
        rp: { name: 'Mi Coche Control' },
        user: {
          id: new TextEncoder().encode(userId),
          name: 'usuario@micoche.app',
          displayName: 'Usuario de Mi Coche Control'
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 }
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: 60000
      }
    })) as PublicKeyCredential | null

    if (!credential) return null
    return bufferToBase64(credential.rawId)
  } catch {
    return null
  }
}

export async function verifyBiometric(credentialId: string): Promise<boolean> {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge(),
        allowCredentials: [{ id: base64ToBuffer(credentialId), type: 'public-key' }],
        userVerification: 'required',
        timeout: 60000
      }
    })
    return !!assertion
  } catch {
    return false
  }
}
