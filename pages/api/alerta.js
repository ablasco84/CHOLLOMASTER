export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { producto, telegram } = req.body;

  if (!producto || !telegram) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Nueva alerta sin Telegram configurado:', { producto, telegram });
    return res.status(200).json({ ok: true, mensaje: 'Alerta registrada. El bot se configurara pronto.' });
  }

  try {
    const mensaje = `Nueva alerta CholloMaster\n\nProducto: ${producto}\nTelegram: @${telegram}\n\nRecibido: ${new Date().toLocaleString('es-ES')}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'HTML',
      }),
    });

    res.status(200).json({ ok: true, mensaje: 'Alerta registrada. Te avisaremos por Telegram.' });
  } catch (e) {
    console.error(e);
    res.status(200).json({ ok: true, mensaje: 'Alerta registrada correctamente.' });
  }
}
