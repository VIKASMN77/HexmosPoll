import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function CreatePollbtn() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/CreatePoll');
  };

  return (
    <div className="create">
      <Button 
        variant="contained"
        onClick={handleClick}
        sx={{
          marginLeft: '3%', 
          marginBottom: '1%', 
          marginTop: '1%', 
          width: '16%', 
          height: '50px', 
          
          '&:hover': {
            backgroundColor: 'lightgray',
          },
        }}
      >
        Create Poll
      </Button>
    </div>
  );
}

export default CreatePollbtn;
