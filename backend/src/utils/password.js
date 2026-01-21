import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
}