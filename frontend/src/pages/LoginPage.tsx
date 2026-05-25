import { HeroPanel } from '../components/login/HeroPanel'
import { LoginForm } from '../components/login/LoginForm'
import { useNavigate } from 'react-router-dom'
import loginService from '../service/auth.service'
import { setCredentials } from '../feature/authSlice'
import { useDispatch } from 'react-redux'
export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSignIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await loginService(email, password)
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.body.accessToken)
        localStorage.setItem('refreshToken', response.body.refreshToken)
        dispatch(setCredentials({ accessToken: response.body.accessToken, refreshToken: response.body.refreshToken }))
        navigate('/select-location')
      } else {
        throw new Error(response.message)
      }
    }
    catch (error: any) {
      throw new Error(error.message)
    }
  }  
  return (
    <main className="flex min-h-screen flex-col bg-surface-page lg:flex-row">
      <div className="order-2 lg:order-1 lg:flex lg:flex-1">
        <HeroPanel />
      </div>

      <section className="order-1 flex flex-1 items-center justify-center bg-surface-page px-4 py-10 sm:px-8 lg:order-2 lg:min-h-screen lg:flex-1 lg:px-12">
        <div
          className="w-full max-w-md rounded-2xl bg-surface-card p-2 sm:max-w-lg sm:p-4"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <LoginForm onSignIn={onSignIn} />
        </div>
      </section>
    </main>
  )
}
