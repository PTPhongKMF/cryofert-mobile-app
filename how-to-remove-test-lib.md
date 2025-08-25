# Testing Libraries and Files to Remove

## 📁 Directories to Delete
- `cypress/` - Complete Cypress E2E testing directory containing:
  - `cypress/e2e/test.cy.ts` - Sample E2E test
  - `cypress/fixtures/example.json` - Test fixtures
  - `cypress/support/commands.ts` - Custom Cypress commands
  - `cypress/support/e2e.ts` - Cypress support file

## 📄 Files to Delete
- `cypress.config.ts` - Cypress configuration file
- `src/setupTests.ts` - Vitest/Jest setup file
- `src/App.test.tsx` - Sample unit test file

## 📦 Dependencies to Remove from package.json

### devDependencies to remove:
- `@testing-library/dom` - DOM testing utilities
- `@testing-library/jest-dom` - Jest DOM matchers
- `@testing-library/react` - React testing utilities  
- `@testing-library/user-event` - User interaction simulation
- `cypress` - E2E testing framework
- `jsdom` - DOM simulation for Node.js
- `vitest` - Unit testing framework

### Scripts to remove from package.json:
- `"test.e2e": "cypress run"` - Cypress E2E test script
- `"test.unit": "vitest"` - Vitest unit test script

## ⚙️ Configuration Changes

### vite.config.ts modifications:
Remove the test configuration block:
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
}
```

Remove the vitest reference comment:
```typescript
/// <reference types="vitest" />
```

### eslint.config.js modifications:
Remove cypress.config.ts from ignores array (since file will be deleted):
```typescript
{ ignores: ['dist', 'cypress.config.ts'] }, // Change to: { ignores: ['dist'] },
```

## 📋 Summary
Total items to remove:
- 1 entire directory (cypress/)
- 3 individual files 
- 7 npm dependencies
- 2 npm scripts
- 2 configuration blocks in existing files

After removal, you'll have a clean Ionic React Capacitor project without any testing libraries or configurations.
