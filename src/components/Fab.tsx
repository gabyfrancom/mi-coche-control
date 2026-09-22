import React from 'react'
import { Icon, type IconName } from './Icon'

export default function Fab({ onClick, icon = 'plus', label }: { onClick: () => void; icon?: IconName; label: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-40">
      <div className="relative w-full h-0">
        <button
          aria-label={label}
          onClick={onClick}
          className="pointer-events-auto absolute right-5 -top-[54px] w-[54px] h-[54px] rounded-2xl bg-gradient-to-br from-amber to-amber-dark shadow-[0_10px_24px_rgba(253,176,34,0.4)] flex items-center justify-center text-[#2A1550]"
        >
          <Icon name={icon} size={22} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
