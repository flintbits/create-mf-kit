import React, { Suspense } from "react";
import "./App.css";
import { useSelector } from "react-redux";
const App1 = React.lazy(() => import("app1/App"));

const App = () => {
  const count = useSelector((state) => state.counter.value);
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "50%",
        }}
      >
        <h2>Counter Display (Container)</h2>
        <p style={{ fontSize: "1rem" }}>Value: {count}</p>
      </div>
      <Suspense fallback={<div className="loading">Loading app1...</div>}>
        <App1 />
      </Suspense>

      <div className="instructions">
        <p>
          This project is scaffolded using <code>create-mfe-kit</code> a CLI
          tool for rapidly bootstrapping microfrontend apps using Webpack Module
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
              <code>npx create-mfe-kit add *app name*</code>
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
