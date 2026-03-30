// src\App.jsx Main File

import AppRouter from "@router/AppRouter";

// ─── App ──────────────────────────────────────────────────────────────────────
// Root component. Keeps things minimal — all logic lives in providers and screens.
// Phase 2: Global components (Loader, Toast) will be added here.

const App = () => {
  return <AppRouter />;
};

export default App;
