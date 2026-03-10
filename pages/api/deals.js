import Parser from 'rss-parser';

const AFFILIATE_TAG = 'chollomaste0e-21';

function buildDirectLink(asin) {
  return `https://www.amazon.es/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

function extractASIN(text) {
  if (!text) return null;
  // ASIN es siempre 10 caracteres: letra B + 9 alfanumericos
  const patrones = [
    /amazon\.es\/dp\/([A-Z0-9]{10})/,
    /amazon\.es\/gp\/product\/([A-Z0-9]{10})/,
    /amazon\.es\/[^/]+\/dp\/([A-Z0-9]{10})/,
    /\/dp\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /\/(B[A-Z0-9]{9})\//,
    /\/(B[A-Z0-9]{9})[\s"'?&]/,
    /asin=([A-Z0-9]{10})/i,
    /ASIN%3D([A-Z0-9]{10})/i,
  ];
  for (const p of patrones) {
    const m = text.match(p);
    if (m && m[1] && m[1].startsWith('B')) return m[1];
  }
  return null;
}

async function resolveChollometroLink(url) {
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' },
      signal: AbortSignal.timeout(5000),
    });
    const finalUrl = r.url;
    const asin = extractASIN(finalUrl);
    if (asin) return buildDirectLink(asin);
    const html = await r.text();
    const asin2 = extractASIN(html);
    if (asin2) return buildDirectLink(asin2);
  } catch (e) {}
  return null;
}

function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp|gif)(\?[^"']*)?)[^"']*/i);
  return match ? match[1] : null;
}

function getCategoriaDesdeTexto(texto) {
  const t = (texto || '').toLowerCase();
  if (t.match(/movil|iphone|samsung|xiaomi|smartphone|telefono|redmi|realme|motorola/)) return 'Moviles';
  if (t.match(/television|monitor|tv|pantalla|oled|qled|hdmi/)) return 'TV y Monitores';
  if (t.match(/auricular|audio|altavoz|sonido|airpods|earbuds|cascos|bluetooth/)) return 'Audio';
  if (t.match(/ordenador|portatil|laptop|tablet|ipad|macbook|ssd|disco|memoria|ram/)) return 'Informatica';
  if (t.match(/camara|foto|objetivo|gopro|drone|mirrorless/)) return 'Camaras';
  if (t.match(/robot|aspiradora|cocina|freidora|cafetera|hogar|lavadora|microondas|nevera/)) return 'Hogar';
  if (t.match(/juego|playstation|xbox|nintendo|gaming|consola|steam|mando|ps5|ps4/)) return 'Gaming';
  if (t.match(/ropa|zapatilla|calzado|moda|nike|adidas|camiseta|pantalon/)) return 'Moda';
  if (t.match(/libro|kindle|ebook/)) return 'Libros';
  return 'Oferta';
}

function extractDescuento(titulo, content) {
  const texto = titulo + ' ' + (content || '');
  const m = texto.match(/-\s*(\d+)\s*%/);
  return m ? parseInt(m[1]) : null;
}

function extractPrecio(titulo, content) {
  const texto = titulo + ' ' + (content || '');
  const patrones = [/(\d+[,.]\d{2})\s*€/, /€\s*(\d+[,.]\d{2})/, /(\d+)\s*€/];
  for (const p of patrones) {
    const m = texto.match(p);
    if (m) return parseFloat(m[1].replace(',', '.'));
  }
  return null;
}

function getDealsEjemplo() {
  return [
    { id: 'ej1', titulo: 'Echo Dot 5a Gen - Altavoz inteligente Alexa', enlace: buildDirectLink('B09B8YWXDF'), imagen: 'https://m.media-amazon.com/images/I/71GTpNiNkCL._AC_SL1000_.jpg', precio: 21.99, precioAntes: 54.99, descuento: 60, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 342 },
    { id: 'ej2', titulo: 'Samsung Galaxy Buds2 Pro - Auriculares cancelacion de ruido', enlace: buildDirectLink('B0B4BSMFBD'), imagen: 'https://m.media-amazon.com/images/I/71VEEqP8g3L._AC_SL1500_.jpg', precio: 89.00, precioAntes: 229.00, descuento: 61, categoria: 'Audio', fecha: new Date().toISOString(), votos: 218 },
    { id: 'ej3', titulo: 'Kindle Paperwhite 16GB - Pantalla 6.8 sin reflejos', enlace: buildDirectLink('B09TMZKQR3'), imagen: 'https://m.media-amazon.com/images/I/61e1MhMVOlL._AC_SL1000_.jpg', precio: 94.99, precioAntes: 159.99, descuento: 41, categoria: 'Libros', fecha: new Date().toISOString(), votos: 423 },
  ];
}

let cache = { deals: null, timestamp: 0 };

async function fetchDeals() {
  if (cache.deals && Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) return cache.deals;

  const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' },
    customFields: { item: ['link', 'guid'] },
  });

  const feeds = [
    'https://www.chollometro.com/rss',
    'https://www.dealabs.com/rss',
  ];

  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const parsed = await Promise.all(feed.items.slice(0, 20).map(async (item, i) => {
        const content = item.content || item.summary || item['content:encoded'] || '';
        const titulo = item.title || 'Oferta';
        const itemLink = item.link || item.guid || '';

        // 1. Intenta extraer ASIN del contenido RSS directamente
        let asin = extractASIN(content) || extractASIN(itemLink);
        let enlace = null;

        if (asin) {
          enlace = buildDirectLink(asin);
        } else if (itemLink && itemLink.includes('chollometro.com')) {
          // 2. Sigue el link de Chollometro para encontrar el ASIN real
          enlace = await resolveChollometroLink(itemLink);
        }

        // 3. Si no hay enlace directo, construye busqueda pero solo como ultimo recurso
        if (!enlace) {
          enlace = `https://www.amazon.es/s?k=${encodeURIComponent(titulo.slice(0, 60))}&tag=${AFFILIATE_TAG}`;
        }

        const img = extractImageFromContent(content);
        const desc = extractDescuento(titulo, content);
        const precio = extractPrecio(titulo, content);
        const cat = getCategoriaDesdeTexto(titulo);

        return {
          id: `rss-${Date.now()}-${i}`,
          titulo,
          enlace,
          imagen: img,
          precio,
          precioAntes: precio && desc ? Math.round(precio / (1 - desc / 100) * 100) / 100 : null,
          descuento: desc,
          categoria: cat,
          fecha: item.pubDate || new Date().toISOString(),
          votos: Math.floor(Math.random() * 300) + 20,
        };
      }));
      items = [...items, ...parsed];
    } catch (e) {
      console.log('RSS error:', url, e.message);
    }
  }

  const resultado = items.length > 0 ? items.slice(0, 48) : getDealsEjemplo();
  cache = { deals: resultado, timestamp: Date.now() };
  return resultado;
}

export default async function handler(req, res) {
  try {
    const deals = await fetchDeals();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ deals, total: deals.length });
  } catch (e) {
    res.status(200).json({ deals: getDealsEjemplo(), total: 3 });
  }
}
