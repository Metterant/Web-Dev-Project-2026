import React, { useEffect, useState } from "react";
import "./App.css";
import MainContainer from "./MainContainer";
import { apiFetch } from "./services/apiClient";

// Following the BEM conventions

function App() {
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    try {
      apiFetch("/api")
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
    <MainContainer>
      {backendData && Array.isArray(backendData.tests) ? (
        backendData.tests.map((test, i) => <p key={i}>{test}</p>)
      ) : (
        <p>Loading...</p>
      )}
    </MainContainer>
  );
}

export default App;
