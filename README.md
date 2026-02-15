# PolarReact - Frontend Dashboard

Aplicación Frontend construida con **Next.js 14**, diseñada para consumir la API de `PolarAPI`.

## Requisitos
- Docker y Docker Compose instalados.
- Puerto **3000** libre (o modificado en `docker-compose.yml`).
- Backend `PolarAPI` corriendo en `http://api.polar.localhost:8090`. o confirgurar el . env de este proyecto para conectar ambos proyectos

## Instalación y Ejecución con Docker

### 1. Configuración de Entorno
Asegúrate de tener el archivo `.env` configurado para apuntar al backend público:

```ini
NEXT_PUBLIC_API_URL=http://api.polar.localhost:8090/api
```

### 2. Configurar Hosts (Windows)
Para acceder usando el dominio personalizado, edita tu archivo `hosts` (`C:\Windows\System32\drivers\etc\hosts`) y agrega:
```text
127.0.0.1 polar-front.localhost
```

### 3. Levantar el Proyecto
Ejecuta el siguiente comando para construir y levantar el contenedor en modo desarrollo:

```powershell
docker-compose up -d --build
```

Esto iniciará el contenedor `polar_react` en el puerto **3000**.

> **Nota**: Si el puerto 3000 está ocupado, detén cualquier proceso de Node local (`Ctrl + C`) o modifica el mapeo de puertos en `docker-compose.yml`.

## Acceso
Una vez levantado, accede a la aplicación en:
👉 **[http://polar-front.localhost:3000](http://polar-front.localhost:3000)**

## Comandos Útiles

**Ver logs del contenedor (para debug):**
```powershell
docker logs -f polar_react
```

**Detener el contenedor:**
```powershell
docker-compose down
```

**Reconstruir imagen (si agregas dependencias):**
```powershell
docker-compose up -d --build
```
