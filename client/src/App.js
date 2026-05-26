import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";

// Following the BEM conventions

function App() {
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    try {
      fetch("/api")
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setBackendData(data);
        });
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  }, []);

  return (
    <div className="app">
      <NavBar />
      <main className="app-main">
        {backendData && Array.isArray(backendData.tests) ? (
          backendData.tests.map((test, i) => <p key={i}>{test}</p>)
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}

export default App;
