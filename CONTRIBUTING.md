# Contributing to CryptoMarketer AI

Thank you for your interest in contributing to the CryptoMarketer AI project! This document provides guidelines and instructions for contributing to make the process smooth and effective for everyone involved.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Commit Message Guidelines](#commit-message-guidelines)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

- Be respectful and inclusive
- Be patient and welcoming
- Be thoughtful
- Be collaborative
- When disagreeing, try to understand why

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/purplebitcoin.git
   cd purplebitcoin
   ```
3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/alphakong100x/purplebitcoin.git
   ```
4. **Install dependencies**:
   ```bash
   # If using npm
   npm install
   
   # If using pnpm (recommended)
   pnpm install
   ```

## How to Contribute

There are many ways to contribute to the project:

1. **Report bugs**: If you find a bug, please create an issue using our bug report template.
2. **Suggest enhancements**: Have ideas for new features? Submit an enhancement proposal using our feature request template.
3. **Improve documentation**: Help us improve our documentation by fixing typos, adding examples, or clarifying instructions.
4. **Submit code changes**: Fix bugs or add features by submitting pull requests.
5. **Review pull requests**: Help review open pull requests by testing and providing feedback.

## Development Workflow

1. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use prefixes like:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation changes
   - `refactor/` for code refactoring
   - `test/` for adding or updating tests

2. **Make your changes** and commit them with clear, descriptive messages

3. **Keep your branch updated** with the main repository:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Create a pull request** from your branch to the main repository's `main` branch
2. **Fill out the pull request template** completely
3. **Reference any related issues** in your PR description
4. **Wait for review** - maintainers will review your PR and may request changes
5. **Address review comments** and update your PR if needed
6. **Once approved**, a maintainer will merge your PR

## Coding Standards

We follow these coding standards to maintain consistency:

### HTML
- Use semantic HTML elements
- Ensure accessibility with proper ARIA attributes
- Use lowercase for HTML element names, attributes, and values

### CSS
- Follow BEM (Block Element Modifier) naming convention
- Use CSS variables for colors and repeated values
- Maintain responsive design principles

### JavaScript
- Follow ESLint configuration
- Use JSDoc comments for functions and classes
- Write modular, reusable code
- Prefer ES6+ features (arrow functions, destructuring, etc.)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(payment): add Purple Bitcoin payment integration

Implement wallet connection and transaction verification for PBTC payments.

Closes #123
```

## Testing

Before submitting a pull request, please:

1. **Run existing tests** to ensure you haven't broken anything:
   ```bash
   npm test
   ```

2. **Add tests for new features** or bug fixes when applicable

3. **Ensure your code passes linting**:
   ```bash
   npm run lint
   ```

## Documentation

Good documentation is crucial for our project:

1. **Update the README.md** if your changes affect how users interact with the project
2. **Add JSDoc comments** to all functions, classes, and methods
3. **Include code examples** when appropriate
4. **Update any affected documentation files**

## Community

- **Join our Discord server** to connect with other contributors
- **Subscribe to our newsletter** for project updates
- **Follow us on Twitter** [@PurpleBitcoin](https://twitter.com/PurpleBitcoin)

## Purple Bitcoin Specific Guidelines

As this project is powered by Purple Bitcoin (PBTC), please ensure:

1. **Maintain branding consistency** with Purple Bitcoin guidelines
2. **Preserve PBTC integration** in any payment-related changes
3. **Follow the color scheme** defined in the README.md
4. **Keep the gorilla mascot** as a key visual element

---

Thank you for contributing to CryptoMarketer AI! Your efforts help make this project better for everyone.
