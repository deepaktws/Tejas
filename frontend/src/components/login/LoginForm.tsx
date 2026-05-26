import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useState } from 'react'

import { Button, Checkbox, TextField } from '../ui'
import { images } from '../../utils/images'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
type LoginFormProps = {
  onSignIn?: (username: string, password: string) => void
}

export function LoginForm({ onSignIn }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const isSubmitDisabled =
    !formData.username.trim() || !formData.password.trim()
  const [loading, setLoading] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try{
      await onSignIn?.(formData.username, formData.password)
      toast.success('Login successful')
    }catch(error: any){
      setLoading(false)
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 px-4 py-8 sm:px-6">
      <div className="flex h-16 items-center justify-center" aria-label="JSW Steel">
        <img src={images.jswSteelLogo} alt="JSW Steel" className="h-16" />
      </div>

      <header className="w-full text-center">
        <h2 className="text-3xl font-semibold text-text-primary">Welcome Back</h2>
        <p className="mt-2 text-base text-text-secondary">
          Sign in to access your dashboard
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <TextField
            label="Username"
            name="username"
            type="email"
            autoComplete="username"
            placeholder="Enter your username"
            icon={<PersonOutlineOutlinedIcon fontSize="small" />}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            icon={<LockOutlinedIcon fontSize="small" />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded p-0.5 text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </button>
            }
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" variant="secondary" fullWidth disabled={isSubmitDisabled || loading}>
          {loading ? <CircularProgress size={20}/> : 'Sign In'}
        </Button>

        <div className="relative flex items-center py-1">
          <div className="h-px flex-1 bg-border-default" />
          <span className="bg-surface-card px-3 text-sm text-text-secondary">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        <Button type="button" variant="outline" fullWidth>
          SSO Login
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="font-medium text-brand-danger hover:underline cursor-pointer"
            onClick={() => navigate('/contact-administrator')}
          >
            Contact Administrator
          </button>
        </p>
      </form>
    </div>
  )
}
