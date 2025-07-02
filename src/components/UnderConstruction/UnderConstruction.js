import React from "react";
import "./UnderConstruction.css";

const UnderConstruction = () => {
  return (
    <div className="construction-wrapper">
      <div className="construction-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2721/2721295.png"
          alt="Under Construction"
          className="icon"
        />
        <h1>Page Under Construction</h1>
        <p>
          We're working hard to bring this page to live. <br />
          Please check back soon!
        </p>
        <button
          className="go-back-button"
          onClick={() => window.history.back()}
        >
          ⬅ Go Back
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
