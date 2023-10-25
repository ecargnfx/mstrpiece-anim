// components/MasterpieceX.tsx

import React, { useState } from 'react';

const MasterpieceX: React.FC = () => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://127.0.0.1:5000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data));
  };

  const handleCheckStatus = async () => {
    const res = await fetch('http://127.0.0.1:5000/check-status');
    const data = await res.text();
    setResponse(data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ width: '48%', padding: '15px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', backgroundColor: '#383e4b' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Enter your prompt:</div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', marginBottom: '15px', backgroundColor: '#434a56', color: '#dfe6f0' }}
          />

          <div style={{ fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>Select the category:</div>
          <div>
            <input type="radio" id="object" name="category" value="Object" onChange={() => setCategory('Object')} />
            <label htmlFor="object" style={{ marginLeft: '5px' }}>Object</label>
          </div>
          <div>
            <input type="radio" id="animal" name="category" value="Animal" onChange={() => setCategory('Animal')} />
            <label htmlFor="animal" style={{ marginLeft: '5px' }}>Animal</label>
          </div>
          <div>
            <input type="radio" id="human" name="category" value="Human" onChange={() => setCategory('Human')} />
            <label htmlFor="human" style={{ marginLeft: '5px' }}>Human</label>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div style={{ width: '48%', padding: '15px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', backgroundColor: '#383e4b' }}>
          <button onClick={handleCheckStatus}>Check Status</button>
          <textarea value={response} onChange={(e) => setResponse(e.target.value)} style={{ width: '100%', height: '100px', marginTop: '10px', backgroundColor: '#434a56', color: '#dfe6f0' }}></textarea>
        </div>
      </div>
    </div>
  );
};

export default MasterpieceX;
