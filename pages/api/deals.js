import Parser from 'rss-parser';

const AFFILIATE_TAG = 'chollomaste0e-21';

function buildAmazonSearchLink(titulo) {
  const query = encodeURIComponent(titulo.slice(0, 80));
  return `https://www.amazon.es/s?k=${query}&tag=${AFFILIATE_TAG}`;
}

function addAffiliateTag(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('amazon.es') || u.hostname.includes('amazon.com')) {
      u.searchParams.set('tag', AFFILIATE_TAG);
      return u.toString();
    }
  } catch (e) {}
  return null;
}

function extractAmazonLink(content, titulo) {
  if (!content) return buildAmazonSearchLink(titulo);
  const patrones = [
    /https?:\/\/(?:www\.)?amazon\.es\/(?:dp|gp\/product)\/[A-Z0-9]{10}[^\s"'<>]*/g,
    /https?:\/\/(?:www\.)?amzn\.to\/[^\s"'<>]+/g,
    /https?:\/\/(?:www\.)?amazon\.es\/[^\s"'<>]{20,}/g,
  ];
  for (const patron of patrones) {
    const matches = content.match(patron);
    if (matches && matches.length > 0) {
      const link = addAffiliateTag(matches[0]);
      if (link) return link;
    }
  }
  return buildAmazonSearchLink(titulo);
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
  const patrones = [/(\d+[,.]\d{2})\s*€/,/€\s*(\d+[,.]\d{2})/,/(\d+)\s*€/];
  for (const p of patrones) {
    const m = texto.match(p);
    if (m) return parseFloat(m[1].replace(',', '.'));
  }
  return null;
}

function getDealsEjemplo() {
  return [
    { id: 'ej1', titulo: 'Echo Dot 5a Gen - Altavoz inteligente Alexa', enlace: `https://www.amazon.es/dp/B09B8YWXDF?tag=${AFFILIATE_TAG}`, imagen: 'https://m.media-amazon.com/images/I/71GTpNiNkCL._AC_SL1000_.jpg', precio: 21.99, precioAntes: 54.99, descuento: 60, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 342, esAmazon: true },
    { id: 'ej2', titulo: 'Samsung Galaxy Buds2 Pro - Auriculares cancelacion de ruido', enlace: `https://www.amazon.es/dp/B0B4BSMFBD?tag=${AFFILIATE_TAG}`, imagen: 'https://m.media-amazon.com/images/I/71VEEqP8g3L._AC_SL1500_.jpg', precio: 89.00, precioAntes: 229.00, descuento: 61, categoria: 'Audio', fecha: new Date().toISOString(), votos: 218, esAmazon: true },
    { id: 'ej3', titulo: 'Kindle Paperwhite 16GB - Pantalla 6.8 sin reflejos', enlace: `https://www.amazon.es/dp/B09TMZKQR3?tag=${AFFILIATE_TAG}`, imagen: 'https://m.media-amazon.com/images/I/61e1MhMVOlL._AC_SL1000_.jpg', precio: 94.99, precioAntes: 159.99, descuento: 41, categoria: 'Libros', fecha: new Date().toISOString(), votos: 423, esAmazon: true },
  ];
}

let cache = { deals: null, timestamp: 0 };

async function fetchDeals() {
  if (cache.deals && Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) return cache.deals;
  const parser = new Parser({ timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' } });
  const feeds = ['https://www.chollometro.com/rss', 'https://www.dealabs.com/rss'];
  let items = [];
  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const parsed = feed.items.slice(0, 25).map((item, i) => {
        const content = item.content || item.summary || '';
        const titulo = item.title || 'Oferta';
        const enlace = extractAmazonLink(content, titulo);
        const img = extractImageFromContent(content);
        const desc = extractDescuento(titulo, content);
        const precio = extractPrecio(titulo, content);
        const cat = getCategoriaDesdeTexto(titulo);
        return { id: `rss-${Date.now()}-${i}`, titulo, enlace, imagen: img, precio, precioAntes: precio && desc ? Math.round(precio / (1 - desc / 100) * 100) / 100 : null, descuento: desc, categoria: cat, fecha: item.pubDate || new Date().toISOString(), votos: Math.floor(Math.random() * 300) + 20, esAmazon: true };
      });
      items = [...items, ...parsed];
    } catch (e) { console.log('RSS error:', url, e.message); }
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
