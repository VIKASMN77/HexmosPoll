import React from 'react';
import { useNavigate } from 'react-router-dom';

function Heading() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <header onClick={handleClick} style={{ cursor: 'pointer' }}>
        <h1>Fly Weight Polls</h1>
        </header>
    </div>
  );
}

export default Heading;
