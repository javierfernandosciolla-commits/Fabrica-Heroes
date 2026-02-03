# 🦸 Fábrica de Héroes - Backend

Backend completo para la aplicación "Fábrica de Héroes" con integración de APIs de IA, pagos y envío de emails.

## 🚀 Características

- ✅ Generación de historias con ChatGPT API
- ✅ Generación de imágenes con Hugging Face
- ✅ Integración con MercadoPago para pagos en ARS
- ✅ Generación de PDFs personalizados
- ✅ Envío de emails con historias
- ✅ Webhook para notificaciones de pagos

## 📋 Requisitos

- Node.js 14+
- npm o yarn
- Cuentas en:
  - OpenAI (para ChatGPT API)
  - Hugging Face (para generación de imágenes)
  - MercadoPago (para pagos)
  - Gmail (para envío de emails)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd fabrica-heroes-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# OpenAI API
OPENAI_API_KEY=sk-your-key-here

# Hugging Face API
HUGGINGFACE_API_KEY=hf_your-key-here

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-your-token-here
MERCADOPAGO_PUBLIC_KEY=APP_USR-your-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Story Configuration
STORY_PRICE_ARS=1000
```

## 📝 Guía de Configuración de Credenciales

### 1. OpenAI API Key

1. Ir a https://platform.openai.com/account/api-keys
2. Crear una nueva API key
3. Copiar y pegar en `OPENAI_API_KEY`

**Costo estimado:** $0.01-0.05 USD por historia

### 2. Hugging Face API Key

1. Ir a https://huggingface.co/settings/tokens
2. Crear un nuevo token (read access)
3. Copiar y pegar en `HUGGINGFACE_API_KEY`

**Costo:** Gratis (con límites de uso)

### 3. MercadoPago

1. Crear cuenta en https://www.mercadopago.com.ar
2. Ir a https://www.mercadopago.com.ar/developers/panel
3. Obtener:
   - Access Token (en "Credenciales")
   - Public Key (en "Credenciales")
4. Copiar en `.env`

**Comisión:** 2.9% + $0.30 ARS por transacción

### 4. Gmail (para envío de emails)

1. Habilitar "Contraseñas de aplicación" en tu cuenta de Google:
   - Ir a https://myaccount.google.com/security
   - Habilitar "Verificación en dos pasos"
   - Generar "Contraseña de aplicación" para Gmail
2. Usar esa contraseña en `EMAIL_PASSWORD`

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints API

### Historias

#### `POST /api/story/preview`
Genera un preview corto de la historia
```json
{
  "heroName": "Sofía",
  "heroAge": 8,
  "superpower": "Telepatía",
  "villain": "La Reina de las Sombras"
}
```

#### `POST /api/story/generate`
Genera la historia completa + imagen
```json
{
  "heroName": "Sofía",
  "heroAge": 8,
  "superpower": "Telepatía",
  "villain": "La Reina de las Sombras"
}
```

#### `POST /api/story/send-pdf`
Genera PDF y envía por email
```json
{
  "email": "parent@example.com",
  "heroName": "Sofía",
  "heroAge": 8,
  "superpower": "Telepatía",
  "villain": "La Reina de las Sombras",
  "story": "La historia completa...",
  "imageBase64": "data:image/jpeg;base64,..."
}
```

### Pagos

#### `POST /api/payment/create-preference`
Crea una preferencia de pago en MercadoPago
```json
{
  "heroName": "Sofía",
  "heroAge": 8,
  "superpower": "Telepatía",
  "villain": "La Reina de las Sombras",
  "email": "parent@example.com"
}
```

#### `GET /api/payment/info/:paymentId`
Obtiene información de un pago

#### `POST /api/payment/webhook`
Recibe notificaciones de MercadoPago

### Imágenes

#### `POST /api/image/generate`
Genera una imagen del héroe
```json
{
  "heroName": "Sofía",
  "superpower": "Telepatía",
  "villain": "La Reina de las Sombras"
}
```

## 🚀 Despliegue

### Railway (Recomendado - Gratis)

1. Crear cuenta en https://railway.app
2. Conectar repositorio GitHub
3. Agregar variables de entorno
4. Deploy automático

### Render

1. Crear cuenta en https://render.com
2. Crear nuevo "Web Service"
3. Conectar repositorio
4. Configurar variables de entorno
5. Deploy

### Heroku

1. Crear cuenta en https://www.heroku.com
2. Instalar Heroku CLI
3. Ejecutar:
```bash
heroku create fabrica-heroes
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set HUGGINGFACE_API_KEY=hf_...
# ... otras variables
git push heroku main
```

## 💡 Costos Estimados (Mensual)

| Servicio | Costo |
|----------|-------|
| OpenAI API | $0.50-2 USD |
| Hugging Face | $0 (gratis) |
| MercadoPago | 2.9% + $0.30 por venta |
| Email | $0 (Gmail gratis) |
| Hosting | $0 (Railway/Render gratis) |
| **Total** | **~$1-3 USD + comisión** |

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY not found"
- Verificar que `.env` existe en la raíz del proyecto
- Verificar que `OPENAI_API_KEY` está configurada

### Error: "Email configuration error"
- Verificar que Gmail tiene habilitadas "Contraseñas de aplicación"
- Verificar que `EMAIL_USER` y `EMAIL_PASSWORD` son correctos

### Error: "MercadoPago token invalid"
- Verificar que el token es válido y no ha expirado
- Verificar que es un token de producción (no sandbox)

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

## 📄 Licencia

MIT
