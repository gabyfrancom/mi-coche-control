/**
 * Hash de PIN puramente local (Web Crypto, SHA-256 + salt aleatoria).
 * No hay backend: esto solo evita guardar el PIN en texto plano dentro
 * de localStorage. No sustituye una autenticacion real con servidor.
 */

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return bufferToHex(bytes.buffer)
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${salt}:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(digest)
}

export async function createPinHash(pin: string): Promise<{ hash: string; salt: string }> {
  const salt = randomSalt()
  const hash = await hashPin(pin, salt)
  return { hash, salt }
}

export async function verifyPin(pin: string, hash: string, salt: string): Promise<boolean> {
  const attempt = await hashPin(pin, salt)
  return attempt === hash
}
