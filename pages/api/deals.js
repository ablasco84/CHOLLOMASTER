// pages/api/deals.js
// API de ofertas para CholloMaster
// TODO: Conectar con Amazon PA-API 5.0 cuando tengas las claves
// Por ahora usa catalogo demo rotativo que simula ofertas reales

const AFFILIATE_TAG = "chollomaste0e-21";

// Catalogo amplio de productos reales de Amazon
const CATALOGO_COMPLETO = [
  // TECNOLOGIA
  { nombre: "Echo Pop - Altavoz inteligente con Alexa", categoria: "Tecnología", precioOriginal: 54.99, precioOferta: 27.99, descuento: 49, imagen: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop", asin: "B09ZX7MS5B", votos: 342 },
  { nombre: "Fire TV Stick HD - Mando por voz con Alexa", categoria: "Tecnología", precioOriginal: 49.99, precioOferta: 24.99, descuento: 50, imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", asin: "B0CHX33TFL", votos: 312 },
  { nombre: "Kindle 16GB - Pantalla sin reflejos 6 pulgadas", categoria: "Tecnología", precioOriginal: 129.99, precioOferta: 94.99, descuento: 27, imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", asin: "B0CHX6JD7P", votos: 423 },
  { nombre: "Samsung Galaxy Buds FE - Cancelación activa de ruido", categoria: "Tecnología", precioOriginal: 109.00, precioOferta: 59.99, descuento: 45, imagen: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", asin: "B0CGJLZFWF", votos: 287 },
  { nombre: "Logitech G203 - Ratón gaming 8000 DPI", categoria: "Tecnología", precioOriginal: 39.99, precioOferta: 19.99, descuento: 50, imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop", asin: "B07W6JN5PY", votos: 198 },
  { nombre: "Apple AirTag (Pack de 4)", categoria: "Tecnología", precioOriginal: 129.00, precioOferta: 94.90, descuento: 26, imagen: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400&h=400&fit=crop", asin: "B0933BVK6T", votos: 541 },
  { nombre: "SanDisk Ultra microSDXC 256GB Clase 10", categoria: "Tecnología", precioOriginal: 39.99, precioOferta: 18.99, descuento: 53, imagen: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop", asin: "B0B7NTY2S6", votos: 876 },
  { nombre: "TP-Link Tapo C200 - Cámara WiFi 360° Full HD", categoria: "Tecnología", precioOriginal: 34.99, precioOferta: 21.99, descuento: 37, imagen: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop", asin: "B07XLML2YS", votos: 432 },
  { nombre: "Xiaomi Redmi Buds 4 Active - Auriculares Bluetooth", categoria: "Tecnología", precioOriginal: 24.99, precioOferta: 14.99, descuento: 40, imagen: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop", asin: "B0CB2FD8W6", votos: 156 },
  { nombre: "Crucial RAM 16GB DDR4 3200MHz SODIMM", categoria: "Tecnología", precioOriginal: 49.99, precioOferta: 28.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop", asin: "B08C511GQH", votos: 234 },

  // HOGAR
  { nombre: "iRobot Roomba Combo Essential - Robot aspirador y fregasuelos", categoria: "Hogar", precioOriginal: 299.00, precioOferta: 179.00, descuento: 40, imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", asin: "B0D4JJFQ7R", votos: 678 },
  { nombre: "Philips Airfryer Essential XL 6.2L", categoria: "Hogar", precioOriginal: 149.99, precioOferta: 89.99, descuento: 40, imagen: "https://images.unsplash.com/photo-1648824087498-65c1f55e6a80?w=400&h=400&fit=crop", asin: "B09BJCZ2LG", votos: 523 },
  { nombre: "Cecotec Conga 2290 Ultra - Aspirador robot", categoria: "Hogar", precioOriginal: 249.00, precioOferta: 149.00, descuento: 40, imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", asin: "B07ZQR32GL", votos: 345 },
  { nombre: "Bosch Serie 4 - Batidora de mano 1000W", categoria: "Hogar", precioOriginal: 79.99, precioOferta: 44.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", asin: "B08YNFC1GH", votos: 189 },
  { nombre: "COSORI Air Fryer 5.5L - Con 11 programas", categoria: "Hogar", precioOriginal: 119.99, precioOferta: 69.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1648824087498-65c1f55e6a80?w=400&h=400&fit=crop", asin: "B0936FGLQS", votos: 412 },
  { nombre: "Oral-B Pro 3 3000 - Cepillo eléctrico Braun", categoria: "Hogar", precioOriginal: 99.99, precioOferta: 44.99, descuento: 55, imagen: "https://images.unsplash.com/photo-1559591937-ebc1e02f3e5c?w=400&h=400&fit=crop", asin: "B08DFDMGBY", votos: 567 },
  { nombre: "Tiras LED WiFi 10M - Compatible Alexa y Google", categoria: "Hogar", precioOriginal: 29.99, precioOferta: 12.99, descuento: 57, imagen: "https://images.unsplash.com/photo-1550535424-b498819c9e95?w=400&h=400&fit=crop", asin: "B09B7G3P3T", votos: 234 },
  { nombre: "Braun Series 5 51-B1200s - Afeitadora eléctrica", categoria: "Hogar", precioOriginal: 119.99, precioOferta: 64.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", asin: "B09MKGTVYQ", votos: 298 },

  // DEPORTE
  { nombre: "Xiaomi Smart Band 8 - Pulsera de actividad AMOLED", categoria: "Deporte", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", asin: "B0CGRN2DKZ", votos: 456 },
  { nombre: "Nike Revolution 6 - Zapatillas running hombre", categoria: "Deporte", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", asin: "B09VF7B9KB", votos: 321 },
  { nombre: "Gritin Bandas Elásticas - Set 5 cintas fitness", categoria: "Deporte", precioOriginal: 12.99, precioOferta: 6.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", asin: "B07MBH9SJQ", votos: 876 },
  { nombre: "Under Armour Tech 2.0 - Camiseta técnica hombre", categoria: "Deporte", precioOriginal: 30.00, precioOferta: 15.95, descuento: 47, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", asin: "B071HNJHVL", votos: 234 },
  { nombre: "Fitbit Charge 6 - Pulsómetro GPS integrado", categoria: "Deporte", precioOriginal: 159.95, precioOferta: 99.95, descuento: 38, imagen: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", asin: "B0CCJ4MGQQ", votos: 345 },
  { nombre: "Adidas Duramo SL - Zapatillas running mujer", categoria: "Deporte", precioOriginal: 54.99, precioOferta: 29.99, descuento: 45, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", asin: "B0BXQKK43T", votos: 187 },

  // GAMING
  { nombre: "Mando inalámbrico Xbox - Carbon Black", categoria: "Gaming", precioOriginal: 59.99, precioOferta: 39.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop", asin: "B08DF248LD", votos: 567 },
  { nombre: "SteelSeries Arctis Nova 1 - Auriculares gaming", categoria: "Gaming", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", asin: "B0B15QMK1G", votos: 234 },
  { nombre: "Razer DeathAdder V3 HyperSpeed - Ratón gaming wireless", categoria: "Gaming", precioOriginal: 99.99, precioOferta: 64.99, descuento: 35, imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop", asin: "B0CGJ2SLPH", votos: 189 },
  { nombre: "HyperX Cloud Stinger 2 Core - Auriculares gaming PC", categoria: "Gaming", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", asin: "B0CGXHNTFJ", votos: 321 },
  { nombre: "Trust GXT 256 Exxo - Micrófono USB streaming", categoria: "Gaming", precioOriginal: 54.99, precioOferta: 29.99, descuento: 45, imagen: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop", asin: "B086GQ7V3L", votos: 145 },

  // MODA
  { nombre: "Levi's 501 Original - Vaqueros hombre", categoria: "Moda", precioOriginal: 110.00, precioOferta: 54.99, descuento: 50, imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", asin: "B07D3Q41W1", votos: 432 },
  { nombre: "Casio F-91W-1YER - Reloj digital clásico", categoria: "Moda", precioOriginal: 22.00, precioOferta: 11.50, descuento: 48, imagen: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop", asin: "B000J34HN4", votos: 1243 },
  { nombre: "Jack & Jones - Sudadera con capucha hombre", categoria: "Moda", precioOriginal: 39.99, precioOferta: 19.99, descuento: 50, imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", asin: "B09FJ3XJ3V", votos: 198 },
  { nombre: "Tommy Hilfiger - Cinturón piel reversible hombre", categoria: "Moda", precioOriginal: 49.90, precioOferta: 27.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", asin: "B07C4W9F3X", votos: 276 },

  // BEBÉ Y NIÑOS
  { nombre: "LEGO Classic 10698 - Caja grande de ladrillos 790 piezas", categoria: "Niños", precioOriginal: 49.99, precioOferta: 29.99, descuento: 40, imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", asin: "B00NHQF6MG", votos: 654 },
  { nombre: "Dodot Sensitive Talla 2 (4-8kg) - 240 pañales", categoria: "Bebé", precioOriginal: 59.99, precioOferta: 37.99, descuento: 37, imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", asin: "B08FDQ4YNG", votos: 876 },
  { nombre: "Playmobil City Life 70190 - Hospital grande", categoria: "Niños", precioOriginal: 89.99, precioOferta: 49.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", asin: "B07NRWHDZD", votos: 213 },

  // ALIMENTACIÓN Y SUPERMERCADO
  { nombre: "Finish Powerball Todo en 1 - 100 pastillas lavavajillas", categoria: "Supermercado", precioOriginal: 24.99, precioOferta: 13.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", asin: "B0C7G5FVJ5", votos: 987 },
  { nombre: "Fairy Ultra Poder - Pack 3x780ml", categoria: "Supermercado", precioOriginal: 11.97, precioOferta: 6.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", asin: "B07WFHGCPZ", votos: 543 },
  { nombre: "Nespresso Cápsulas compatibles - Pack 100 uds", categoria: "Supermercado", precioOriginal: 34.99, precioOferta: 18.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", asin: "B0BG6KFPQT", votos: 654 },

  // MASCOTAS
  { nombre: "Purina Felix Fantastic - 80 sobres gato", categoria: "Mascotas", precioOriginal: 32.99, precioOferta: 19.99, descuento: 39, imagen: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop", asin: "B09KMGLZ32", votos: 345 },
  { nombre: "FEANDREA Rascador para gatos 143cm multinivel", categoria: "Mascotas", precioOriginal: 59.99, precioOferta: 36.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop", asin: "B07BHRB58T", votos: 432 },

  // LIBROS Y PAPELERÍA
  { nombre: "Pack 12 BIC Cristal Original - Bolígrafos punta media", categoria: "Papelería", precioOriginal: 7.19, precioOferta: 3.59, descuento: 50, imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", asin: "B000I5ZK2Q", votos: 1432 },
  { nombre: "Moleskine Cuaderno clásico - Tapa dura A5", categoria: "Papelería", precioOriginal: 19.50, precioOferta: 11.99, descuento: 39, imagen: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop", asin: "B015NG45G0", votos: 321 },

  // HERRAMIENTAS
  { nombre: "Bosch Professional GSR 12V-15 - Taladro atornillador", categoria: "Herramientas", precioOriginal: 129.00, precioOferta: 79.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", asin: "B00TJ2P19Q", votos: 567 },
  { nombre: "Stanley STHT0-51309 - Martillo fibra vidrio 450g", categoria: "Herramientas", precioOriginal: 18.99, precioOferta: 9.99, descuento: 47, imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", asin: "B001TK3CQU", votos: 234 },
  { nombre: "Dremel 3000 - Multiherramienta 130W + 15 accesorios", categoria: "Herramientas", precioOriginal: 79.95, precioOferta: 44.95, descuento: 44, imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", asin: "B003BYO5ZI", votos: 432 },

  // SALUD
  { nombre: "Omron X3 Comfort - Tensiómetro de brazo automático", categoria: "Salud", precioOriginal: 69.99, precioOferta: 39.99, descuento: 43, imagen: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop", asin: "B07KY7GJX5", votos: 654 },
  { nombre: "Durex Sensitivo Contacto Total - Pack 24 preservativos", categoria: "Salud", precioOriginal: 19.95, precioOferta: 11.49, descuento: 42, imagen: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop", asin: "B07YWJB2RH", votos: 345 },
];

// Funcion para barajar array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generar variaciones de precio para simular cambios
function variarPrecio(producto) {
  const variacion = 1 + (Math.random() * 0.06 - 0.03); // +-3%
  const nuevoPrecioOferta = Math.round(producto.precioOferta * variacion * 100) / 100;
  const nuevoDescuento = Math.round((1 - nuevoPrecioOferta / producto.precioOriginal) * 100);
  const votosExtra = Math.floor(Math.random() * 20);
  return {
    ...producto,
    precioOferta: nuevoPrecioOferta,
    descuento: nuevoDescuento,
    votos: producto.votos + votosExtra,
  };
}

export default function handler(req, res) {
  const { categoria, limit = 30, page = 1 } = req.query;
  const limitNum = Math.min(parseInt(limit) || 30, 50);
  const pageNum = parseInt(page) || 1;

  let productos = CATALOGO_COMPLETO;

  // Filtrar por categoria si se pide
  if (categoria && categoria !== "Todos") {
    productos = productos.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  // Barajar y variar precios para simular actualizacion
  productos = shuffle(productos).map(variarPrecio);

  // Paginar
  const start = (pageNum - 1) * limitNum;
  const paginados = productos.slice(start, start + limitNum);

  // Añadir metadatos
  const ofertas = paginados.map((p, i) => ({
    id: `${p.asin}-${Date.now()}-${i}`,
    ...p,
    url: `https://www.amazon.es/dp/${p.asin}?tag=${AFFILIATE_TAG}`,
    ahorro: Math.round((p.precioOriginal - p.precioOferta) * 100) / 100,
    tiempoPublicado: generarTiempoAleatorio(),
  }));

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  res.status(200).json({
    ofertas,
    total: productos.length,
    pagina: pageNum,
    porPagina: limitNum,
    categorias: [...new Set(CATALOGO_COMPLETO.map((p) => p.categoria))],
    ultimaActualizacion: new Date().toISOString(),
  });
}

function generarTiempoAleatorio() {
  const minutos = Math.floor(Math.random() * 120);
  if (minutos < 1) return "Ahora mismo";
  if (minutos < 60) return `Hace ${minutos}min`;
  const horas = Math.floor(minutos / 60);
  return `Hace ${horas}h`;
}
