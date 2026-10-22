# ColoniaAdmin - Sistema de Gestión Financiera y Operativa para Colonia de Verano

Aplicación web integral para la administración, tesorería, cobranzas, personal y control de gastos de colonias de verano y clubes recreativos.

## Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend / ORM**: Server Actions + Prisma ORM (SQLite / PostgreSQL)
- **Autenticación**: NextAuth.js con credenciales seguras, bcrypt y protección de middleware

## Características Principales
1. **Dashboard Financiero**: KPIs de Ingresos, Gastos, Sueldos, Balance Neto y Tasa de Cobranza. Gráfico de flujo comparativo y alertas de deudas.
2. **Alumnos y Cobranzas**: Listado interactivo con búsqueda y filtro de plan. Cálculo automático del saldo restante al cobrar. Exportación a CSV.
3. **Personal y Nómina**: Control de profesores, guardavidas y coordinadores, con liquidación de haberes mensual.
4. **Gastos Operativos**: Formulario ágil con categorización (predio, merienda, seguros) y cálculo dinámico de sumas en pantalla.

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Inicializar la base de datos (SQLite)
npx prisma db push

# 3. Cargar datos de prueba (Seed)
npm run prisma:seed

# 4. Iniciar en modo desarrollo
npm run dev
```

## Credenciales Iniciales
- **Email**: `admin@colonia.com`
- **Contraseña**: `admin123`
