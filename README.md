This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Todo Application Features

This application is a full-featured TODO application that allows you to:

- Create multiple todo lists to organize your tasks
- Add todo items to your lists
- Mark todo items as complete
- Set due dates for your tasks
- Schedule reminders for important tasks
- Archive todo lists you no longer need
- Delete todo lists and items

The application uses PostgreSQL for data storage and Redis for caching reminders.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development with Docker Compose

This project uses PostgreSQL and Redis for data storage. To simplify local development, a Docker Compose configuration is provided.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Starting the Database Services

1. Start PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

2. The services will be available at:
   - PostgreSQL: `localhost:5432` (User: todoist, Password: randompassword, Database: mydb)
   - Redis: `localhost:6379`

3. Update your `.env` file to connect to these services:

```
DATABASE_URL="postgresql://todoist:randompassword@localhost:5432/mydb?schema=public"
REDIS_URL="redis://localhost:6379"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

### Stopping the Services

To stop the containers:

```bash
docker-compose down
```

To stop and remove all data volumes:

```bash
docker-compose down -v
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.