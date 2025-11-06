const LS = {
  get(k, d= null){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
  push(k, item){
    const arr = LS.get(k, []);
    arr.push(item); LS.set(k, arr);
  }
};

const App = {
  requiereLogin(){
    const u = LS.get("usuarioActivo");
    if(!u){ alert("Debes iniciar sesión"); location.href = "login.html"; }
  },
  logout(){
    localStorage.removeItem("usuarioActivo");
    location.href = "index.html";
  },
  registrar({nombre, correo, password}){
    const usuarios = LS.get("usuarios", []);
    if(usuarios.find(u=>u.correo===correo)){ alert("Correo ya registrado"); return; }
    usuarios.push({nombre, correo, password, perfil:{}, cv:[]});
    LS.set("usuarios", usuarios);
    alert("Registro exitoso, ahora inicia sesión");
    location.href = "login.html";
  },
  
  cargarPerfilEnFormulario(){
    const who = LS.get("usuarioActivo"); if(!who) return;
    const usuarios = LS.get("usuarios", []);
    const yo = usuarios.find(u=>u.correo===who.correo);
    document.getElementById("who").textContent = `Sesión: ${who.nombre} (${who.correo})`;
    const p = yo.perfil || {};
    (pfNombre.value = p.nombre || who.nombre);
    (pfRubro.value  = p.rubro  || "");
    (pfBio.value    = p.bio    || "");
    (pfTelefono.value= p.telefono || "");
    (pfLink.value   = p.link   || "");
    (pfFoto.value   = p.foto   || "");
  },
  guardarPerfil(perfil){
    const who = LS.get("usuarioActivo"); if(!who) return;
    const usuarios = LS.get("usuarios", []);
    const yo = usuarios.find(u=>u.correo===who.correo);
    yo.perfil = perfil;
    LS.set("usuarios", usuarios);
    alert("Perfil guardado");
  },
  
  agregarCV({titulo, descripcion, imagen}){
    const who = LS.get("usuarioActivo"); if(!who) return;
    const usuarios = LS.get("usuarios", []);
    const yo = usuarios.find(u=>u.correo===who.correo);
    yo.cv = yo.cv || [];
    yo.cv.push({titulo, descripcion, imagen, fecha: new Date().toISOString()});
    LS.set("usuarios", usuarios);
    App.renderCV();
  },
  renderCV(){
    const who = LS.get("usuarioActivo"); if(!who) return;
    const usuarios = LS.get("usuarios", []);
    const yo = usuarios.find(u=>u.correo===who.correo);
    const cont = document.getElementById("listaCV");
    if(!cont) return;
    cont.innerHTML = "";
    (yo.cv||[]).forEach(item=>{
      const col = document.createElement("div");
      col.className = "col-md-6";
      col.innerHTML = `
        <div class="card h-100">
          ${item.imagen ? `<img src="${item.imagen}" class="card-img-top" alt="cv">` : ""}
          <div class="card-body">
            <h5 class="card-title">${item.titulo}</h5>
            <p class="card-text">${item.descripcion}</p>
            <small class="text-muted">${new Date(item.fecha).toLocaleString()}</small>
          </div>
        </div>`;
      cont.appendChild(col);
    });
  },
  
  publicarServicio({titulo, categoria, descripcion, precio, imagen}){
    const who = LS.get("usuarioActivo"); if(!who) return;
    const usuarios = LS.get("usuarios", []);
    const yo = usuarios.find(u=>u.correo===who.correo);
    const perfil = yo.perfil || { nombre: who.nombre };
    const post = {
      id: crypto.randomUUID?.() || String(Date.now()),
      titulo, categoria, descripcion, precio, imagen,
      autor: {nombre: perfil.nombre || who.nombre, correo: who.correo, rubro: perfil.rubro || "" },
      fecha: new Date().toISOString()
    };
    LS.push("posts", post);
    alert("Publicado");
    location.href = "perfil.html";
  },
  renderServiciosEnHome(){
    const cont = document.getElementById("listaServicios");
    if(!cont) return;
    const posts = (LS.get("posts", [])).slice().reverse();
    cont.innerHTML = "";
    posts.forEach(p=>{
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card h-100">
          ${p.imagen ? `<img src="${p.imagen}" class="card-img-top" alt="servicio">` : ""}
          <div class="card-body">
            <h5 class="card-title">${p.titulo}</h5>
            <p class="card-text">${p.descripcion || ""}</p>
            <p class="card-text"><strong>Categoria:</strong> ${p.categoria}</p>
            <p class="card-text"><strong>Precio:</strong> $${(p.precio||0).toLocaleString()}</p>
            <hr>
            <p class="small text-muted">Por: ${p.autor?.nombre || "Anónimo"} ${p.autor?.rubro? "("+p.autor.rubro+")":""}</p>
          </div>
        </div>`;
      cont.appendChild(col);
    });
  }
};