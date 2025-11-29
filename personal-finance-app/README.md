# Personal Finance App

## Descripción
Esta aplicación de gestión de finanzas personales permite a los usuarios gestionar sus suscripciones y calcular sus gastos mensuales de manera eficiente. La aplicación está construida con Vue.js, TypeScript y Vite, proporcionando una experiencia de usuario rápida y moderna.

## Características
- **Gestión de Suscripciones**: Agrega, edita y elimina suscripciones fácilmente.
- **Cálculo de Gastos Mensuales**: Visualiza un desglose de los gastos mensuales y realiza un seguimiento de tus finanzas.
- **Interfaz Intuitiva**: Navegación sencilla y componentes reutilizables para una mejor experiencia de usuario.

## Estructura del Proyecto
```
personal-finance-app
├── src
│   ├── main.ts
│   ├── App.vue
│   ├── assets
│   ├── components
│   │   ├── common
│   │   │   ├── Header.vue
│   │   │   └── Modal.vue
│   │   └── subscriptions
│   │       ├── SubscriptionCard.vue
│   │       └── SubscriptionForm.vue
│   ├── views
│   │   ├── Dashboard.vue
│   │   ├── Subscriptions.vue
│   │   ├── Expenses.vue
│   │   └── Settings.vue
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   ├── index.ts
│   │   └── subscriptions.ts
│   ├── composables
│   │   └── useSubscriptions.ts
│   ├── services
│   │   ├── api.ts
│   │   └── billing.ts
│   ├── utils
│   │   └── calculations.ts
│   └── types
│       └── index.ts
├── public
├── tests
│   └── unit
│       └── example.spec.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

## Instalación
1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd personal-finance-app
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso
Para iniciar la aplicación en modo de desarrollo, ejecuta:
```
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.