import React from "react";
import { useDispatch } from "react-redux";
import { increment, decrement } from "container/store";

const App = () => {
  const dispatch = useDispatch();
  return (
    <div className="controls">
      <h2>Counter Controls (App1) </h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default App;
