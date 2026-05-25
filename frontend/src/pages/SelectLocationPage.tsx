import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { useMemo, useState } from 'react'

import { DecorativeBackground } from '../components/select-location/DecorativeBackground'
import { ViewPreferenceCard } from '../components/select-location/ViewPreferenceCard'
import {
  ViewPreference,
} from '../enums'
import { images } from '../utils/images'
import { useNavigate } from 'react-router-dom'
import { logout } from '../feature/authSlice'
import { useDispatch } from 'react-redux'
export default function SelectLocationPage() {
  const [selectedViewPreference, setSelectedViewPreference] = useState<ViewPreference | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const canProceed = useMemo(() => {
    if (selectedViewPreference === null) {
      return false
    }
    return true
  }, [selectedViewPreference])

  const handleSelectViewPreference = (viewPreference: ViewPreference) => {
    setSelectedViewPreference(viewPreference)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-brand-primary to-brand-primary-dark px-4 py-10 sm:px-6">
      <DecorativeBackground />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 sm:gap-11">
        <header className="flex flex-col items-center gap-6 text-center">
          <img
            src={images.tejasLogo}
            alt="TEJAS"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-[2.125rem] font-bold leading-9 text-text-inverse">
              Welcome to TEJAS
            </h1>
            <p className="text-sm text-brand-subtitle">
              Please select your view preference
            </p>
          </div>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <ViewPreferenceCard
            title="Location View"
            description="View by geographical location"
            icon={<LocationOnOutlinedIcon />}  
            selected={selectedViewPreference === ViewPreference.Location}
            onSelect={() => handleSelectViewPreference(ViewPreference.Location)}
          />
          <ViewPreferenceCard
            title="Plant View"
            description="View by plant type"
            icon={<FactoryOutlinedIcon />}
            selected={selectedViewPreference === ViewPreference.Plant}
            onSelect={() => handleSelectViewPreference(ViewPreference.Plant)}
          />
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center gap-3">
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => {
              navigate(`/dashboard/${selectedViewPreference === ViewPreference.Location ? 'location' : 'plant'}`)
            }}
            className={[
              'h-[50px] w-full rounded-[14px] border border-surface-glass-border text-sm font-semibold transition-opacity',
              canProceed
                ? 'bg-surface-card text-brand-primary hover:opacity-95'
                : 'bg-surface-glass-button text-text-inverse-disabled cursor-not-allowed',
            ].join(' ')}
          >
            Proceed to the Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(logout())
              navigate('/login')
            }}
            className="text-sm text-brand-subtitle underline underline-offset-2 hover:text-text-inverse"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    </main>
  )
}
