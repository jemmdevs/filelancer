# FileLancer

FileLancer es una aplicación web moderna para compartir archivos de forma segura a través de enlaces y códigos QR. Construida con Next.js 15, MongoDB y Vercel Blob.

## Características

- 🔐 **Registro y autenticación de usuarios**
- 📤 **Subida de archivos** con almacenamiento en Vercel Blob
- 🔗 **Compartir mediante enlaces** y códigos QR
- 🔑 **Protección con contraseña** para archivos compartidos
- ⏱️ **Enlaces con caducidad** automática
- 📊 **Estadísticas** de descargas
- 👑 **Panel de administración** para gestionar usuarios y archivos

## Tecnologías utilizadas

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: API Routes de Next.js
- **Autenticación**: NextAuth.js
- **Base de datos**: MongoDB con Mongoose
- **Almacenamiento**: Vercel Blob
- **Despliegue**: Vercel

## Requisitos previos

- Node.js 18.0 o superior
- Cuenta en MongoDB Atlas
- Cuenta en Vercel (para Vercel Blob)

## Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/filelancer.git
   cd filelancer
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.local.example` a `.env.local`
   - Actualiza las variables con tus propias credenciales

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
filelancer/
├── app/               # Código de la aplicación (Next.js App Router)
│   ├── api/           # API Routes para el backend
│   ├── components/    # Componentes React reutilizables
│   ├── lib/           # Funciones de utilidad y configuraciones
│   ├── models/        # Modelos de Mongoose para MongoDB
│   └── providers/     # Proveedores de contexto de React
├── public/            # Archivos estáticos
└── ...                # Archivos de configuración
```

## Despliegue

La forma más sencilla de desplegar esta aplicación es usando Vercel:

1. Sube tu código a GitHub
2. Conecta tu repositorio en Vercel
3. Configura las variables de entorno en Vercel
4. ¡Listo! Vercel desplegará automáticamente tu aplicación

## Configuración para producción

Para un entorno de producción, asegúrate de:

1. Configurar correctamente el secreto de NextAuth
2. Configurar las restricciones CORS adecuadas
3. Implementar límites de tamaño para las cargas de archivos
4. Configurar MongoDB con usuario y contraseña

## Licencia

[MIT](LICENSE)
