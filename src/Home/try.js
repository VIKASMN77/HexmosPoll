import React, {useState } from 'react';
function value() {
     const [count,setcount]=useState(10)
     return (
        <>
          <h1>The number is {count}!</h1>
          <button
            type="button"
            onClick={() => setcount("20")}
          >20</button>
        </>
     )
}