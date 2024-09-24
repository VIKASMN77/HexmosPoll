import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../Home/Heading';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({
    question: false,
    options: false,
    tags: false,
  });
  const [tagsErrorMessage, setTagsErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCreatePollClick = async () => {
    let hasError = false;
    const newInputErrors = { question: false, options: false, tags: false };

    // Validate inputs
    if (question.trim() === '') {
      newInputErrors.question = true;
      hasError = true;
    }
    if (options.some(option => option.trim() === '')) {
      newInputErrors.options = true;
      hasError = true;
    }
    if (tags.trim() === '' || tagsErrorMessage) {
      newInputErrors.tags = true;
      hasError = true;
    }

    setInputErrors(newInputErrors);

    if (hasError) {
      setError('Please fill out all fields correctly.');
      return;
    }

    const optionVote = options.reduce((acc, option) => {
      if (option.trim() !== '') {
        acc[option.trim()] = '0';
      }
      return acc;
    }, {});

    const pollData = {
      Question: question,
      OptionVote: optionVote,
      Tags: tags.split(',').map(tag => tag.trim())
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/polls/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      const result = await response.json();
      console.log('Poll created:', result);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error('Error creating poll:', error);
    }
  };

  const handleAddOptionClick = () => {
    setOptions([...options, '']);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);

    const newQuestionValue = e.target.value.trim();
    if (newQuestionValue !== '') {
      setInputErrors({ ...inputErrors, question: false });
    }

    if (newQuestionValue !== '' && options.every(opt => opt.trim() !== '') && tags.trim() !== '') {
      setError(null);
    }
  };

  const handleTagsChange = (e) => {
    const newTagsValue = e.target.value;
    setTags(newTagsValue);

    // Validate tags to allow only alphabets and commas
    const tagsPattern = /^[a-zA-Z,\s]*$/;
    if (!tagsPattern.test(newTagsValue)) {
      setInputErrors({ ...inputErrors, tags: true });
      setTagsErrorMessage('Only alphabets and commas are allowed.');
    } else {
      setInputErrors({ ...inputErrors, tags: false });
      setTagsErrorMessage('');
    }

    if (question.trim() !== '' && options.every(opt => opt.trim() !== '') && newTagsValue.trim() !== '') {
      setError(null);
    }
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);

    const newInputErrors = { ...inputErrors };
    if (newOptions[index].trim() !== '') {
      newInputErrors.options = false;
    }
    setInputErrors(newInputErrors);

    if (question.trim() !== '' && newOptions.every(opt => opt.trim() !== '') && tags.trim() !== '') {
      setError(null);
    }
  };

  const handleHeadingClick = () => {
    navigate('/');
  };

  return (
    <div className="create-poll-container">
      <Heading />

      <div className="create-poll-header" onClick={handleHeadingClick} style={{ cursor: 'pointer' }}>
        {/* Your heading content here */}
      </div>

      <form className="create-poll-form">
        <label htmlFor="question" className="create-poll-label">Question</label>
        <TextField
          id="question"
          variant="outlined"
          value={question}
          placeholder="Type your poll question here"
          onChange={handleQuestionChange}
          fullWidth
          error={inputErrors.question}
          helperText={inputErrors.question ? 'Question is required' : ''}
          sx={{
            marginLeft: '1%',
            width: '80%',
            backgroundColor: 'white',
            marginBottom: '16px'
          }}
        />

        <label htmlFor="options" className="create-poll-label">Options</label>
        {options.map((option, index) => (
          <div key={index} className="create-poll-option">
            <TextField
              id={`option${index + 1}`}
              variant="outlined"
              value={option}
              placeholder={`Option ${index + 1}`}
              onChange={(event) => handleOptionChange(index, event)}
              fullWidth
              error={inputErrors.options}
              helperText={inputErrors.options ? 'All options are required' : ''}
              sx={{
                marginLeft: '1%',
                width: '80%',
                backgroundColor: 'white',
                marginBottom: '16px'
              }}
            />
          </div>
        ))}

        <Button
          variant="outlined"
          onClick={handleAddOptionClick}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
            marginLeft: '3%',
            marginBottom: '4%',
            marginTop: "-1%",
            '&:hover': {
              backgroundColor: 'lightgray',
            }
          }}
        >
          Add Option
        </Button>

        <label htmlFor="tags" className="create-poll-label">Comma separated Tags</label>
        <TextField
          id="tags"
          variant="outlined"
          value={tags}
          placeholder="Tag 1, Tag 2"
          onChange={handleTagsChange}
          fullWidth
          error={inputErrors.tags}
          helperText={tagsErrorMessage || (inputErrors.tags ? 'Tags are required' : '')}
          sx={{
            marginLeft: '1%',
            width: '80%',
            backgroundColor: 'white',
            marginBottom: '4%'
          }}
        />
      </form>

      <div className="create-poll-submit-container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePollClick}
          sx={{
            height: '6%',
            width: '11%',
            color: 'black',
            marginLeft: '1%',
            marginTop: '1%',
            '&:hover': {
              backgroundColor: 'white',
            }
          }}
        >
          Create Poll
        </Button>
      </div>

      {error && <div className="create-poll-error-message">{error}</div>}
    </div>
  );
}

export default CreatePoll;
