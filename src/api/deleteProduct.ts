import { API } from '@/lib/constants'

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API}/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error)
  }
}