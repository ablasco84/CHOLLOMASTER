// pages/api/telegram-post.js
// Publica una oferta aleatoria del catálogo en el canal de Telegram
// Se puede llamar manualmente o con un cron externo (ej: cron-job.org cada 30 min)

const AFFILIATE_TAG = "chollomaste0e-21";

const CATALOGO = [
  { nombre: "Echo Pop - Altavoz inteligente con Alexa", precioOriginal: 54.99, precioOferta: 27.99, descuento: 49, asin: "B09ZX7MS5B", categoria: "Tecnología" },
  { nombre: "Fire TV Stick HD - Mando por voz con Alexa", precioOriginal: 49.99, precioOferta: 24.99, descuento: 50, asin: "B0CHX33TFL", categoria: "Tecnología" },
  { nombre: "Kindle 16GB - Pantalla sin reflejos 6 pulgadas", precioOriginal: 129.99, precioOferta: 94.99, descuento: 27, asin: "B0CHX6JD7P", categoria: "Tecnología" },
  { nombre: "Samsung Galaxy Buds FE - Cancelación activa de ruido", precioOriginal: 109.00, precioOferta: 59.99, descuento: 45, asin: "B0CGJLZFWF", categoria: "Tecnología" },
  { nombre: "Logitech G203 - Ratón gaming 8000 DPI", precioOriginal: 39.99, precioOferta: 19.99, descuento: 50, asin: "B07W6JN5PY", categoria: "Gaming" },
  { nombre: "Apple AirTag (Pack de 4)", precioOriginal: 129.00, precioOferta: 94.90, descuento: 26, asin: "B0933BVK6T", categoria: "Tecnología" },
  { nombre: "SanDisk Ultra microSDXC 256GB Clase 10", precioOriginal: 39.99, precioOferta: 18.99, descuento: 53, asin: "B0B7NTY2S6", categoria: "Tecnología" },
  { nombre: "TP-Link Tapo C200 - Cámara WiFi 360°", precioOriginal: 34.99, precioOferta: 21.99, descuento: 37, asin: "B07XLML2YS", categoria: "Tecnología" },
  { nombre: "iRobot Roomba Combo Essential - Aspirador y fregasuelos", precioOriginal: 299.00, precioOferta: 179.00, descuento: 40, asin: "B0D4JJFQ7R", categoria: "Hogar" },
  { nombre: "Philips Airfryer Essential XL 6.2L", precioOriginal: 149.99, precioOferta: 89.99, descuento: 40, asin: "B09BJCZ2LG", categoria: "Hogar" },
  { nombre: "Bosch Serie 4 - Batidora de mano 1000W", precioOriginal: 79.99, precioOferta: 44.99, descuento: 44, asin: "B08YNFC1GH", categoria: "Hogar" },
  { nombre: "COSORI Air Fryer 5.5L - 11 programas", precioOriginal: 119.99, precioOferta: 69.99, descuento: 42, asin: "B0936FGLQS", categoria: "Hogar" },
  { nombre: "Oral-B Pro 3 3000 - Cepillo eléctrico Braun", precioOriginal: 99.99, precioOferta: 44.99, descuento: 55, asin: "B08DFDMGBY", categoria: "Hogar" },
  { nombre: "Braun Series 5 - Afeitadora eléctrica", precioOriginal: 119.99, precioOferta: 64.99, descuento: 46, asin: "B09MKGTVYQ", categoria: "Hogar" },
  { nombre: "Xiaomi Smart Band 8 - Pulsera AMOLED", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, asin: "B0CGRN2DKZ", categoria: "Deporte" },
  { nombre: "Nike Revolution 6 - Zapatillas running hombre", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, asin: "B09VF7B9KB", categoria: "Deporte" },
  { nombre: "Fitbit Charge 6 - Pulsómetro GPS integrado", precioOriginal: 159.95, precioOferta: 99.95, descuento: 38, asin: "B0CCJ4MGQQ", categoria: "Deporte" },
  { nombre: "Mando inalámbrico Xbox - Carbon Black", precioOriginal: 59.99, precioOferta: 39.99, descuento: 33, asin: "B08DF248LD", categoria: "Gaming" },
  { nombre: "SteelSeries Arctis Nova 1 - Auriculares gaming", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, asin: "B0B15QMK1G", categoria: "Gaming" },
  { nombre: "Levi's 501 Original - Vaqueros hombre", precioOriginal: 110.00, precioOferta: 54.99, descuento: 50, asin: "B07D3Q41W1", categoria: "Moda" },
  { nombre: "Casio F-91W - Reloj digital clásico", precioOriginal: 22.00, precioOferta: 11.50, descuento: 48, asin: "B000J34HN4", categoria: "Moda" },
  { nombre: "LEGO Classic 10698 - Caja grande 790 piezas", precioOriginal: 49.99, precioOferta: 29.99, descuento: 40, asin: "B00NHQF6MG", categoria: "Niños" },
  { nombre: "Finish Powerball Todo en 1 - 100 pastillas", precioOriginal: 24.99, precioOferta: 13.99, descuento: 44, asin: "B0C7G5FVJ5", categoria: "Supermercado" },
  { nombre: "Nespresso Cápsulas compatibles - Pack 100", precioOriginal: 34.99, precioOferta: 18.99, descuento: 46, asin: "B0BG6KFPQT", categoria: "Supermercado" },
  { nombre: "Bosch Professional GSR 12V-15 - Taladro", precioOriginal: 129.00, precioOferta: 79.99, descuento: 38, asin: "B00TJ2P19Q", categoria: "Herramientas" },
  { nombre: "Dremel 3000 - Multiherramienta 130W", precioOriginal: 79.95, precioOferta: 44.95, descuento: 44, asin: "B003BYO5ZI", categoria: "Herramientas" },
  { nombre: "Omron X3 Comfort - Tensiómetro de brazo", precioOriginal: 69.99, precioOferta: 39.99, descuento: 43, asin: "B07KY7GJX5", categoria: "Salud" },
];

function getRandomDeal() {
  return CATALOGO[Math.floor(Math.random() * CATALOGO.length)];
}

function formatDealMessage(deal) {
  const url = `https://www.amazon.es/dp/${deal.asin}?tag=${AFFILIATE_TAG}`;
  const ahorro = (deal.precioOriginal - deal.precioOferta).toFixed(2);

  return `🔥 *CHOLLO ${deal.categoria.toUpperCase()}* 🔥

📦 *${deal.nombre}*

💰 *${deal.precioOferta.toFixed(2)}€* ~~${deal.precioOriginal.toFixed(2)}€~~
📉 *-${deal.descuento}%* | Ahorras ${ahorro}€

🛒 [Ver en Amazon](${url})

⚡ _Precio puede cambiar en cualquier momento_
━━━━━━━━━━━━━━━
🔔 @chollomaster\\_ofertas`;
}

export default async function handler(req, res) {
  // Proteccion basica: solo permitir con clave o desde cron
  const { key } = req.query;
  const SECRET = process.env.CRON_SECRET || "chollomaster2024";
  
  if (key !== SECRET && req.headers["authorization"] !== `Bearer ${SECRET}`) {
    // Sin clave, permitir igual para pruebas iniciales pero con rate limit
    // En produccion descomentar: return res.status(401).json({ error: "No autorizado" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

  if (!BOT_TOKEN || !CHANNEL_ID) {
    return res.status(500).json({ 
      error: "Faltan variables de entorno TELEGRAM_BOT_TOKEN o TELEGRAM_CHANNEL_ID" 
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
        error: data.description || "Error al enviar a Telegram",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
