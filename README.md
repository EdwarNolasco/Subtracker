# SubTracker 💰

**SubTracker** es una aplicación de gestión de finanzas personales diseñada para rastrear gastos recurrentes (suscripciones). El objetivo principal es visualizar cuánto dinero se gasta mensualmente en servicios como streaming, gimnasio o software.

## 🚀 Tecnologías

### Frontend
- **Framework:** Vue.js 3
- **Paradigma:** Composition API (`<script setup>`)
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Base de Datos:** SQLite (better-sqlite3)

## 📋 Características

### Gestión de Suscripciones (CRUD)
- ✅ **Listar:** Mostrar todas las suscripciones activas en tarjetas visuales
- ✅ **Crear:** Formulario para agregar una nueva suscripción
- ✅ **Editar:** Posibilidad de modificar el precio, nombre o la fecha de pago
- ✅ **Eliminar:** Botón para remover una suscripción de la lista

### Lógica de Negocio
- ✅ **Cálculo de Totales:** Muestra el **Gasto Total Mensual Estimado** y **Gasto Anual Estimado**
- ✅ **Normalización de Frecuencia:**
    - Si una suscripción es *Mensual*, se suma el precio tal cual
    - Si una suscripción es *Anual*, el sistema divide el costo entre 12 para sumarlo al promedio mensual
- ✅ **Conversión de Moneda:**
    - El sistema permite entradas en **USD** y **HNL**
    - Para el cálculo del total, todo se convierte a HNL usando una tasa fija de 26

## 📁 Estructura del Proyecto

```
Subtracker/
├── frontend/                    # Aplicación Vue.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── SubscriptionCard.vue    # Tarjeta de presentación
│   │   │   ├── SubscriptionForm.vue    # Formulario Crear/Editar
│   │   │   └── SubscriptionList.vue    # Contenedor principal
│   │   ├── composables/
│   │   │   └── useSubscriptions.ts     # Lógica de estado y cálculos
│   │   ├── types/
│   │   │   └── Subscription.ts         # Interfaces y Tipos
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                     # API REST con Express
    ├── server.js                # Servidor y rutas API
    ├── package.json
    └── subscriptions.db         # Base de datos SQLite (se crea automáticamente)
```

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Backend

1. Navega a la carpeta del backend:
```bash
cd backend
```

2. Instala las dependencias (ya instaladas):
```bash
npm install
```

3. Inicia el servidor:
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Frontend

1. Navega a la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias (ya instaladas):
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔌 API Endpoints

### GET `/api/subscriptions`
Obtiene todas las suscripciones

### GET `/api/subscriptions/:id`
Obtiene una suscripción específica por ID

### POST `/api/subscriptions`
Crea una nueva suscripción

**Body:**
```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "Mensual",
  "paymentDate": 15
}
```

### PUT `/api/subscriptions/:id`
Actualiza una suscripción existente

**Body (todos los campos son opcionales):**
```json
{
  "name": "Netflix Premium",
  "price": 19.99,
  "currency": "USD",
  "frequency": "Mensual",
  "paymentDate": 20
}
```

### DELETE `/api/subscriptions/:id`
Elimina una suscripción

## 💡 Uso

1. **Agregar una suscripción:** Haz clic en el botón "+ Nueva Suscripción"
2. **Editar:** Haz clic en el ícono de lápiz en cualquier tarjeta
3. **Eliminar:** Haz clic en el ícono de basura en cualquier tarjeta
4. **Visualizar totales:** Los totales mensuales y anuales se calculan automáticamente en el encabezado

## 🎨 Características de Diseño

- **Diseño Responsivo:** Funciona en dispositivos móviles, tablets y desktop
- **Animaciones Suaves:** Transiciones y efectos hover para mejor UX
- **Modal Animado:** Formulario con animaciones de entrada/salida
- **Gradientes Modernos:** Diseño visual atractivo con Tailwind CSS
- **Iconos SVG:** Iconos integrados sin dependencias externas

## 📝 Notas Técnicas

- La tasa de conversión USD a HNL está fija en 26 (configurable en `useSubscriptions.ts`)
- La base de datos SQLite se crea automáticamente al iniciar el servidor
- Los IDs se generan usando UUID v4
- Las fechas se almacenan en formato ISO 8601

## 🚧 Mejoras Futuras

- [ ] Autenticación de usuarios
- [ ] Múltiples perfiles
- [ ] Notificaciones de próximos pagos
- [ ] Gráficos y estadísticas avanzadas
- [ ] Exportar datos a CSV/PDF
- [ ] Tasa de conversión dinámica desde una API
- [ ] Categorías de suscripciones
- [ ] Historial de pagos

## 📄 Licencia

ISC

---

Desarrollado con ❤️ usando Vue.js y Express
