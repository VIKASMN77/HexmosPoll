import React, { useState } from 'react';
import Heading from './Heading';
import CreatePollbtn from './CreatePollbtn';
import Sidebar from './Sidebar';
import PollsTable from './PollsTable';
import '../App.css';

function App() {
  const [selectedTags, setSelectedTags] = useState([]); 

  return (
    <div className="App">
      <Heading />
      <div className="createpoll">
        <CreatePollbtn />
        <div className="Sidebar">
          <Sidebar selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        <div className="right-box">
          <PollsTable selectedTags={selectedTags} />
        </div>
      </div>
    </div>
  );
}

export default App;
