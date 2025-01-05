import "./AlphabetMapping.css";

const AlphabetMapping = ({ mapping, decryptMode }) => {
  return (
    <div className="mapping-container">
      <p className="mapping-title">ALPHABET MAPPING</p>
      <div className="mapping-list">
        {Object.keys(mapping).map((letter) => (
          <div key={letter} className="mapping-item">
            <div className="letter-box">
              <span className="original-letter">{letter}</span>
            </div>
            <div className={"arrow" + (decryptMode ? " reversed" : "")}>→</div>
            <div className="letter-box">
              <span className="mapped-letter">{mapping[letter]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlphabetMapping;
