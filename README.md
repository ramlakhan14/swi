# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Local Admin Login

The ignored `.env.local` enables a development-only mock API at `/api`. It serves
admin and dealer logins plus a seeded dashboard with three demo products from
`mock-db.json`; other `/api` requests return 404, and no live API is contacted.

Run `npm ci`, then `npm run dev` and open `/login-admin` on the local Vite URL.

Demo accounts:

- Admin: `admin@example.test` / `DemoAdmin123!`
- Dealer: `DEMO-DEALER` / `DemoDealer123!`
- Subdealer: `DEMO-SUBDEALER` / `DemoSubdealer123!`
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
