import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'

import { FeatureCard } from './FeatureCard'
import { StatItem } from './StatItem'
import { images } from '../../utils/images'

const features = [
  {
    icon: <AnalyticsOutlinedIcon />,
    title: 'Real-time Analytics',
    description:
      'Monitor production metrics and performance in real-time.',
  },
  {
    icon: <AssessmentOutlinedIcon />,
    title: 'Advanced Reporting',
    description:
      'Generate comprehensive reports with actionable insights.',
  },
  {
    icon: <MemoryOutlinedIcon />,
    title: 'Digital Twin',
    description:
      'Virtual replica for predictive maintenance and optimization.',
  },
  {
    icon: <SecurityOutlinedIcon />,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and secure data management.',
  },
] as const

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '500+', label: 'Projects' },
] as const

export function HeroPanel() {
  return (
    <section className="relative flex min-h-[min(50vh,28rem)] flex-col overflow-hidden bg-gradient-to-b from-brand-primary to-brand-primary-dark px-6 py-10 sm:min-h-0 sm:px-10 sm:py-12 lg:min-h-screen lg:flex-1 lg:px-16 lg:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 size-64 rounded-full border-[40px] border-surface-decor opacity-10 sm:size-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full border-[30px] border-surface-decor opacity-10 sm:size-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-1/3 size-28 rounded-full bg-surface-decor opacity-[0.07] sm:size-36"
      />

      <div className="relative z-10 flex flex-1 flex-col gap-6 sm:gap-7">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 items-center justify-center rounded-lg"
              aria-hidden
            >
              <img src={images.tejasLogo} alt="tejas" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-inverse">
              TEJAS
            </h1>
          </div>
          <p className="text-lg font-medium uppercase tracking-wider text-brand-subtitle">
            Steel Manufacturing Intelligence
          </p>
          <p className="max-w-md text-base leading-relaxed text-text-inverse-muted">
            Revolutionize your steel plant operations with AI-powered insights,
            real-time monitoring, and predictive analytics.
          </p>
        </header>

        <div className="flex flex-wrap gap-8 sm:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
