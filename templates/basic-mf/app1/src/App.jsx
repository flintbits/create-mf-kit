import React, { useEffect, useState } from "react";

const STORAGE_KEY = "mfe-counter-value";

const App = () => {
  const [count, setCount] = useState(
    parseInt(localStorage.getItem(STORAGE_KEY)) || 0
  );

  useEffect(() => {
    const update = () => {
      setCount(parseInt(localStorage.getItem(STORAGE_KEY)) || 0);
    };

    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <div>
      <h2>Counter Display (App1)</h2>
      <p>Value: {count}</p>
    </div>
  );
};

export default App;
