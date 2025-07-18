import { CatalogPage } from '@/app/catalog/page'
import LoginPage from '@/app/login/page'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/store/auth'

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <>
      {isAuthenticated ? <CatalogPage /> : <LoginPage />}
      <Toaster position="top-right" />
    </>
  )
}
