This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Todoist Features

This application is a full-featured task management application that allows you to:

- Create multiple task lists to organize your activities
- Add items to your lists
- Mark items as complete
- Set due dates for your tasks
- Schedule reminders for important tasks
- Archive lists you no longer need
- Delete lists and items

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
   - PostgreSQL: `localhost:5432` (User: todoist, Password: aIU0Ys5hrBPho647FLBpzl+Q37IM5mQhTgUhTqt25mE=, Database: todoist)
   - Redis: `localhost:6379`

3. Update your `.env` file to connect to these services:

```
DATABASE_URL="postgresql://todoist:aIU0Ys5hrBPho647FLBpzl+Q37IM5mQhTgUhTqt25mE=@localhost:5432/todoist?schema=public"
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

## Testing

This project includes comprehensive unit tests for components and API routes. The tests are written using Jest and React Testing Library.

### Running Tests

To run the tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

### Test Structure

- `src/__tests__/components/` - Tests for React components
- `src/__tests__/api/` - Tests for API routes
- `src/__tests__/utils/` - Tests for utility functions

### Continuous Integration

This project uses GitHub Actions for continuous integration. Tests are automatically run when:

- Code is pushed to the `main` branch
- A pull request is created targeting the `main` branch

The workflow sets up a test environment with Node.js, PostgreSQL, and Redis to ensure all tests pass in an environment similar to production.

To see the status of the latest test runs, check the "Actions" tab in the GitHub repository.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.