# Contributing to EuroAsianNGroup ERP

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/jayandra06/euroasianngroupERP.git
   cd euroasianngroupERP
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**
   ```bash
   npm run install:all
   ```

4. **Make Changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Add tests if applicable

5. **Test Your Changes**
   ```bash
   npm run lint
   npm run test
   ```

6. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Provide a clear description
   - Link related issues
   - Wait for review

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/tooling changes

Examples:
```
feat(auth): add JWT refresh token support
fix(user): resolve email validation issue
docs(readme): update installation instructions
```

## Project Structure

- `backend/` - Node.js Express API
- `frontend/` - React portals
- `packages/shared-components/` - Shared UI library
- `docker/` - Docker configurations

## Testing

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Ensure all tests pass before submitting PR

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Add tests for new features
- Ensure CI/CD passes
- Get at least one approval before merging

## Questions?

Open an issue or contact the development team.

Thank you for contributing! 🎉

