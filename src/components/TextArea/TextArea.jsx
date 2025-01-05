import { useState, useEffect, useRef } from "react";
import "./TextArea.css";

const TextArea = ({ mapping, decryptMode, setDecryptMode }) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [copyState, setCopyState] = useState("");
  const [reverseOutput, setReverseOutput] = useState(false);
  const debounceTimer = useRef(null);

  const handleModeToggle = () => {
    setDecryptMode(!decryptMode);
    if (!outputText) return;
    setReverseOutput(true);
    setTimeout(() => {
      setReverseOutput(false);
    }, 500);
    let newInput = outputText;
    let newOutput = inputText;
    setInputText(newInput);
    setOutputText(newOutput);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        setCopyState("success");
        setCopyText("Copied!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setCopyState("error");
        setCopyText("Failed to Copy");
      })
      .finally(() => {
        setTimeout(() => {
          setCopyState("");
          setCopyText("Copy");
        }, 2000);
      });
  };

  const getReverseMapping = () => {
    const reverseMapping = {};
    Object.keys(mapping).forEach((key) => {
      reverseMapping[mapping[key]] = key; // Reverse the mapping
    });
    return reverseMapping;
  };

  const transformText = (text, mapping) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => {
        return mapping[char] || char;
      })
      .join("");
  };

  const handleOutput = (input) => {
    let transformedText = "";
    if (decryptMode) {
      let reverseMapping = getReverseMapping();
      transformedText = transformText(input, reverseMapping);
    } else {
      transformedText = transformText(input, mapping);
    }
    setOutputText(transformedText);
  };

  useEffect(() => {
    handleOutput(inputText);
  }, [mapping]);

  const handleInputChange = (e) => {
    const text = e.target.value.toUpperCase();
    setInputText(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleOutput(text);
    }, 300);
  };

  return (
    <div className="textarea-container">
      <textarea
        className={
          "textarea " + (reverseOutput ? "textarea-output" : "textarea-input")
        }
        placeholder={"Enter text to " + (decryptMode ? "decrypt" : "encrypt")}
        value={inputText}
        onChange={handleInputChange}
      />
      <button
        onClick={handleModeToggle}
        className="mode-toggle btn-icon"
        title="Toggle encrypt/decrypt mode"
      >
        🔄️
      </button>
      <textarea
        className={
          "textarea " + (reverseOutput ? "textarea-input" : "textarea-output")
        }
        placeholder={
          (decryptMode ? "Decrypted" : "Encrypted") + " text will appear here"
        }
        value={outputText}
        readOnly
      />
      {outputText && (
        <button onClick={handleCopy} className={"copy-button " + copyState}>
          {copyText}
        </button>
      )}
    </div>
  );
};

export default TextArea;
