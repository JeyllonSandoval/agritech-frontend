# Resumen de Buenas Prácticas en Next.js

## 1. [**Next Actions**](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
Permiten ejecutar código en el servidor sin definir APIs manualmente, usando `"use server"`. [Documentación de Next.js Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## 2. **App Router**
Nueva estructura de rutas en Next.js 13+, optimizada con **React Server Components**. Esto mejora la renderización en el servidor y la experiencia de usuario. [Documentación de App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

## 3. **Estructura basada en módulos** (Es la que mas me gustó)
Organización del código en `/modules` con la siguiente estructura:
```
📂 App/
 ├── 📄 page.tsx

📂 modules/
 ├── 📂 Common/  # Recursos compartidos entre módulos
 │    ├── 📂 Components/
 │    ├── 📂 Services/
 │    ├── 📂 Types/
 │    ├── 📂 Utils/
 │
 ├── 📂 Home/
 │    ├── 📂 Components/
 │    ├── 📂 Pages/
 │    ├── 📂 Services/  # Maneja peticiones o consultas a la BD si no hay backend externo
 │    ├── 📂 Actions/
 │    ├── 📂 Types/
 │
 ├── 📂 About/
```
Este enfoque ayuda a mantener el código limpio, modular y fácil de escalar.

## 4. [**Evitar uso de `use client`**](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
Priorizar **React Server Components** para mejorar el rendimiento y reducir el bundle. El uso de `use client` mueve el código al cliente, lo que puede aumentar el tamaño del bundle y perjudicar la carga de la página. [Server Components en Next.js](https://nextjs.org/docs/advanced-features/react-18/server-components)

## 5. [**ShadCN**](https://ui.shadcn.com/docs/components/accordion)
Base para **componentes personalizados**, no simplemente copiar, sino adaptarlos completamente a las necesidades del proyecto. Esto permite mayor flexibilidad en el diseño.

## 6. **TailwindCSS**
Framework de estilos para diseño rápido y eficiente. Tailwind permite una escritura más clara y mantenible de los estilos, sin necesidad de escribir CSS personalizado. [Documentación de TailwindCSS](https://tailwindcss.com/docs)

## 7. **i18n**
Uso de **internacionalización** cuando la aplicación lo requiere. Esto permite ofrecer soporte para múltiples idiomas y regiones. [Documentación de Next.js i18n](https://nextjs.org/docs/advanced-features/i18n-routing)

## 8. **No usar `next/image`**
En vez de usar `next/image`, es preferible crear un componente `Image` propio para tener un control total sobre la imagen (por ejemplo, en temas de optimización o personalización del comportamiento).

## 9. **Auth.js**
Para proyectos que requieran autenticación, **Auth.js** es una excelente opción, especialmente cuando se requiere integración con redes sociales famosas como Google, Facebook, etc. [Documentación de Auth.js](https://authjs.dev/)

## 10. **Metadata**
Uso del objeto **`metadata`** en `layout.tsx` para mejorar SEO, Open Graph y la configuración general de la página. [Documentación sobre Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## 11. **Zustand**
Utilizado solo en casos donde el manejo de estado no sea posible o práctico usando Server Actions. Zustand es una solución ligera y flexible para el manejo del estado. [Documentación de Zustand](https://zustand-demo.pmnd.rs/)

## 12. ORM para Bases de Datos
1. **Drizzle ORM** – Un ORM ligero y moderno para bases de datos, especialmente para trabajar con TypeScript. [Documentación de Drizzle](https://orm.drizzle.team/)
2. **Prisma** – Un ORM ampliamente utilizado que facilita la interacción con bases de datos y la migración de esquemas. [Documentación de Prisma](https://www.prisma.io/)

## 13. Bases de Datos
1. **Turso (SQLite)** – Base de datos ligera y fácil de implementar, ideal para proyectos pequeños o aplicaciones móviles. [Sitio web de Turso](https://turso.tech/)
2. **Neon (Postgres)** – Base de datos basada en PostgreSQL con enfoque en el uso en la nube. [Sitio web de Neon](https://neon.tech/)
3. **Supabase** – Plataforma de backend como servicio (BaaS), construida sobre Postgres, para crear aplicaciones de forma rápida y segura. Joan está interesado en profundizar en esta herramienta. [Documentación de Supabase](https://supabase.com/docs)

## 14. Manejo Formularios y Validaciones
1. **useForm (React Hook Form)** – Biblioteca de manejo de formularios eficiente y flexible para React. (Integrado en Shadcn) [Documentación de useForm](https://react-hook-form.com/docs/useform)
2. **Zod** – Biblioteca para validación y tipado seguro en TypeScript. Ideal para definir esquemas de validación. [Documentación de Zod](https://zod.dev/)

## 15. Iconos
1. **Lucide React** – Librería moderna de iconos para React, con diseño limpio y personalizable. (Integrado en Shadcn) [Documentación de Lucide React](https://lucide.dev/icons/)

## 16. Youtubers
1. **Faztweb** – Canal dedicado a desarrollo web, especialmente sobre tecnologías modernas como JavaScript, Node.js, y frameworks.
2. **Midudev** – Canal enfocado en desarrollo web y mejores prácticas con tecnologías como React, Next.js y JavaScript en general.