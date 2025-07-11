import React, { Suspense } from "react";
import "./App.css";
const App1 = React.lazy(() => import("app1/App"));

const STORAGE_KEY = "mfe-counter-value";

const App = () => {
  const update = (delta) => {
    const current = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
    localStorage.setItem(STORAGE_KEY, current + delta);
    window.dispatchEvent(new Event("storage")); // update in same tab
  };
  return (
    <div className="container">
      <div className="controls">
        <h2>Counter Controls (Container)</h2>
        <button onClick={() => update(1)}>Increment</button>
        <button onClick={() => update(-1)}>Decrement</button>
        <Suspense fallback={<div className="loading">Loading MFE1...</div>}>
          <App1 />
        </Suspense>
      </div>

      <div className="instructions">
        <p>
          This project is scaffolded using <code>create-mf-kit</code> a CLI tool
          for rapidly bootstrapping microfrontend apps using Webpack Module
          Federation.
        </p>
        <p>
          <strong>container</strong>: The host application that loads remote
          apps.
        </p>

        <p>
          <strong>app1</strong>: A remote MFE exposed via{" "}
          <code>ModuleFederationPlugin</code>.
        </p>

        <h2>How to Add a New Remote App</h2>
        <ol>
          <li>
            Open a terminal and run:
            <pre>
              <code>npx create-mf-kit add *app name*</code>
            </pre>
          </li>
          <li>
            Enter the app name (e.g., <code>app2</code>)
          </li>
          <li>
            Select a port (e.g., <code>3002</code>)
          </li>
        </ol>
      </div>
    </div>
  );
};

export default App;
