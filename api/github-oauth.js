export default async function handler(req, res) {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' })
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description })
    }

    const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173'
    res.redirect(`${appUrl}/auth/callback?token=${tokenData.access_token}`)
  } catch (err) {
    console.error('OAuth error:', err)
    res.status(500).json({ error: 'OAuth exchange failed' })
  }
}
