export const storageKeys = {
  settings: 'ecom_admin_settings',
  token: 'ecom_admin_token',
} as const

export const readFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

export const writeToStorage = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(key)
}
