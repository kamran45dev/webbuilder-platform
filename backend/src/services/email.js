export async function sendOTPEmail(email, otp, brevoApiKey) {
  console.log('Brevo API Key:', brevoApiKey ? 'EXISTS (length: ' + brevoApiKey.length + ')' : 'MISSING')
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': brevoApiKey
    },
    body: JSON.stringify({
 sender: {
  name: 'WebBuilder',
  email: 'rgesports44@gmail.com' // Your verified sender
},
      to: [{ email }],
      subject: 'Your Verification Code',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to WebBuilder!</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    })
  })

  const data = await response.json()
  
  if (!response.ok) {
    console.error('Brevo error:', data)
    throw new Error(data.message || 'Failed to send email')
  }
  
  return data
}