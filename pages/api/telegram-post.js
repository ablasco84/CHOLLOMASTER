// pages/api/telegram-post.js
// Publica ofertas REALES de la Fiesta de Ofertas de Primavera Amazon 2026

const AFFILIATE_TAG = "chollomaste0e-21";

const CATALOGO = [
  { nombre: "Fire TV Stick HD - Convierte tu tele en Smart TV", precioOriginal: 44.99, precioOferta: 26.99, descuento: 40, asin: "B0BTFKTTM4", categoria: "Amazon" },
  { nombre: "Fire TV Stick 4K Select - Streaming 4K HDR10+", precioOriginal: 54.99, precioOferta: 28.99, descuento: 47, asin: "B0CDKB8V25", categoria: "Amazon" },
  { nombre: "Fire TV Stick 4K Plus - WiFi 6, Dolby Vision", precioOriginal: 69.99, precioOferta: 37.99, descuento: 46, asin: "B0CX544VZ3", categoria: "Amazon" },
  { nombre: "Fire TV Stick 4K Max - WiFi 6E, el más potente", precioOriginal: 79.99, precioOferta: 47.99, descuento: 40, asin: "B0BTFK3CNM", categoria: "Amazon" },
  { nombre: "Echo Dot (5ª gen) - Altavoz con Alexa", precioOriginal: 64.99, precioOferta: 44.99, descuento: 31, asin: "B09B8V1LZ3", categoria: "Amazon" },
  { nombre: "Echo Show 5 - Pantalla inteligente Alexa", precioOriginal: 109.99, precioOferta: 64.99, descuento: 41, asin: "B09B2SBHQK", categoria: "Amazon" },
  { nombre: "Kindle (última gen) - 16GB sin reflejos", precioOriginal: 114.99, precioOferta: 89.99, descuento: 22, asin: "B0CHX6JD7P", categoria: "Amazon" },
  { nombre: "Kindle Paperwhite - 16GB, 7 pulgadas", precioOriginal: 169.99, precioOferta: 129.99, descuento: 24, asin: "B0CFPJYX54", categoria: "Amazon" },
  { nombre: "Ring Intercom - Abre portal desde el móvil", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, asin: "B09X6T3M63", categoria: "Amazon" },
  { nombre: "Sony WH-1000XM5 - Cancelación de ruido", precioOriginal: 228.99, precioOferta: 199.00, descuento: 13, asin: "B09XS7JWHH", categoria: "Tecnología" },
  { nombre: "JBL Tune Flex 2 - Auriculares Bluetooth", precioOriginal: 99.99, precioOferta: 61.99, descuento: 38, asin: "B0DG1JQQ41", categoria: "Tecnología" },
  { nombre: "Samsung Galaxy Buds FE - Cancelación ruido", precioOriginal: 109.00, precioOferta: 59.99, descuento: 45, asin: "B0CGJLZFWF", categoria: "Tecnología" },
  { nombre: "Xiaomi Redmi Note 15 - 128GB AMOLED", precioOriginal: 199.90, precioOferta: 179.00, descuento: 10, asin: "B0DWB4H7FF", categoria: "Tecnología" },
  { nombre: "HUAWEI Watch FIT 4 - Batería 10 días", precioOriginal: 149.00, precioOferta: 99.99, descuento: 33, asin: "B0DHV9X5F5", categoria: "Tecnología" },
  { nombre: "Dreame L10s Ultra Gen 3 - Robot aspirador", precioOriginal: 599.00, precioOferta: 429.00, descuento: 28, asin: "B0DGR1HT38", categoria: "Hogar" },
  { nombre: "COSORI Air Fryer 5.5L - Freidora de aire", precioOriginal: 119.99, precioOferta: 69.99, descuento: 42, asin: "B0936FGLQS", categoria: "Hogar" },
  { nombre: "Oral-B Pro 3 3000 - Cepillo eléctrico", precioOriginal: 99.99, precioOferta: 44.99, descuento: 55, asin: "B08DFDMGBY", categoria: "Hogar" },
  { nombre: "Levi's 501 Original - Vaqueros hombre", precioOriginal: 110.00, precioOferta: 44.99, descuento: 59, asin: "B07D3Q41W1", categoria: "Moda" },
  { nombre: "Casio F-91W - Reloj digital clásico", precioOriginal: 22.00, precioOferta: 11.50, descuento: 48, asin: "B000J34HN4", categoria: "Moda" },
  { nombre: "Logitech G203 - Ratón gaming 8000 DPI", precioOriginal: 39.99, precioOferta: 19.99, descuento: 50, asin: "B07W6JN5PY", categoria: "Gaming" },
  { nombre: "SteelSeries Arctis Nova 1 - Auriculares gaming", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, asin: "B0B15QMK1G", categoria: "Gaming" },
  { nombre: "Finish Powerball - 100 pastillas lavavajillas", precioOriginal: 24.99, precioOferta: 13.99, descuento: 44, asin: "B0C7G5FVJ5", categoria: "Supermercado" },
  { nombre: "Bosch Professional GSR 12V-15 - Taladro", precioOriginal: 129.00, precioOferta: 79.99, descuento: 38, asin: "B00TJ2P19Q", categoria: "Herramientas" },
  { nombre: "LEGO Classic 10698 - 790 piezas", precioOriginal: 49.99, precioOferta: 29.99, descuento: 40, asin: "B00NHQF6MG", categoria: "Niños" },
  { nombre: "Xiaomi Smart Band 8 - Pulsera AMOLED", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, asin: "B0CGRN2DKZ", categoria: "Deporte" },
  { nombre: "Apple AirTag Pack 4 - Localizador", precioOriginal: 129.00, precioOferta: 94.90, descuento: 26, asin: "B0933BVK6T", categoria: "Tecnología" },
  { nombre: "SanDisk Ultra microSD 256GB", precioOriginal: 39.99, precioOferta: 18.99, descuento: 53, asin: "B0B7NTY2S6", categoria: "Tecnología" },
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
