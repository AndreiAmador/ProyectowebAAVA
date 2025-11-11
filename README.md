# Plataforma Local de Servicios (MVP)
Módulos: Registro/Login, Perfil, Currículum (trabajos realizados) y Publicaciones (feed en Home).
Sin backend: usa LocalStorage.

## Páginas
- `index.html` → muestra el feed de “Servicios locales”.
- `login.html` → inicio de sesión (requiere que exista el usuario).
- `registro.html` → alta de usuario nuevo.
- `perfil.html` → editar perfil + añadir trabajos al currículum (con imagen opcional).
- `publicar.html` → crear publicaciones “tipo Facebook”.

## Notas
- Bootstrap 5 vía CDN.
- Si tu `login.html` usa otros IDs, ajusta el pequeño script (busca: `#loginForm`, `#emailInput`, `#passwordInput`).

## Flujo básico
1) Registrar usuario → redirige a perfil.
2) Completar perfil y guardar.
3) Añadir 1-2 trabajos al CV.
4) Publicar servicio → aparece en `index.html`.
