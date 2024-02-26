import React, { useState, useEffect } from 'react';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 80) {
          clearInterval(interval);
          return 80;
        }
        return Math.min(oldProgress + 10, 80);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-bar" style={{ width: `${progress}%` }}>
        <div className="loading-indicator">{`${progress}%`}</div>
      </div>
    </div>
  );
};

export default LoadingBar;
