import "./Controls.css";
import { useEffect, useState, useRef } from "react";

const Controls = ({ advanceMode, setAdvanceMode, setMapping }) => {
  const [inputText, setInputText] = useState("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetArray = alphabet.split("");
  const debounceTimer = useRef(null);

  const handleShuffle = () => {
    const shuffled = [...alphabetArray].sort(() => Math.random() - 0.5);

    const newMapping = alphabetArray.reduce((map, letter, index) => {
      map[letter] = shuffled[index];
      return map;
    }, {});

    setMapping(newMapping);
  };

  const createDefaultMapping = () => {
    return alphabetArray.reduce((map, letter) => {
      map[letter] = letter;
      return map;
    }, {});
  };

  const generateHash = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  const handleGenerate = (inputVal = inputText) => {
    const key = inputVal.trim();

    if (key.length == 0) {
      let newMapping = createDefaultMapping();
      setMapping(newMapping);
      return;
    }

    const hashedKey = generateHash(key).toString();

    let newMapping = {};
    let used = new Set();

    let keyIndex = 0;
    for (let i = 1; i <= 26; i++) {
      const charCode = hashedKey.charCodeAt(keyIndex++ % hashedKey.length);
      let newIndex = (charCode + i) % 26;

      while (used.has(newIndex)) {
        newIndex = (newIndex + 7) % 26;
      }

      used.add(newIndex);
      newMapping[alphabetArray[i - 1]] = alphabet[newIndex];
    }

    setMapping(newMapping);
  };

  const handleInputChange = (e) => {
    const inputVal = e.target.value;
    setInputText(inputVal);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleGenerate(inputVal);
    }, 500);
  };

  useEffect(() => {
    if (advanceMode) {
      handleGenerate();
    } else {
      handleShuffle();
    }
  }, [advanceMode]);

  return (
    <div className="controls">
      {advanceMode && (
        <form
          className="advance-container"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="key-input">
            <label htmlFor="keyInput">Enter Secret Key:</label>
            <input
              type="password"
              id="keyInput"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter your secret key"
              pattern="[A-Za-z\s]*"
              title="Only alphabets and spaces are allowed"
              required
            />
          </div>
          <button className="generate-button" type="submit">
            Generate Unique Mapping
          </button>
        </form>
      )}

      {!advanceMode && (
        <button className="shuffle-button" onClick={handleShuffle}>
          Generate Random Mapping
        </button>
      )}
      <button
        className="mode-button"
        onClick={() => setAdvanceMode(!advanceMode)}
        title={
          advanceMode
            ? "Generate Random Key Mappings"
            : "Generate Unique Key Mappings Using Your Secret Key"
        }
      >
        {advanceMode ? "Random Mode" : "Advance Mode"}
      </button>
    </div>
  );
};

export default Controls;
