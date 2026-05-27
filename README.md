# NemoGym

NemoGym es una plataforma orientada a la gestión integral de gimnasios, desarrollada con arquitectura Full Stack utilizando Java + Spring Boot en el backend y React + Vite en el frontend.

La aplicación permite a los usuarios adquirir membresías, acceder a rutinas de entrenamiento, visualizar clases y gestionar suscripciones. Además, cuenta con funcionalidades administrativas para el manejo de usuarios, roles, avisos, reportes y transacciones.

---

# 🚀 Tecnologías utilizadas

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA / Hibernate
* Maven

## Frontend

* React
* Vite
* React Router

## Base de datos e infraestructura

* MySQL
* Docker
* Docker Compose

## Integraciones

* Mercado Pago
* Gemini AI

---

# 📂 Estructura del proyecto

```bash
NemoGym/
│
├── backend/     # API REST desarrollada con Spring Boot
│
├── frontend/    # Aplicación frontend desarrollada con React + Vite
│
└── docker/      # Configuración Docker y docker-compose
```

---

# ⚙️ Funcionalidades principales

* Sistema de membresías Basic y Full.
* Rutinas generales y personalizadas.
* Seguimiento mediante coach.
* Gestión de clases y avisos.
* Autenticación y autorización con JWT.
* Integración con Mercado Pago.
* Reportes administrativos de ingresos y transacciones.
* Historial de compras por usuario.
* Diseño responsive adaptable a dispositivos móviles y desktop.

---

# 🔐 Seguridad

* Autenticación basada en JWT.
* Protección de endpoints mediante Spring Security.
* Separación de responsabilidades utilizando Controllers, Services, Repositories y DTOs.

---

# 🐳 Ejecución con Docker

```bash
docker-compose up --build
```

---
# 🚀 Ejecución del proyecto

## Frontend (React + Vite)

Ingresar a la carpeta frontend:

```bash id="eqxkq8"
cd frontend
```

Instalar dependencias:

```bash id="pw6fxn"
npm install
```

Ejecutar el entorno de desarrollo:

```bash id="9l1v92"
npm run dev
```

---

## Backend (Spring Boot)

Ingresar a la carpeta backend:

```bash id="j7q1rn"
cd backend
```

Ejecutar la aplicación:

```bash id="xhqu7n"
.\mvnw spring-boot:run
```

---

# 🐳 Docker

Para levantar los servicios mediante Docker Compose:

```bash id="t76j4x"
docker-compose up --build
```

---

# 💳 Pruebas con Mercado Pago

Para realizar pruebas locales de Webhooks de Mercado Pago se recomienda utilizar Ngrok para exponer el backend públicamente.

Ejemplo:

ngrok http 8080


Luego utilizar la URL generada por Ngrok como endpoint de Webhooks dentro de la configuración de Mercado Pago.

