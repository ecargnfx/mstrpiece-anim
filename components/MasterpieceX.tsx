// components/MasterpieceX.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";
import LoaderComp from '@/components/LoaderComp';
import Model from './ModelPreview';

type MasterpieceXProps = {
    status: 'idle' | 'pending' | 'processing' | 'complete';
    setStatus: React.Dispatch<React.SetStateAction<'idle' | 'pending' | 'processing' | 'complete'>>;
    outputUrl: string | null;
    setOutputUrl: React.Dispatch<React.SetStateAction<string | null>>;
  };

const MasterpieceX: React.FC<MasterpieceXProps> = ({ status, setStatus, outputUrl, setOutputUrl }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [response, setResponse] = useState('');
  const intervalId = useRef<number | null>(null);
  const [animationPrompt, setAnimationPrompt] = useState('');  

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);
  
  

  const handleSubmit = async () => {
    setStatus('pending');
    const payload = {
        text,
        category,
        ...(category === 'Human' && { animationPrompt })  // Conditionally add animationPrompt to the payload
      };    
    console.log('Sending payload:', payload);  
    const res = await fetch('http://127.0.0.1:5000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data));

    if (data.status === 'complete') {
      setStatus('complete');
      setOutputUrl(data.outputUrl);
      console.log("Output URL:", data.outputUrl);
    } else if (data.status === 'processing') {
      setStatus('processing');
    }
   // Start polling every 5 seconds (or another suitable interval)
   intervalId.current = setInterval(checkApiStatus, 5000) as unknown as number;  
  };

  const checkApiStatus = async () => {
    const res = await fetch('http://127.0.0.1:5000/check-status');
    const data = await res.json();
    setStatus(data.status);
  
    if (data.status === 'complete') {
      clearInterval(intervalId.current); // Stop polling once status is complete
      setOutputUrl(data.outputUrl);
      console.log("Output URL:", data.outputUrl);
    }
  };
  

  const handleCheckStatus = async () => {
    const res = await fetch('http://127.0.0.1:5000/check-status');
    const data = await res.json();  
    console.log("API Response:", data);    
    console.log("Status:", data.status);  
    setResponse(data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ width: '48%', padding: '15px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', backgroundColor: '#ccc' }}>

          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Describe your character:</div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', marginBottom: '15px', backgroundColor: '#434a56', color: '#dfe6f0' }}
          />
          <div style={{ fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>Select a category:</div>          
          <ul style={{ listStyle:'none' }}>
            <li style={{ display:'inline' }}>
                <input type="radio" id="object" name="category" value="Object" onChange={() => setCategory('Object')} />
                <label htmlFor="object" style={{ marginLeft: '5px' }}>Object</label>
            </li>
            <li style={{ display:'inline' }}>
                <input type="radio" id="animal" name="category" value="Animal" onChange={() => setCategory('Animal')} />
                <label htmlFor="animal" style={{ marginLeft: '5px' }}>Animal</label>                
            </li>
            <li style={{ display:'inline' }}>
                <input type="radio" id="human" name="category" value="Human" onChange={() => setCategory('Human')} />
                <label htmlFor="human" style={{ marginLeft: '5px' }}>Human</label>                
            </li>
          </ul>
          {category === 'Human' && (
            <div>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Animation Prompt:</div>
                <input
                    type="text"
                    value={animationPrompt}
                    onChange={(e) => setAnimationPrompt(e.target.value)}
                    style={{ width: '100%', marginBottom: '15px', backgroundColor: '#434a56', color: '#dfe6f0' }}
                />
            </div>
            )}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleCheckStatus}>Check Status</button>
          <textarea value={response} onChange={(e) => setResponse(e.target.value)} style={{ width: '100%', height: '50px', marginTop: '10px', backgroundColor: '#434a56', color: '#dfe6f0' }}></textarea>
        </div>
        <div style={{ width: '48%', padding: '15px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', backgroundColor: '#ccc'}}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Describe the environment:</div>
        </div>
      </div>
      <div style={{ width: '100%', backgroundColor: 'gray', padding: '20px' }}>
        <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
          {(status === 'pending' || status === 'processing') && (
            <li style={{ border: '1px solid black', borderRadius: '10px', width: '100px', height: '100px', marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <LoaderComp />
            </li>
          )}
          {status === 'complete' && outputUrl && (
            <li style={{ border: '1px solid black', borderRadius: '10px', width: '100px', height: '100px', marginRight: '10px' }}>
              <Canvas>
                <Model url={outputUrl} />
              </Canvas>
            </li>
          )}
            <li style={{ border: '1px solid black', borderRadius: '10px', width: '100px', height: '100px', marginRight: '10px' }}>
              <Canvas>
                <Model url="https://storage.googleapis.com/processors-bucket.masterpiecex.com/api-sessions/c6e50038-d59a-4911-ba40-4c0c9b657c96/ml-requests_UJQ1RDYmveqNlHbEZUaO/exports/output.glb" />
              </Canvas>
            </li>
        </ul>
      </div>    
    </div>
  );
};

export default MasterpieceX;
