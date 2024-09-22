import React, { useState, useEffect } from 'react';


function Sidebar({ selectedTags, setSelectedTags }) {
  const [tags, setTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/polls/tags/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTags(data.data);
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch((error) => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  const handleTagChange = (tag) => {
    setTempSelectedTags((prevSelectedTags) => {
      const newSelectedTags = prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag];

      console.log("Tags:", newSelectedTags); 
      return newSelectedTags;
    });
  };

  const handleFilterClick = () => {
    setSelectedTags(tempSelectedTags);
  };

  return (
    <form>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <div className="tag-checkbox" key={tag}>
            <input
              type="checkbox"
              checked={tempSelectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
            />
            <label>{tag}</label>
          </div>
        ))
      ) : (
        <p>No tags available</p>
      )}
      <button
        className="filter-button"
        onClick={handleFilterClick}
        type="button" // Use type button to prevent form submission
      >
        Filter by Tags
      </button>
    </form>
  );
}

export default Sidebar;
