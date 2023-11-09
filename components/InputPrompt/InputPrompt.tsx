import React from 'react';
import './InputPrompt.css';
import Image from 'next/image';

interface InputPromptProps {
  onInputChange: (input: string) => void;
}

const InputPrompt: React.FC<InputPromptProps> = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange(event.target.value);
  };
  return (
    <div className="input-prompt-container">
      <div className="tabs">
        <div className="tab">
          <Image src="/icons/icon-character.png" alt="Character Icon" />
          <span>Character</span>
        </div>
        <div className="tab active">
          <Image src="/icons/icon-animate.png" alt="Animate Icon" />
          <span>Animate</span>
        </div>
        <div className="tab">
          <Image src="/icons/icon-scene.png" alt="Scene Icon" />
          <span>Scene</span>
        </div>
      </div>
      <div className="textfield">
        <Image src="/icons/icon-upload.png" alt="Left Icon 1" />
        <Image src="/icons/icon-camera.png" alt="Left Icon 2" />
        <input type="text" placeholder="Describe what you want to see" onChange={(e) => onInputChange(e.target.value)} />      
        <Image src="/icons/icon-send.png" alt="Right Icon 1" />
        <Image src="/icons/icon-mic.png" alt="Right Icon 2" />
      </div>
    </div>
  );
};

export default InputPrompt;
