# todoist
**Easy to manage tasks and reminders**

[![Run Tests](https://github.com/santthosh/todoist/actions/workflows/test.yml/badge.svg)](https://github.com/santthosh/todoist/actions/workflows/test.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Flowbite](https://img.shields.io/badge/Flowbite-2.3-0CA4E6?style=flat&logo=flowbite)](https://flowbite.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29-C21325?style=flat&logo=jest)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

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

## Contributing

Contributions are welcome! Here's how you can contribute to this project:

### Code of Conduct

Please be respectful and inclusive when contributing to this project. Harassment or abusive behavior will not be tolerated.

### How to Contribute

1. **Fork the repository** - Create your own copy of the project to work on.
2. **Create a branch** - Make your changes in a new branch (`git checkout -b feature/amazing-feature`).
3. **Make your changes** - Implement your feature or bug fix.
4. **Run tests** - Ensure all tests pass with `npm test`.
5. **Commit your changes** - Use clear commit messages that explain what you've done.
6. **Push to your branch** - Upload your changes to your forked repository.
7. **Create a Pull Request** - Submit a PR to the main repository for review.

### Pull Request Guidelines

- Ensure your code passes all tests
- Update documentation as needed
- Include screenshots or examples if relevant
- Keep PRs focused on a single feature or fix

### Development Setup

Follow the "Getting Started" and "Local Development with Docker Compose" sections above to set up your development environment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Continuous Integration and Deployment (CI/CD)

This project uses GitHub Actions for continuous integration and deployment to Vercel. The workflow is configured to:

1. Run all tests when code is pushed to the `main` branch or when a pull request is created
2. Automatically deploy to Vercel when tests pass on the `main` branch

### CI/CD Workflow

The CI/CD pipeline consists of two main jobs:

1. **Test**: Runs all tests to ensure code quality
2. **Deploy**: Deploys the application to Vercel if all tests pass (only on the `main` branch)

### Setting Up Vercel Deployment

To set up automatic deployment to Vercel, you need to add the following secrets to your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

You can find these values in your Vercel project settings.

### Deployment Configuration

The deployment configuration is defined in the following files:

- `.github/workflows/ci-cd.yml`: The main CI/CD workflow using Vercel CLI
- `.github/workflows/vercel-deploy.yml`: An alternative workflow using the official Vercel GitHub Action
- `vercel.json`: Configuration for Vercel deployment

You can choose which workflow to use based on your preferences. The `ci-cd.yml` workflow provides more control over the deployment process, while the `vercel-deploy.yml` workflow is simpler and uses the official Vercel GitHub Action.