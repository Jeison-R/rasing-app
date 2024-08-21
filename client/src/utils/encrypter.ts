import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const KEY = randomBytes(32)

export const encrypt = (text: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')

  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

// Función de desencriptación
export const decrypt = (text: string): string => {
  const [ivString, encryptedText] = text.split(':')
  const iv = Buffer.from(ivString, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')

  decrypted += decipher.final('utf8')

  return decrypted
}
