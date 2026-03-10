import Parser from 'rss-parser';

const AFFILIATE_TAG = 'chollomaste0e-21';

function buildDirectLink(asin) {
  return `https://www.amazon.es/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

function buildSearchLink(titulo) {
  return `https://www.amazon.es/s?k=${encodeURIComponent(titulo.slice(0, 60))}&tag=${AFFILIATE_TAG}`;
}

function extractASIN(text) {
  if (!text) return null;
  const patrones = [
    /amazon\.es\/dp\/([B][A-Z0-9]{9})/,
    /amazon\.es\/gp\/product\/([B][A-Z0-9]{9})/,
    /amazon\.es\/[^/]+\/dp\/([B][A-Z0-9]{9})/,
    /\/dp\/([B][A-Z0-9]{9})/,
    /\/gp\/product\/([B][A-Z0-9]{9})/,
    /\/(B[A-Z0-9]{9})(?:\/|\?|&|"|\s)/,
    /asin[=:]([B][A-Z0-9]{9})/i,
    /ASIN%3D([B][A-Z0-9]{9})/i,
    /"asin":"([B][A-Z0-9]{9})"/i,
    /data-asin="([B][A-Z0-9]{9})"/i,
  ];
  for (const p of patrones) {
    const m = text.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

async function getAmazonLinkFromChollometro(url) {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    });

    // Si redirige a Amazon directamente
    if (r.url && r.url.includes('amazon.es')) {
      const asin = extractASIN(r.url);
      if (asin) return buildDirectLink(asin);
    }

    const html = await r.text();

    // Busca el boton "Ir al chollo" o links de Amazon en el HTML
    const patrones = [
      /href="(https?:\/\/(?:www\.)?amazon\.es\/(?:dp|gp\/product)\/[B][A-Z0-9]{9}[^"]*)"/i,
      /href="(https?:\/\/(?:www\.)?amazon\.es\/[^"]*\/dp\/[B][A-Z0-9]{9}[^"]*)"/i,
      /"merchant_link":"(https?:\/\/[^"]*amazon\.es[^"]*)"/i,
      /data-link="(https?:\/\/[^"]*amazon\.es[^"]*)"/i,
    ];

    for (const p of patrones) {
      const m = html.match(p);
      if (m && m[1]) {
        const asin = extractASIN(m[1]);
        if (asin) return buildDirectLink(asin);
        // Si el link ya es de Amazon aunque no tenga ASIN visible
        if (m[1].includes('amazon.es')) {
          try {
            const u = new URL(m[1]);
            u.searchParams.set('tag', AFFILIATE_TAG);
            return u.toString();
          } catch {}
        }
      }
    }

    // Ultimo intento: extraer cualquier ASIN del HTML
    const asin = extractASIN(html);
    if (asin) return buildDirectLink(asin);

  } catch (e) {
    console.log('Error fetching chollometro page:', e.message);
  }
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

function extractDescuento(texto) {
  const m = texto.match(/-\s*(\d+)\s*%/);
  return m ? parseInt(m[1]) : null;
}

function extractPrecios(texto) {
  // Busca patrones como "49,95€" o "19,58€" o "antes: 25€"
  const matches = texto.match(/(\d+[,.]\d{2})\s*€/g) || texto.match(/(\d+)\s*€/g);
  if (!matches || matches.length === 0) return { precio: null, precioAntes: null };
  const precios = matches.map(p => parseFloat(p.replace('€','').replace(',','.').trim()));
  if (precios.length === 1) return { precio: precios[0], precioAntes: null };
  // El precio mas bajo es el actual, el mas alto es el anterior
  const min = Math.min(...precios);
  const max = Math.max(...precios);
  return { precio: min, precioAntes: max > min ? max : null };
}

function calcularAhorro(precio, precioAntes, descuento) {
  if (precio && precioAntes && precioAntes > precio) {
    return Math.round((precioAntes - precio) * 100) / 100;
  }
  if (precio && descuento) {
    const antes = Math.round(precio / (1 - descuento / 100) * 100) / 100;
    return Math.round((antes - precio) * 100) / 100;
  }
  return null;
}

function getDealsEjemplo() {
  return [
    { id: 'ej1', titulo: 'Echo Dot 5a Gen - Altavoz inteligente Alexa', enlace: buildDirectLink('B09B8YWXDF'), imagen: 'https://m.media-amazon.com/images/I/71GTpNiNkCL._AC_SL1000_.jpg', precio: 21.99, precioAntes: 54.99, descuento: 60, ahorro: 33.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 342 },
    { id: 'ej2', titulo: 'Samsung Galaxy Buds2 Pro - Auriculares cancelacion de ruido', enlace: buildDirectLink('B0B4BSMFBD'), imagen: 'https://m.media-amazon.com/images/I/71VEEqP8g3L._AC_SL1500_.jpg', precio: 89.00, precioAntes: 229.00, descuento: 61, ahorro: 140.00, categoria: 'Audio', fecha: new Date().toISOString(), votos: 218 },
    { id: 'ej3', titulo: 'Kindle Paperwhite 16GB - Pantalla 6.8 sin reflejos', enlace: buildDirectLink('B09TMZKQR3'), imagen: 'https://m.media-amazon.com/images/I/61e1MhMVOlL._AC_SL1000_.jpg', precio: 94.99, precioAntes: 159.99, descuento: 41, ahorro: 65.00, categoria: 'Libros', fecha: new Date().toISOString(), votos: 423 },
  ];
}

let cache = { deals: null, timestamp: 0 };

async function fetchDeals() {
  if (cache.deals && Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) return cache.deals;

  const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' },
  });

  const feeds = ['https://www.chollometro.com/rss', 'https://www.dealabs.com/rss'];
  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const parsed = await Promise.all(feed.items.slice(0, 15).map(async (item, i) => {
        const content = item.content || item.summary || item['content:encoded'] || '';
        const titulo = item.title || 'Oferta';
        const itemLink = item.link || item.guid || '';
        const textoCompleto = titulo + ' ' + content;

        // 1. Busca ASIN en el contenido RSS
        let asin = extractASIN(content) || extractASIN(itemLink);
        let enlace = null;

        if (asin) {
          enlace = buildDirectLink(asin);
        } else if (itemLink && (itemLink.includes('chollometro.com') || itemLink.includes('dealabs.com'))) {
          // 2. Entra en la pagina del chollo para encontrar el link de Amazon
          enlace = await getAmazonLinkFromChollometro(itemLink);
        }

        if (!enlace) enlace = buildSearchLink(titulo);

        const img = extractImageFromContent(content);
        const descuento = extractDescuento(textoCompleto);
        const { precio, precioAntes } = extractPrecios(textoCompleto);
        const precioAntesCalc = precioAntes || (precio && descuento ? Math.round(precio / (1 - descuento / 100) * 100) / 100 : null);
        const ahorro = calcularAhorro(precio, precioAntesCalc, descuento);
        const cat = getCategoriaDesdeTexto(titulo);

        return {
          id: `rss-${Date.now()}-${i}`,
          titulo,
          enlace,
          imagen: img,
          precio,
          precioAntes: precioAntesCalc,
          descuento,
          ahorro,
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
