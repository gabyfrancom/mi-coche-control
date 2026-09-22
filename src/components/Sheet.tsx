import React from 'react'
import { Icon } from './Icon'

export default function Sheet({
  open,
  onClose,
  title,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-white dark:bg-violet-900 border-t border-violet-100 dark:border-violet-800 p-5 pb-8 animate-[slideUp_.2s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[16px] text-violet-900 dark:text-violet-50">{title}</h2>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-800 flex items-center justify-center text-violet-500 dark:text-violet-100"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
