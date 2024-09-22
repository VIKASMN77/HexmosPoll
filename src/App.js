import React from 'react';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './Home/Home';
import Vote from './Vote/Vote';
import PollDetail from './PollDetails/PollDetail';
import CreatePoll from './CreatePoll/CreatePoll';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Vote" element={<Vote />} />
        <Route path="/PollDetails/" element={<PollDetail />} /> 
        <Route path="/CreatePoll" element={<CreatePoll />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
