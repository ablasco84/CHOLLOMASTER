export default async function handler(req, res) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    await fetch(`${baseUrl}/api/deals`);
    res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
