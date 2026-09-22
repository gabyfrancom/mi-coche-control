import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

export default function TopBar({
  title,
  onBack,
  action
}: {
  title: string
  onBack?: boolean
  action?: { icon: IconName; label: string; onClick: () => void }
}) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-1">
      {onBack ? (
        <button
          aria-label="Volver"
          onClick={() => navigate(-1)}
          className="w-[38px] h-[38px] rounded-xl bg-white dark:bg-violet-800 border border-violet-100 dark:border-violet-800 flex items-center justify-center text-violet-500 dark:text-violet-100"
        >
          <Icon name="back" size={17} strokeWidth={1.9} />
        </button>
      ) : (
        <div className="w-[38px]" />
      )}
      <h1 className="font-display font-bold text-[16px] text-violet-900 dark:text-violet-50">{title}</h1>
      {action ? (
        <button
          aria-label={action.label}
          onClick={action.onClick}
          className="w-[38px] h-[38px] rounded-xl bg-white dark:bg-violet-800 border border-violet-100 dark:border-violet-800 flex items-center justify-center text-violet-500 dark:text-violet-100"
        >
          <Icon name={action.icon} size={16} strokeWidth={1.7} />
        </button>
      ) : (
        <div className="w-[38px]" />
      )}
    </div>
  )
}
