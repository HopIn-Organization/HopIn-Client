---
name: ESLint config missing — lint command non-functional
description: npm run lint always fails with a missing eslint.config.js error; build is the reliable TypeScript check
type: feedback
---

`npm run lint` fails with "ESLint couldn't find an eslint.config.(js|mjs|cjs) file" on every run — the project has not been migrated to ESLint v9 flat config format. The command exits with code 2 and produces no useful output.

**Why:** The project uses ESLint v10 but still has a legacy `.eslintrc.*`-style setup that was never migrated.

**How to apply:** Use `npm run build` (TypeScript compiler) as the primary static check. Do not rely on `npm run lint` for validation or treat its failure as a regression introduced by changes.
