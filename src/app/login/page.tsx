import { LoginForm } from '@/components/login-form'
import { ThemeDropdown } from '@/components/theme-dropdown'
import { useAuthStore } from '@/store/auth'

export interface LoginPageProps {}

export default function LoginPage(props: LoginPageProps) {
  const authenticate = useAuthStore((state) => state.authenticate)

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
      <div className="absolute top-2 lg:top-6 right-6">
        <ThemeDropdown />
      </div>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onLogin={authenticate} />
      </div>
    </div>
  )
}
