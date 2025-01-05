import "./App.css";
import { useState, useEffect } from "react";
import TextArea from "./components/TextArea/TextArea";
import AlphabetMapping from "./components/AlphabetMapping/AlphabetMapping";
import Controls from "./components/Controls/Controls";

function App() {
  const [mapping, setMapping] = useState({});
  const [advanceMode, setAdvanceMode] = useState(false);
  const [decryptMode, setDecryptMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (darkModePreference) {
      const root = document.documentElement;
      root.classList.add("dark-mode");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      const root = document.documentElement;
      if (newMode) {
        root.classList.add("dark-mode");
      } else {
        root.classList.remove("dark-mode");
      }
      return newMode;
    });
  };

  return (
    <>
      <button className="theme btn-icon" onClick={toggleTheme}>
        {isDarkMode ? "🔆" : "🔅"}
      </button>
      <p className="app-title">MESSAGE ENCRYPTION</p>
      <TextArea
        mapping={mapping}
        decryptMode={decryptMode}
        setDecryptMode={setDecryptMode}
      />
      <Controls
        setMapping={setMapping}
        advanceMode={advanceMode}
        setAdvanceMode={setAdvanceMode}
      />
      <AlphabetMapping mapping={mapping} decryptMode={decryptMode} />
    </>
  );
}

export default App;
