// components/InputPrompt.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";
import LoaderComp from '@/components/LoaderComp';
import Model from './ModelPreview';
import './InputPrompt.css'; 

type InputPromptProps = {
    status: 'idle' | 'pending' | 'processing' | 'complete';
    setStatus: React.Dispatch<React.SetStateAction<'idle' | 'pending' | 'processing' | 'complete'>>;
    outputUrl: string | null;
    setOutputUrl: React.Dispatch<React.SetStateAction<string | null>>;
  };

const InputPrompt: React.FC<InputPromptProps> = ({ status, setStatus, outputUrl, setOutputUrl }) => {
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
      <div id="input-prompt-container">
        <h2 className="text-2xl font-semibold">What do you want to create?</h2>
        <div className="category-container">
          <label>
            <input type="radio" name="category" value="Object" onChange={() => setCategory('Object')} />
            Object
          </label>
          <label>
            <input type="radio" name="category" value="Animal" onChange={() => setCategory('Animal')} />
            Animal
          </label>
          <label>
            <input type="radio" name="category" value="Human" onChange={() => setCategory('Human')} />
            Human
          </label>
        </div>
        <div>
          <input
            type="text"
            placeholder={category === 'Human' ? 'Describe a character' : `Describe an ${category.toLowerCase()}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {category === 'Human' && (
            <input
              type="text"
              placeholder="doing something"
              value={animationPrompt}
              onChange={(e) => setAnimationPrompt(e.target.value)}
              className="input-text"
            />
          )}
          <span className='px-4'>in</span>
          <input
            type="text"
            placeholder="a scene"
            // value={scene}
            // onChange={(e) => setScene(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700" 
          onClick={handleSubmit}>
            Submit
        </button>
        <button onClick={handleCheckStatus}>Check Status</button>
        <textarea className="status-textarea" value={response} onChange={(e) => setResponse(e.target.value)}></textarea>
      </div>
      <div className="output-container h-full">
        <ul>
          {(status === 'pending' || status === 'processing') && (
            <li>
              <LoaderComp />
            </li>
          )}
          {status === 'complete' && outputUrl && (
            <li>
              <Canvas>
                <Model url={outputUrl} />
              </Canvas>
            </li>
          )}
            <li>
              <Canvas>
                <Model url="https://storage.googleapis.com/processors-bucket.masterpiecex.com/api-sessions/c6e50038-d59a-4911-ba40-4c0c9b657c96/ml-requests_UJQ1RDYmveqNlHbEZUaO/exports/output.glb" />
              </Canvas>
            </li>
        </ul>
      </div>    
    </div>
  );
};

export default InputPrompt;
