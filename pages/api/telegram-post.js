// pages/api/telegram-post.js
// Publica ofertas REALES de la Fiesta de Ofertas de Primavera Amazon 2026

const AFFILIATE_TAG = "chollomaste0e-21";

const CATALOGO = [
  { nombre: "Cápsulas Café Lungo Intenso compatibles Nespresso", precioOriginal: 14.99, precioOferta: 9.99, descuento: 33, asin: "B08Y1CYY63", categoria: "Supermercado" },
  { nombre: "Amazon Basics 12 pilas AA recargables 2000mAh", precioOriginal: 19.99, precioOferta: 14.99, descuento: 25, asin: "B07NWWLP5S", categoria: "Hogar" },
  { nombre: "Amazon Basics Tijeras de Cocina multifunción", precioOriginal: 12.99, precioOferta: 8.99, descuento: 31, asin: "B00R3Z4FR4", categoria: "Hogar" },
  { nombre: "Amazon Basics Soporte ajustable para móvil", precioOriginal: 14.99, precioOferta: 9.99, descuento: 33, asin: "B07DHKRDFT", categoria: "Tecnología" },
  { nombre: "Amazon Basics 12 Rotuladores permanentes colores", precioOriginal: 11.99, precioOferta: 7.99, descuento: 33, asin: "B01DN8TN8K", categoria: "Papelería" },
  { nombre: "Semillas de Chía by Amazon 350g", precioOriginal: 4.99, precioOferta: 3.49, descuento: 30, asin: "B0CCTYMCFS", categoria: "Supermercado" },
  { nombre: "Jabón de manos miel y leche 4x500ml", precioOriginal: 7.99, precioOferta: 5.49, descuento: 31, asin: "B0CS6FFLSS", categoria: "Hogar" },
  { nombre: "Amazon Essentials Camiseta Tirantes hombre", precioOriginal: 12.90, precioOferta: 8.90, descuento: 31, asin: "B07HJHFHVD", categoria: "Moda" },
  { nombre: "Fire TV Stick HD - Smart TV al instante", precioOriginal: 44.99, precioOferta: 26.99, descuento: 40, asin: "B0CQMWQDH4", categoria: "Amazon" },
  { nombre: "Fire TV Stick 4K Select - Streaming 4K", precioOriginal: 54.99, precioOferta: 28.99, descuento: 47, asin: "B0CN41GMDK", categoria: "Amazon" },
  { nombre: "Fire TV Stick 4K Plus - WiFi 6 Dolby Vision", precioOriginal: 69.99, precioOferta: 37.99, descuento: 46, asin: "B0F7ZFWVTC", categoria: "Amazon" },
  { nombre: "Echo Dot 5ª gen - Altavoz inteligente Alexa", precioOriginal: 64.99, precioOferta: 44.99, descuento: 31, asin: "B09B8X9RGM", categoria: "Amazon" },
  { nombre: "Melatonina Pura 1.99mg - 450 comprimidos", precioOriginal: 9.99, precioOferta: 8.54, descuento: 15, asin: "B0BWKDGNHG", categoria: "Salud" },
  { nombre: "AF 4 Calcio para Tortugas de Agua", precioOriginal: 6.95, precioOferta: 5.94, descuento: 15, asin: "B0CZM47KP4", categoria: "Mascotas" },
  { nombre: "Fideos Somen Secos Eaglobe 400g", precioOriginal: 3.95, precioOferta: 3.75, descuento: 5, asin: "B08N64ZVF9", categoria: "Supermercado" },
  { nombre: "Mirín Japonés 400ml para teriyaki", precioOriginal: 9.82, precioOferta: 9.82, descuento: 0, asin: "B0BK5F9BXR", categoria: "Supermercado" },
  { nombre: "STEP Fosa Séptica 16 pastillas", precioOriginal: 23.89, precioOferta: 22.70, descuento: 5, asin: "B01ETLB5QI", categoria: "Hogar" },
  { nombre: "RAW Filtros Tips 500 uds - 10 libritos", precioOriginal: 5.60, precioOferta: 5.32, descuento: 5, asin: "B005JFFY02", categoria: "Otros" },
  { nombre: "RAW Classic King Size pack 5 libritos", precioOriginal: 5.93, precioOferta: 5.63, descuento: 5, asin: "B008VEK6ME", categoria: "Otros" },
];

function getRandomDeal() {
  return CATALOGO[Math.floor(Math.random() * CATALOGO.length)];
}

function formatDealMessage(deal) {
  const url = `https://www.amazon.es/dp/${deal.asin}?tag=${AFFILIATE_TAG}`;
  const ahorro = (deal.precioOriginal - deal.precioOferta).toFixed(2);

  return `🔥 *OFERTA ${deal.categoria.toUpperCase()}* 🔥

📦 *${deal.nombre}*

💰 *${deal.precioOferta.toFixed(2)}€* ~${deal.precioOriginal.toFixed(2)}€~
📉 *\\-${deal.descuento}%* | Ahorras ${ahorro}€

🛒 [Ver en Amazon](${url})

⚡ _Fiesta de Ofertas de Primavera \\- hasta el 16 de marzo_
━━━━━━━━━━━━━━━
🔔 @chollomaster\\_ofertas`;
}

export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

  if (!BOT_TOKEN || !CHANNEL_ID) {
    return res.status(500).json({
      error: "Faltan variables TELEGRAM_BOT_TOKEN o TELEGRAM_CHANNEL_ID",
    });
  }

  try {
    const deal = getRandomDeal();
    const message = formatDealMessage(deal);

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHANNEL_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      }
    );

    const data = await telegramRes.json();

    if (data.ok) {
      return res.status(200).json({
        success: true,
        message: "Oferta publicada en el canal",
        deal: deal.nombre,
        precio: deal.precioOferta,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: data.description || "Error Telegram",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
