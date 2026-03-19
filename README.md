# 🌿 Sistema de Seguimiento de Hábitos Saludables

> Proyecto full-stack — Programación Web 2026A

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 📖 Descripción del Proyecto

El **Sistema de Seguimiento de Hábitos Saludables** es una aplicación web full-stack desarrollada para un centro de bienestar. Permite a los clientes registrar y hacer seguimiento de sus hábitos diarios —hidratación, ejercicio, alimentación, sueño y meditación— y a los profesionales del centro monitorear el avance de sus pacientes.

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Proyecto de Aula — Nivel Básico |
| **Entidades** | 6 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 10 HUs organizadas en 5 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |
| **Casos de Uso** | 10 CUs (registro, hábitos, metas, seguimiento, reportes) |

### Funcionalidades Principales

- ✅ Registro e inicio de sesión de usuarios con autenticación JWT
- ✅ CRUD de Categorías de Hábitos (hidratación, ejercicio, alimentación, sueño, meditación)
- ✅ CRUD de Hábitos personalizados por usuario
- ✅ Definición de Metas personales por hábito (ej: beber 8 vasos al día)
- ✅ Registro diario de cumplimiento con valor y observaciones
- ✅ Cálculo automático de Racha (días consecutivos cumpliendo un hábito)
- ✅ Resumen semanal de cumplimiento por hábito
- ✅ Historial mensual de cumplimiento agrupado por mes
- ✅ Reporte de progreso por rango de fechas (vista de profesional)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional |
| **ORM** | Prisma | Modelado de datos, migraciones y queries |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Autenticación** | JWT + bcrypt | Seguridad y manejo de sesiones |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente HTTP → Controller (valida DTO + ruta) → Service (lógica de negocio) → Repository (acceso a datos) → Prisma / PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── filters/            # Filtros de excepción globales
│   │   │   ├── interceptors/       # Interceptores de respuesta
│   │   │   ├── pipes/              # Pipes de validación
│   │   │   └── guards/             # Guards de autenticación JWT
│   │   ├── auth/                   # Módulo de autenticación
│   │   │   ├── strategies/         # JWT Strategy (Passport)
│   │   │   └── guards/             # AuthGuard
│   │   ├── prisma/                 # Módulo Prisma (acceso a BD)
│   │   └── modules/                # Módulos de dominio
│   │       └── [entidad]/
│   │           ├── controller/     # Solo manejo HTTP
│   │           ├── service/        # Lógica de negocio
│   │           ├── repository/     # Acceso a datos (Prisma)
│   │           ├── dto/            # Validación de entrada
│   │           └── entities/       # Representación del dominio
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                    # App Router (páginas)
│   │   ├── components/             # Componentes reutilizables
│   │   ├── services/               # Capa de acceso a la API
│   │   ├── interfaces/             # Tipos e interfaces TypeScript
│   │   └── lib/                    # Utilidades y helpers
│   └── package.json
│
└── README.md
```

---

## 📊 Modelo de Datos

### Diagrama de Relaciones

```
Usuario           1 ──── N  Habito
Usuario           1 ──── N  RegistroDiario
CategoriaHabito   1 ──── N  Habito
Habito            1 ──── N  Meta
Habito            1 ──── N  RegistroDiario
Habito            1 ──── 1  Racha
```

### Entidades

| Entidad | Campos Principales |
|---|---|
| **Usuario** | id, nombres, apellidos, correo (unique), contraseña, edad, peso, estatura |
| **CategoriaHabito** | id, nombre (unique), descripcion |
| **Habito** | id, nombre, descripcion, categoriaHabitoId, usuarioId |
| **Meta** | id, habitoId, descripcion, valorMeta, activa |
| **RegistroDiario** | id, habitoId, usuarioId, fecha, valorRegistrado, observaciones (unique: habitoId + fecha) |
| **Racha** | id, habitoId (unique), rachaActual, rachaMaxima, ultimaFecha |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend Base + Autenticación + Hábitos

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** Infraestructura Docker + Prisma, módulos CRUD de Usuario (con JWT), CategoriaHabito, Habito y Meta. Common Module. Frontend con vistas base.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 1](#sprint-1--infraestructura-usuarios-y-categorías) | Mar 16 → Mar 29 | HU-01, HU-02, HU-03 | Docker, Prisma, Usuario, Auth JWT, CategoriaHabito |
| [Sprint 2](#sprint-2--hábitos-metas-y-common-module) | Mar 30 → Abr 10 | HU-04, HU-05, HU-06 | Habito, Meta, Common Module |
| [Sprint 3](#sprint-3--registro-diario-y-frontend-base) | Abr 13 → Abr 17 | HU-07 | RegistroDiario, resumen semanal, frontend base |

### Release 2 — Tercer Corte: Racha, Estadísticas e Integración Completa

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Módulo de Racha, integración completa frontend ↔ backend, historial mensual, reporte de progreso. Despliegue funcional con Docker.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 4](#sprint-4--frontend-avanzado-e-integración) | Abr 20 → May 8 | HU-08, HU-09 | Racha, dashboard, navegación, layout |
| [Sprint 5](#sprint-5--historial-reporte-y-cierre) | May 11 → May 22 | HU-10 | Historial mensual, reporte por fechas, E2E, Docker final |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura, Usuarios y Categorías

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José)

| # | Historia de Usuario | Labels |
|---|---|---|
| HU-01 | Gestión de Usuarios | `user-story` `backend` `frontend` |
| HU-02 | Autenticación de Usuarios (JWT) | `user-story` `backend` `frontend` `auth` |
| HU-03 | Gestión de Categorías de Hábitos | `user-story` `backend` `frontend` |

**Entregables:**
- Docker Compose con PostgreSQL, NestJS y Next.js
- Prisma schema con entidades Usuario y CategoriaHabito
- Migraciones ejecutadas
- Endpoints de Auth: `POST /auth/register`, `POST /auth/login`
- CRUD completo de Usuario y CategoriaHabito
- Páginas: `/auth/register`, `/auth/login`, `/usuarios`, `/categorias`

---

### Sprint 2 — Hábitos, Metas y Common Module

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2 (Jueves Santo), Abr 3 (Viernes Santo)

| # | Historia de Usuario | Labels |
|---|---|---|
| HU-04 | Gestión de Hábitos | `user-story` `backend` `frontend` |
| HU-05 | Gestión de Metas Personales | `user-story` `backend` `frontend` |
| HU-06 | Common Module: Filtros, Interceptores y Pipes | `user-story` `backend` `cross-cutting` |

**Entregables:**
- CRUD de Habito con relación a CategoriaHabito y Usuario
- CRUD de Meta con validación de unicidad activa por hábito
- `common/filters/http-exception.filter.ts`
- `common/interceptors/response.interceptor.ts`
- `common/pipes/validation.pipe.ts` registrado globalmente en `main.ts`
- Páginas: `/habitos`, `/habitos/new`, `/habitos/[id]`, `/metas`

---

### Sprint 3 — Registro Diario y Frontend Base

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: Abr 17

| # | Historia de Usuario | Labels |
|---|---|---|
| HU-07 | Registro Diario de Cumplimiento | `user-story` `backend` `frontend` |

**Entregables:**
- CRUD de RegistroDiario con unicidad (habitoId + fecha)
- Comparación automática valor registrado vs. meta
- Endpoint `GET /resumen/semanal` con filtro por fecha
- Páginas: `/registro/new`, listado de registros con indicador de cumplimiento

---

### Sprint 4 — Frontend Avanzado e Integración

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo)

| # | Historia de Usuario | Labels |
|---|---|---|
| HU-08 | Visualización de Racha Actual | `user-story` `backend` `frontend` |
| HU-09 | Frontend: Dashboard, Navegación y Layout General | `user-story` `frontend` |

**Entregables:**
- Entidad Racha en Prisma schema con lógica de actualización en RegistroDiarioService
- Endpoint `GET /habitos/:id/racha`
- Dashboard personal con tarjetas de hábito, % de cumplimiento y racha actual
- Layout con Sidebar/Navbar y rutas activas
- Página `/registro/new` con selects dinámicos
- Diseño responsivo con Tailwind CSS

---

### Sprint 5 — Historial, Reporte y Cierre

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Día de la Ascensión) · 📝 Cierre Tercer Corte: May 22

| # | Historia de Usuario | Labels |
|---|---|---|
| HU-10 | Historial Mensual y Reporte de Progreso | `user-story` `backend` `frontend` `reporte` |

**Entregables:**
- Endpoint `GET /historial/mensual` agrupado por mes
- Endpoint `GET /reportes/progreso` con filtro por usuarioId, fechaInicio y fechaFin
- Página `/historial` con tabla agrupada por mes
- Página `/reportes/progreso` con filtros y tabla de resultados
- Pruebas de integración E2E con Jest + Supertest
- Docker Compose validación final en entorno limpio

---

## 📅 Cronograma

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026                │
│                    Backend Base + Autenticación + Hábitos                    │
├─────────────────────┬─────────────────────┬──────────────────────────────────┤
│  Sprint 1           │    Sprint 2         │         Sprint 3                 │
│  Mar 16 → Mar 29    │  Mar 30 → Abr 10    │      Abr 13 → Abr 17            │
│                     │                     │                                  │
│ • Docker + Prisma   │ • Habito            │ • RegistroDiario                 │
│ • Usuario + JWT     │ • Meta              │ • Resumen semanal                │
│ • CategoriaHabito   │ • Common Module     │ • Frontend: listados y forms     │
│                     │ • Filters/Pipes     │                                  │
│ 🚫 Mar 23          │ 🚫 Abr 2-3         │                                  │
│   (San José)        │   (Semana Santa)    │                                  │
├─────────────────────┴─────────────────────┴──────────────────────────────────┤
│              TERCER CORTE (Release 2) — Cierre: 22 May 2026                 │
│                      Racha, Estadísticas e Integración                       │
├────────────────────────────────────┬─────────────────────────────────────────┤
│        Sprint 4                    │          Sprint 5                       │
│        Abr 20 → May 8             │          May 11 → May 22                │
│                                    │                                         │
│ • Módulo Racha                     │ • Historial mensual                     │
│ • Dashboard personal               │ • Reporte por rango de fechas           │
│ • Navegación y layout              │ • Pruebas E2E                           │
│ • Selects dinámicos                │ • Docker compose validación final        │
│                                    │                                         │
│ 🚫 May 1                          │ 🚫 May 18                              │
│   (Día del Trabajo)               │   (Día de la Ascensión)                │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha | Festivo | Sprint Afectado |
|---|---|---|
| Lunes 23 de Marzo | Día de San José | Sprint 1 |
| Jueves 2 de Abril | Jueves Santo | Sprint 2 |
| Viernes 3 de Abril | Viernes Santo | Sprint 2 |
| Viernes 1 de Mayo | Día del Trabajo | Sprint 4 |
| Lunes 18 de Mayo | Día de la Ascensión | Sprint 5 |

---

## ✅ Definition of Done (DoD)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend
- [ ] Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository
- [ ] DTOs con validaciones usando `class-validator` y `class-transformer`
- [ ] Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- [ ] Respuestas con formato uniforme (interceptor aplicado)
- [ ] Endpoint probado manualmente con Postman/Thunder Client

### Frontend
- [ ] Página(s) implementada(s) con componentes reutilizables
- [ ] Consumo del API a través de la capa de `services/`
- [ ] Manejo de estados: carga (loading), éxito y error
- [ ] Formularios con validación del lado del cliente
- [ ] Diseño responsivo y navegable

### Infraestructura y Código
- [ ] Código versionado en GitHub con commits descriptivos
- [ ] El servicio funciona correctamente con `docker compose up`
- [ ] No hay errores de consola ni advertencias críticas
- [ ] Las migraciones de Prisma están aplicadas y el esquema es consistente

---

## 📊 Tablero Kanban

El seguimiento del proyecto se realiza mediante un tablero Kanban en GitHub Projects.

El tablero incluye:
- **Columnas:** Todo → In Progress → Done
- **Campos personalizados:** Sprint, Release, Prioridad
- **Vistas:** Board (Kanban), Table, Roadmap

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/habitos-saludables.git
cd habitos-saludables
```

### Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

```env
# .env.example
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=habitos_saludables_db
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### Levantar los servicios

```bash
# Levantar todos los servicios con Docker Compose
docker compose up

# O en modo detached (segundo plano)
docker compose up -d
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **Backend (NestJS API)** | [http://localhost:3001](http://localhost:3001) |
| **PostgreSQL** | `localhost:5432` |

### Ejecutar migraciones de Prisma

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npx prisma migrate dev

# Generar el cliente Prisma
npx prisma generate
```

### Endpoints principales de la API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de nuevo usuario |
| `POST` | `/auth/login` | Inicio de sesión (retorna JWT) |
| `GET` | `/usuarios` | Listar usuarios |
| `GET/POST` | `/categorias` | Listar / Crear categorías |
| `GET/POST` | `/habitos` | Listar / Crear hábitos |
| `GET/POST` | `/metas` | Listar / Crear metas |
| `GET/POST` | `/registro` | Listar / Crear registros diarios |
| `GET` | `/resumen/semanal` | Resumen semanal de cumplimiento |
| `GET` | `/habitos/:id/racha` | Racha actual y máxima de un hábito |
| `GET` | `/historial/mensual` | Historial mensual agrupado por mes |
| `GET` | `/reportes/progreso` | Reporte por rango de fechas |

---

<p align="center">
  <strong>Programación Web — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Juan José Horta Vanegas &nbsp;·&nbsp; Javier Esteban Ortiz López</em>
</p>
