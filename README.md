# 📝 Tasks Project

A project to manage your tasks. You can perform basic actions like creating, modifying, deleting and toggle completing tasks.

## 🗃️ Backend

- created in **NestJS**
- using **JWT** authentication
- using **RBAC** (ADMIN - can perform all actions no matter who is the owner of the task, USER - can only perform actions on owned tasks, cannot delete task)
- using **TypeORM**
- using **PostgreSQL** as a database

### ⌨️ Commands

To start the database:

```bash
docker compose --env-file <env-file-name> up
```

To start the development server:

```bash
npm run start:dev
```

To generate migrations in development:

```bash
npm run migration:generate:dev --name=<migration-name>
```

To run migrations in development:

```bash
npm run migration:run:dev
```

To revert recent migration in development:

```bash
npm run migration:revert:dev
```

To seed the database with data:

```bash
npm run seed:dev
```

## 🎨 Frontend

- created in **ReactJS** with **Typescript**
- using **ShadCN** with **TailwindCSS** for styling and components
- using **axios** with **@tanstack/react-query** for creating HTTP requests
- using **zustand** for state management
- using **react-hook-form** with **zod** for handling and validating forms
- using **date-fns** for actions with dates

### ⌨️ Commands

To start the development server:

```bash
npm run dev
```
