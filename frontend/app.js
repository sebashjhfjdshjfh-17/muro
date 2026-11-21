const API = window.APP_CONFIG.API_URL;
const $ = (id) => document.getElementById(id);

// fetch con tiempo maximo: la API gratuita de Render puede tardar ~1 minuto en despertar.
async function pedir(ruta, opciones = {}, ms = 70000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(API + ruta, { ...opciones, signal: ctrl.signal });
    const datos = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(datos.error || 'Error ' + res.status);
    return datos;
  } finally {
    clearTimeout(t);
  }
}

function avisoDeRed() {
  return 'No se pudo conectar con la API. Revisa la URL en config.js, que la API esté activa y que ALLOWED_ORIGIN incluya la URL de este sitio.';
}

async function despertarAPI() {
  const aviso = setTimeout(() => {
    $('estado').textContent = 'Despertando la API… el plan gratuito de Render puede tardar cerca de un minuto.';
  }, 3000);
  try {
    await pedir('/health');
    $('estado').textContent = 'API activa en ' + API;
    $('estado').className = 'estado ok';
    cargarMuro();
  } catch (e) {
    $('estado').textContent = avisoDeRed();
    $('estado').className = 'estado mal';
  } finally {
    clearTimeout(aviso);
  }
}

async function cargarMuro() {
  const items = await pedir('/api/muro');
  const ul = $('lista');
  ul.innerHTML = '';
  items.forEach((it) => {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = it.nombre;           // textContent: evita inyectar HTML
    li.append(b, ': ' + it.mensaje);
    ul.appendChild(li);
  });
}

$('f-saludo').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const r = await pedir('/api/saludo?nombre=' + encodeURIComponent($('nombre-s').value));
    $('saludo').textContent = r.mensaje;
  } catch (err) { $('saludo').textContent = avisoDeRed(); }
});

$('f-muro').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('error').textContent = '';
  try {
    await pedir('/api/muro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: $('nombre-m').value, mensaje: $('mensaje-m').value })
    });
    $('mensaje-m').value = '';
    cargarMuro();
  } catch (err) { $('error').textContent = err.message.startsWith('Error') || err.message.includes('obligatorios') ? err.message : avisoDeRed(); }
});

despertarAPI();