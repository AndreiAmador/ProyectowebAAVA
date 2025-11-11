const App = (() => {
  const KEYS = {
    USUARIOS: "usuarios",
    ACTIVO: "usuarioActivo",
    PERFILES: "perfiles",
    SERVICIOS: "servicios",
    CVS: "curriculums"
  };

  const get = (k, d=[]) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const activo = () => JSON.parse(localStorage.getItem(KEYS.ACTIVO) || "null");

  // ---------- Auth ----------
  function registrar({nombre, correo, password}) {
    const usuarios = get(KEYS.USUARIOS);
    if (usuarios.some(u => u.correo === correo)) {
      alert("Ese correo ya existe");
      return;
    }
    usuarios.push({nombre, correo, password});
    set(KEYS.USUARIOS, usuarios);
    localStorage.setItem(KEYS.ACTIVO, JSON.stringify({nombre, correo}));
    alert("Cuenta creada. ¡Bienvenido!");
    location.href = "perfil.html";
  }

  function requiereLogin() {
    const user = activo();
    if (!user) { location.href = "login.html"; return; }
    const who = document.getElementById('who');
    if (who) who.textContent = `Sesión: ${user.nombre} (${user.correo})`;
  }

  function logout() {
    localStorage.removeItem(KEYS.ACTIVO);
    location.href = "index.html";
  }

  // ---------- Perfil ----------
  function cargarPerfilEnFormulario() {
    const user = activo(); if (!user) return;
    const perfiles = get(KEYS.PERFILES);
    const p = perfiles.find(x => x.correo === user.correo) || {};
    const by = id => document.getElementById(id);
    (by('pfNombre')||{}).value = p.nombre || (user && user.nombre) || "";
    (by('pfRubro')||{}).value  = p.rubro  || "";
    (by('pfBio')||{}).value    = p.bio    || "";
    (by('pfTelefono')||{}).value = p.telefono || "";
    (by('pfLink')||{}).value   = p.link   || "";
    (by('pfFoto')||{}).value   = p.foto   || "";
  }

  function guardarPerfil(data) {
    const user = activo(); if (!user) return;
    let perfiles = get(KEYS.PERFILES);
    const i = perfiles.findIndex(x => x.correo === user.correo);
    const perfil = {...data, correo: user.correo};
    if (i >= 0) perfiles[i] = perfil; else perfiles.push(perfil);
    set(KEYS.PERFILES, perfiles);
    alert("Perfil guardado");
  }

  // ---------- CV (trabajos realizados) ----------
  function agregarCV(item) {
    const user = activo(); if (!user) return;
    const cvs = get(KEYS.CVS);
    const id = Date.now();
    cvs.push({ id, autor: user.correo, ...item, fecha: new Date().toISOString() });
    set(KEYS.CVS, cvs);
    renderCV();
  }

  function renderCV() {
    const cont = document.getElementById('listaCV'); if (!cont) return;
    const user = activo(); if (!user) return;
    const cvs = get(KEYS.CVS).filter(x => x.autor === user.correo).reverse();
    cont.innerHTML = cvs.map(cv => `
      <div class="col-md-6">
        <div class="card h-100 shadow-sm">
          ${cv.imagen ? `<img src="${cv.imagen}" class="card-img-top" alt="${cv.titulo}">` : ""}
          <div class="card-body">
            <h6 class="card-title mb-1">${cv.titulo || 'Trabajo realizado'}</h6>
            <p class="card-text small">${cv.descripcion || ''}</p>
            <span class="badge text-bg-light">${new Date(cv.fecha).toLocaleString()}</span>
          </div>
        </div>
      </div>
    `).join('') || `<p class="text-muted">Aún no agregas trabajos a tu CV.</p>`;
  }

  // ---------- Publicaciones de servicios ----------
  function publicarServicio(s) {
    const user = activo(); if (!user) return;
    const servicios = get(KEYS.SERVICIOS);
    const id = Date.now();
    servicios.push({ id, autor: user.correo, ...s, fecha: new Date().toISOString() });
    set(KEYS.SERVICIOS, servicios);
    alert("¡Servicio publicado!");
    location.href = "index.html";
  }

  function renderServiciosEnHome() {
    const cont = document.getElementById('listaServicios'); if (!cont) return;
    const servicios = get(KEYS.SERVICIOS).slice().reverse();
    const perfiles = get(KEYS.PERFILES);

    cont.innerHTML = servicios.map(s => {
      const autor = perfiles.find(p => p.correo === s.autor) || {};
      const foto = autor.foto || "https://via.placeholder.com/64";
      return `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${s.imagen || 'https://via.placeholder.com/600x300'}" class="card-img-top" alt="${s.titulo}">
          <div class="card-body">
            <h5 class="card-title">${s.titulo}</h5>
            <p class="card-text small text-muted">${s.categoria||''} · $${s.precio||0} MXN</p>
            <p class="card-text">${s.descripcion||''}</p>
            <div class="d-flex align-items-center gap-2">
              <img src="${foto}" width="32" height="32" style="border-radius:999px;">
              <div class="small">
                <div>${autor.nombre||'Profesional local'}</div>
                <div class="text-muted">
                  ${autor.rubro||''} ${autor.telefono?`· ${autor.telefono}`:''}
                  ${autor.link?`· <a href="${autor.link}" target="_blank">link</a>`:''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('') || `<p class="text-muted">Aún no hay publicaciones. ¡Sé el primero en publicar!</p>`;
  }

  return {
    registrar, requiereLogin, logout,
    cargarPerfilEnFormulario, guardarPerfil,
    agregarCV, renderCV,
    publicarServicio, renderServiciosEnHome
  };
})();
