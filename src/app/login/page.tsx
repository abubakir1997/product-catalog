import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/store/auth'

export interface LoginPageProps {}

export default function LoginPage(props: LoginPageProps) {
  const authenticate = useAuthStore((state) => state.authenticate)

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onLogin={authenticate} />
      </div>
    </div>
  )
}
