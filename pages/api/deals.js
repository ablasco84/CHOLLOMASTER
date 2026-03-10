import Parser from 'rss-parser';

const AFFILIATE_TAG = 'chollomaste0e-21';

function addAffiliateTag(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes('amazon.es') || u.hostname.includes('amazon.com')) {
      u.searchParams.set('tag', AFFILIATE_TAG);
      return u.toString();
    }
  } catch (e) {}
  return url;
}

function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp|gif)(\?[^"']*)?)[^"']*/i);
  return match ? match[1] : null;
}

function extractAmazonLink(content, link) {
  if (!content) return link;
  const match = content.match(/https?:\/\/(?:www\.)?amazon\.es\/[^\s"'<>]+/);
  if (match) return addAffiliateTag(match[0]);
  return link;
}

function getCategoriaDesdeTexto(texto) {
  const t = (texto || '').toLowerCase();
  if (t.match(/movil|iphone|samsung|xiaomi|smartphone|telefono/)) return 'Moviles';
  if (t.match(/television|monitor|tv|pantalla|oled|qled/)) return 'TV y Monitores';
  if (t.match(/auricular|audio|altavoz|sonido|airpods|earbuds/)) return 'Audio';
  if (t.match(/ordenador|portatil|laptop|tablet|ipad|macbook/)) return 'Informatica';
  if (t.match(/camara|foto|objetivo|gopro|drone/)) return 'Camaras';
  if (t.match(/robot|aspiradora|cocina|freidora|cafetera|hogar|lavadora/)) return 'Hogar';
  if (t.match(/juego|playstation|xbox|nintendo|gaming|consola|steam/)) return 'Gaming';
  if (t.match(/ropa|zapatilla|calzado|moda|nike|adidas/)) return 'Moda';
  if (t.match(/libro|kindle|ebook/)) return 'Libros';
  if (t.match(/herramienta|bricolaje|jardin|taladr/)) return 'Bricolaje';
  return 'Oferta';
}

function extractDescuento(titulo) {
  const m = titulo.match(/-(\d+)\s*%/);
  return m ? parseInt(m[1]) : null;
}

function extractPrecio(titulo, content) {
  const texto = titulo + ' ' + (content || '');
  const m = texto.match(/(\d+[,.]?\d*)\s*€/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

function getDealsEjemplo() {
  return [
    {
      id: 'ej1',
      titulo: 'Echo Dot 5a Gen - Altavoz inteligente Alexa con sonido mejorado',
      enlace: `https://www.amazon.es/dp/B09B8YWXDF?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/71GTpNiNkCL._AC_SL1000_.jpg',
      precio: 21.99,
      precioAntes: 54.99,
      descuento: 60,
      categoria: 'Hogar',
      fecha: new Date().toISOString(),
      votos: 342,
      esAmazon: true,
    },
    {
      id: 'ej2',
      titulo: 'Samsung Galaxy Buds2 Pro - Cancelacion activa de ruido, sonido 360',
      enlace: `https://www.amazon.es/dp/B0B4BSMFBD?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/71VEEqP8g3L._AC_SL1500_.jpg',
      precio: 89.00,
      precioAntes: 229.00,
      descuento: 61,
      categoria: 'Audio',
      fecha: new Date().toISOString(),
      votos: 218,
      esAmazon: true,
    },
    {
      id: 'ej3',
      titulo: 'Xiaomi Redmi Note 13 Pro 5G - 256GB, AMOLED 120Hz, Camara 200MP',
      enlace: `https://www.amazon.es/dp/B0CJMPQ2DY?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/81MsHD7oNHL._AC_SL1500_.jpg',
      precio: 199.99,
      precioAntes: 399.99,
      descuento: 50,
      categoria: 'Moviles',
      fecha: new Date().toISOString(),
      votos: 567,
      esAmazon: true,
    },
    {
      id: 'ej4',
      titulo: 'Kindle Paperwhite 16GB - Pantalla 6.8 sin reflejos, resistente al agua',
      enlace: `https://www.amazon.es/dp/B09TMZKQR3?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/61e1MhMVOlL._AC_SL1000_.jpg',
      precio: 94.99,
      precioAntes: 159.99,
      descuento: 41,
      categoria: 'Libros',
      fecha: new Date().toISOString(),
      votos: 423,
      esAmazon: true,
    },
    {
      id: 'ej5',
      titulo: 'Fire TV Stick 4K Max - Streaming Ultra HD con Alexa integrada',
      enlace: `https://www.amazon.es/dp/B09BZZ3MM9?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/61fMYbYNWKL._AC_SL1000_.jpg',
      precio: 34.99,
      precioAntes: 74.99,
      descuento: 53,
      categoria: 'TV y Monitores',
      fecha: new Date().toISOString(),
      votos: 301,
      esAmazon: true,
    },
    {
      id: 'ej6',
      titulo: 'Instant Pot Duo 7en1 - Olla electrica presion 5.7L, 14 programas',
      enlace: `https://www.amazon.es/dp/B07RCNHTLS?tag=${AFFILIATE_TAG}`,
      imagen: 'https://m.media-amazon.com/images/I/71nDQKPSwnL._AC_SL1500_.jpg',
      precio: 59.00,
      precioAntes: 119.99,
      descuento: 51,
      categoria: 'Hogar',
      fecha: new Date().toISOString(),
      votos: 189,
      esAmazon: true,
    },
  ];
}

let cache = { deals: null, timestamp: 0 };

async function fetchDeals() {
  if (cache.deals && Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) {
    return cache.deals;
  }

  const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' },
  });

  const feeds = [
    'https://www.chollometro.com/rss',
    'https://www.dealabs.com/rss',
  ];

  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const parsed = feed.items.slice(0, 25).map((item, i) => {
        const content = item.content || item.summary || '';
        const amazonLink = extractAmazonLink(content, item.link || '');
        const img = extractImageFromContent(content);
        const desc = extractDescuento(item.title || '');
        const precio = extractPrecio(item.title || '', content);
        const cat = getCategoriaDesdeTexto(item.title || '');
        return {
          id: `rss-${Date.now()}-${i}`,
          titulo: item.title || 'Oferta',
          enlace: amazonLink,
          imagen: img,
          precio: precio,
          precioAntes: precio && desc ? Math.round(precio / (1 - desc / 100) * 100) / 100 : null,
          descuento: desc,
          categoria: cat,
          fecha: item.pubDate || new Date().toISOString(),
          votos: Math.floor(Math.random() * 300) + 20,
          esAmazon: !!(amazonLink && amazonLink.includes('amazon')),
        };
      });
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
    res.status(200).json({ deals: getDealsEjemplo(), total: 6 });
  }
}
