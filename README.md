# create-mf-kit
A CLI to scaffold Micro Frontend (MFE) architectures using Webpack Module Federation, React, and modern tooling.

---

## 🚀 What is this?
**`create-mf-kit`** is a developer-friendly CLI tool that sets up a plug-and-play Micro Frontend architecture including host and remote apps in seconds.

Inspired by tools like `create-react-app` and `create-vite`, but built specifically for MFE use cases.

---

## 🛠️ What will it do?

- Scaffold a full MFE-ready project:
  - 🧱 `container` (host shell)
  - 🔗 `app1`, `app2`, etc. (remote MFEs)
- Include preconfigured:
  - Webpack 5 + Module Federation
  - React + React Router
  - Optional Redux or Zustand for shared state
  - TypeScript support (optional)
  - Tailwind CSS (optional)
- Simple commands like:
  ```bash
  npm create mf-kit@latest
