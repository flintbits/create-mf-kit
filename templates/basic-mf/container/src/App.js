import React, { Suspense } from "react";
const App1 = React.lazy(() => import("app1/App"));

const App = () => (
  <div>
    <h1>Container Application</h1>
    <Suspense fallback={<div>Loading MFE1...</div>}>
      <App1 />
    </Suspense>
  </div>
);

export default App;
