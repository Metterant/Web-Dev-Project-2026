import React, { useEffect, useState } from "react";

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
    <div>
      {backendData && Array.isArray(backendData.tests) ? (
        backendData.tests.map((test, i) => <p key={i}>{test}</p>)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
