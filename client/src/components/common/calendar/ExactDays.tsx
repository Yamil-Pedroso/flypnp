import { useState } from 'react'
import { FaPlusMinus } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const daysOptions = [1, 2, 3, 4]

const ExactDays = () => {
  const { t } = useTranslation('search')
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelection = (index: number) => () => {
    setSelected(index)
  }

  return (
    <div className="mt-5 flex max-w-full flex-wrap items-center justify-center gap-2">
      <button type="button"
        onClick={handleSelection(0)}
        className={`rounded-full border px-4 py-2 text-sm transition ${selected === 0 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
      >
        {t('exactDays')}
      </button>
      <div className="flex flex-wrap justify-center gap-2">
        {daysOptions.map((count, index) => (
          <button type="button"
            key={index}
            className={`rounded-full border px-4 py-2 text-sm transition ${selected === index + 1 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
            onClick={handleSelection(index + 1)}
          >
            <div className="flex items-center gap-1">
              <FaPlusMinus size={12} />
              <span>{count}</span>
              <span>{t('day', { count })}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ExactDays
