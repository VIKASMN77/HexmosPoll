import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Heading from '../Home/Heading';
import Button from '@mui/material/Button'; 
import CircularProgress from '@mui/material/CircularProgress'; // MUI CircularProgress for loading

function Vote() {
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        if (!queryId) {
          throw new Error('No query parameter id found');
        }
        const response = await fetch(`http://127.0.0.1:8000/polls/${queryId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched poll data:', data);

        if (data.success && data.data) {
          const optionArray = Object.keys(data.data.OptionVote).map(optionID => ({
            OptionID: optionID,
            VoteCount: data.data.OptionVote[optionID]
          }));
          setPoll({
            Question: data.data.Question,
            Options: optionArray
          });
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // End loading once the fetch is complete
      }
    };

    fetchPollDetails();
  }, [queryId]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = async () => {
    if (selectedOption) {
      try {
        console.log('Submitting vote for option:', selectedOption);

        const requestPayload = { incrementOption: selectedOption };
        console.log('Request payload:', requestPayload);

        const response = await fetch(`http://127.0.0.1:8000/polls/${queryId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        const result = await response.json();
        console.log('Response from server:', result);

        if (!response.ok) {
          throw new Error('Failed to submit vote');
        }

        if (result.success) {
          setPoll(prevPoll => ({
            ...prevPoll,
            Options: prevPoll.Options.map(option =>
              option.OptionID === selectedOption
                ? { ...option, VoteCount: option.VoteCount + 1 }
                : option
            )
          }));

          setSuccessMessage('Vote submitted successfully!');
          setError(null);

          navigate(`/PollDetails?id=${queryId}`);
        } else {
          throw new Error('Error in response from server');
        }
      } catch (error) {
        setError('Error submitting vote: ' + error.message);
        setSuccessMessage(null);
      }
    } else {
      setError('No option selected');
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="vote-loading-message" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="vote-error-message">Error: {error}</div>;
  }

  return (
    <div>
      <Heading style={{ marginLeft: '-1%', marginTop: '-2%' }} />
      
      {successMessage && <div className="vote-success-message">{successMessage}</div>}

      <div className="vote-details">
        <div className="vote-question">{poll.Question}</div>

        {poll.Options.length > 0 ? (
          poll.Options.map((option) => (
            <div key={option.OptionID} className="vote-option">
              <label className="vote-option-label">
                <input
                  type="radio"
                  name="pollOption"
                  value={option.OptionID}
                  checked={selectedOption === option.OptionID}
                  onChange={handleOptionChange}
                  className="vote-option-input"
                />
                <span className="vote-option-text">{option.OptionID} - Votes: {option.VoteCount}</span>
              </label>
            </div>
          ))
        ) : (
          <p>No options available</p>
        )}
        
        {/* MUI Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleVote}
          sx={{
            marginTop: '40px',
            fontSize: '1.2rem',
            padding: '10px 20px',
            marginLeft: '25px',
          }}
        >
          Vote
        </Button>
      </div>
    </div>
  );
}

export default Vote;
