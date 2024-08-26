
import React, { useState } from 'react';

const Button = ({ onClick, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <button 
      className={`custom-button ${isLoading ? 'loading' : ''}`} 
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;