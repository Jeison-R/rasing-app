'use server'

import { cookies } from 'next/headers'

import { decrypt, encrypt } from './encrypter'

type CookieName = 'access-token' | 'refresh-token' // Agrega aquí los nombres de las cookies que necesites, se recomienda utilizar kebab-case

export interface Cookie {
  name: CookieName
  value: string
}

export const getCookie = (key: CookieName): { name: CookieName; value: string | null } => {
  const cookieEncrypted = cookies().get(key)

  if (!cookieEncrypted) return { name: key, value: null }

  const cookieDecrypted = decrypt(cookieEncrypted.value)

  return { name: key, value: cookieDecrypted }
}

export const setCookie = ({ key, value }: { key: CookieName; value: string }): void => {
  const cookieEncrypted = encrypt(value)

  cookies().set(key, cookieEncrypted)
}

export const deleteCookie = (name: CookieName): void => {
  cookies().delete(name)
}
