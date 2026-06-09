import React from "react";
import "./StoryLogo.css";

const StoryLogo: React.FC = () => {
  return (
    <span className="story-logo" aria-hidden="true">
      <img
        className="story-logo__image"
        src="/story-logo-wordmark.png"
        alt=""
        draggable={false}
      />
      <span className="story-logo__tagline">WRITE YOUR OWN FASHION</span>
    </span>
  );
};

export default StoryLogo;
