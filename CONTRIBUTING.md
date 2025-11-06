# Contributing to IslamicApp

First off, thank you for considering contributing to IslamicApp! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- **Be respectful** and inclusive in your language and actions
- **Be collaborative** and help others learn
- **Be patient** with newcomers and beginners
- **Focus on what is best** for the community
- **Use welcoming** and inclusive language

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
```markdown
**Bug Description**
A clear and concise description of what the bug is.

**Reproduction Steps**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6, Desktop]

**Additional Context**
Add any other context about the problem here.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

**Feature Request Template:**
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### 👨‍💻 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install` or `pnpm install`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** following our coding standards
5. **Add tests** for your changes (if applicable)
6. **Run the test suite**: `npm test`
7. **Run linting**: `npm run lint`
8. **Build the project**: `npm run build`
9. **Commit your changes**: `git commit -m 'Add amazing feature'`
10. **Push to your fork**: `git push origin feature/amazing-feature`
11. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/islamic-app.git
   cd islamic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser** to `http://localhost:5173`

## Coding Standards

### TypeScript & JavaScript

- **Use TypeScript** for all new code
- **Enable strict mode** in TypeScript configuration
- **Use meaningful variable names**
- **Add JSDoc comments** for functions and complex logic
- **Avoid `any` types** - be specific about types
- **Use async/await** over promises when possible

### React Components

- **Use functional components** with hooks
- **Follow React best practices** from official docs
- **Use TypeScript interfaces** for props
- **Keep components small** and focused
- **Use proper error boundaries**
- **Implement proper loading states**

### Styling

- **Use Tailwind CSS** for styling
- **Follow mobile-first approach**
- **Ensure RTL support** for Arabic
- **Use design system tokens** when available
- **Test in both light and dark themes**

### File Organization

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── lib/             # Utility libraries
├── services/        # API services
├── types/           # TypeScript type definitions
└── styles/          # CSS styles
```

## Testing

### Writing Tests

- **Write tests** for new features and bug fixes
- **Use meaningful test descriptions**
- **Test both positive and negative cases**
- **Mock external APIs** in tests
- **Use data-testid attributes** for element selection

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Integration

### External APIs

When integrating with external APIs:

1. **Document the API** in the services folder
2. **Handle errors gracefully**
3. **Use proper TypeScript types** for API responses
4. **Implement caching** where appropriate
5. **Follow rate limiting** guidelines

### Supabase Integration

For Supabase operations:

1. **Use Row Level Security** (RLS) policies
2. **Implement proper error handling**
3. **Use TypeScript types** generated from Supabase
4. **Follow Supabase best practices**

## Internationalization

### Adding New Languages

1. **Add locale files** in `src/i18n/locales/`
2. **Update language selector** component
3. **Test RTL layout** if adding Arabic
4. **Update documentation** with new language support

### Translation Guidelines

- **Use formal language** for religious content
- **Ensure cultural sensitivity**
- **Test with native speakers** when possible
- **Follow Islamic terminology standards**

## Accessibility

### Standards to Follow

- **WCAG 2.1 AA compliance**
- **Semantic HTML** elements
- **Proper heading hierarchy**
- **Alt text** for images
- **Keyboard navigation** support
- **Screen reader compatibility**

### Testing Accessibility

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react

# Run accessibility audit
npm run audit:a11y
```

## Performance

### Guidelines

- **Optimize images** (WebP format when possible)
- **Implement code splitting** for large components
- **Use React.memo** for expensive components
- **Optimize bundle size** - aim for < 500KB gzipped
- **Implement proper caching** strategies

### Monitoring

- **Use React DevTools** Profiler
- **Monitor Core Web Vitals**
- **Test on various devices** and connections

## Security

### Best Practices

- **Never commit secrets** to the repository
- **Use environment variables** for sensitive data
- **Validate all user inputs**
- **Follow OWASP guidelines**
- **Keep dependencies updated**

## Documentation

### Code Documentation

- **Add JSDoc comments** to functions
- **Document complex algorithms**
- **Explain business logic** decisions
- **Provide usage examples** for utility functions

### API Documentation

- **Document all API endpoints**
- **Include request/response examples**
- **Document error codes** and messages
- **Provide testing examples**

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update CHANGELOG.md
- [ ] Update version in package.json
- [ ] Run full test suite
- [ ] Test on multiple browsers
- [ ] Update documentation
- [ ] Create release PR
- [ ] Merge and tag release

## Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bugs and feature requests
- **Email**: support@example.com for private matters

## Recognition

Contributors who make significant contributions will be:

- **Added to CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Granted maintainer access** for consistent contributors

## Questions?

Don't hesitate to ask questions! We're here to help:

1. **Check existing documentation**
2. **Search existing issues**
3. **Create a new issue** with the "question" label
4. **Join our discussions**

Thank you for contributing to IslamicApp! 🕌

---

**Remember**: Every contribution, no matter how small, makes a difference. Thank you for being part of our community!