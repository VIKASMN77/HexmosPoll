import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Heading from '../Home/Heading';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from '@mui/material';

function PollDetail() {
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);
  const [totalPolls, setTotalPolls] = useState(1);
  const [loading, setLoading] = useState(true); // Track loading state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 420px)');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        if (!queryId) {
          throw new Error('No query parameter id found');
        }

        const response = await fetch(`http://127.0.0.1:8000/polls/${queryId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPoll(data.data);
        setTotalPolls(1); // Default to 1 for now
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading when data is fetched or error occurs
      }
    };

    fetchPoll();
  }, [queryId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>Error: {error}</div>;
  }

  const totalVotes = poll.OptionVote ? Object.values(poll.OptionVote).reduce((a, b) => a + b, 0) : 0;

  const handleVoteClick = () => {
    navigate(`/Vote?id=${queryId}`);
  };

  const pieData = {
    labels: poll.OptionVote ? Object.keys(poll.OptionVote) : [],
    datasets: [
      {
        data: poll.OptionVote ? Object.values(poll.OptionVote) : [],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'question', headerName: 'Question', flex: 2 },
    { field: 'totalVotes', headerName: 'Total Votes', flex: 1 },
  ];

  const rows = [
    {
      id: poll.QuestionID,
      question: poll.Question,
      totalVotes: totalVotes,
    },
  ];

  const handlePageChange = (params) => {
    setCurrentPage(params.page + 1);
  };

  return (
    <div>
      <Heading />
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginTop: '30px' }}>
        {/* Left Section */}
        <div style={{ flex: 1, paddingRight: isMobile ? '0' : '20px' }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleVoteClick}
            sx={{
              width: '100%', // Full width button
              maxWidth: '220px',
              height: '50px',
              backgroundColor: 'Lightgray',
              color: 'black',
              '&:hover': {
                backgroundColor: 'white',
              },
              marginBottom: '20px',
              fontSize: '1.2rem', 
              marginLeft:"1%",
            }}
          >
            Vote on this
          </Button>

          {/* DataGrid Section */}
          <div style={{ height: 200, width: isMobile ? '100%' : '70%', marginTop: '20px', marginLeft:"1%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={itemsPerPage}
              pagination
              paginationMode="server"
              rowCount={totalPolls}
              onPageChange={handlePageChange}
              sx={{
                '& .MuiDataGrid-cell': {
                  fontSize: '1.2rem',
                  padding: '2 0%', // Adds 10px space between cells for compactness
                },
                '& .MuiDataGrid-columnHeaders': {
                  fontSize: '1rem',
                  padding: '0 0%', // Adds 10px space between column headers
                },
                '& .MuiDataGrid-cell--textLeft': {
                  paddingLeft: "1%", // Adjust cell padding for left-aligned text
                },
                '& .MuiDataGrid-cell--textRight': {
                  paddingRight: '10px', // Adjust cell padding for right-aligned text
                },
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: isMobile ? '0' : '-44%' }}>
          <div style={{ width: '100%', maxWidth: '300px', height: '350px', marginTop: '20px' }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '-20px', fontSize: '1.5rem', marginLeft:"1%" }}>
        <strong>Tags:</strong> {poll.Tags ? poll.Tags.join(', ') : 'No tags available'}
      </div>
    </div>
  );
}

export default PollDetail;
