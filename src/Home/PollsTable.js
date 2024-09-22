import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery, TextField, CircularProgress } from '@mui/material'; // Import CircularProgress

function PollsTable({ selectedTags }) {
  const [pollQuestions, setPollQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState(''); // State for text input

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polls/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setPollQuestions(data.data);
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [selectedTags]);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const filteredPolls = pollQuestions.filter(
    poll => !selectedTags.length || (poll.tags && poll.tags.some(tag => selectedTags.includes(tag)))
  );

  const columns = [
    { field: 'question_id', headerName: 'Question ID', width: 150 },
    {
      field: 'question_text',
      headerName: 'Poll Question',
      width: 300,
      renderCell: (params) => (
        <Link to={`/PollDetails?id=${params.row.question_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {params.value || 'No question text available'}
        </Link>
      ),
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 250, // Width for tags column
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row', // Stack tags vertically on mobile
            gap: isMobile ? '4px' : '8px', // Spacing between tags
            padding: 0, // Remove padding to prevent extra white space
          }}
        >
          {params.value && params.value.length > 0 
            ? params.value.map((tag, index) => (
                <span key={index} style={{ marginBottom: isMobile ? '4px' : '0px' }}>
                  {tag}
                </span>
              ))
            : 'No tags available'}
        </div>
      ),
    },
  ];

  const rows = filteredPolls.map((poll) => ({
    id: poll.question_id,
    question_id: poll.question_id,
    question_text: poll.question_text || 'No question text available',
    tags: poll.tags || [],  
  }));

  return (
    <div>
      {/* Display loader while data is being fetched */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <div
          style={{
            height: 600,
            width: '50%',
            marginLeft: '21%',
            marginTop:"-30%",
            '@media (max-width: 400px)': {
              width: '100%',
              marginLeft: '0%',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            pageSize={11}
            rowsPerPageOptions={[5, 10, 20]}
            disableColumnMenu={isMobile} // Disable column menu on mobile view
            sx={{
              '& .MuiDataGrid-cell': {
                fontSize: '18px',
                '@media (max-width: 600px)': {
                  fontSize: '14px',
                },
              },
              '& .MuiDataGrid-columnHeaders': {
                fontSize: '18px',
                '@media (max-width: 600px)': {
                  fontSize: '14px',
                },
              },
              '& .MuiDataGrid-columnHeader': {
                minWidth: 100, // Ensure column headers are not cut off
                overflow: 'hidden',
                '@media (max-width: 600px)': {
                  minWidth: '0%', // Allow flexibility for smaller screens
                  maxWidth: '40%', // Set a maximum width to fit the screen
                },
              },
              // Add padding specifically to the Tags column header
              '& .MuiDataGrid-columnHeader:has([data-field="tags"])': {
                padding: '0px', // Padding added to the tags column header
              },
              '@media (max-width: 600px)': {
                width: '190%', // Adjust width for small screens
                marginLeft: '-37%',
                marginTop: '170px',
                '& .MuiDataGrid-columnHeader': {
                  fontSize: '10px', // Adjust font size for better fit
                  minWidth: '2%', // Minimum width for headers on small screens
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '14px',
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PollsTable;
