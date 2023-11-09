import React, { useState } from 'react';
import CharacterScene from '../components/CharacterScene';
import MasterpieceX from '../components/MasterpieceX';





const HomePage: React.FC = () => {

  const [status, setStatus] = useState<'idle' | 'pending' | 'processing' | 'complete'>('idle');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  return (
    <div>
      <CharacterScene url={status === 'complete' ? outputUrl : undefined} />
      <MasterpieceX status={status} setStatus={setStatus} outputUrl={outputUrl} setOutputUrl={setOutputUrl} />
    </div>
  );
};

export default HomePage;
