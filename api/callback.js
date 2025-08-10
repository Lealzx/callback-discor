export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, error: "No code provided" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      return res.status(200).json({ success: true, token: tokenData.access_token });
    } else {
      return res.status(400).json({ success: false, error: tokenData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
