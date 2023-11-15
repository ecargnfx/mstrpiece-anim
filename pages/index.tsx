import React, { useState } from 'react';
import CharacterScene from '../components/CharacterScene';
import InputPrompt from '../components/InputPrompt';
import TimelineEditor from '../components/TimelineEditor'; // Import the TimelineEditor component
import '../app/globals.css';

const HomePage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'processing' | 'complete'>('idle');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isAssetGenerationVisible, setIsAssetGenerationVisible] = useState(true);
  const [isTimelineEditorVisible, setIsTimelineEditorVisible] = useState(true);

  const toggleAssetGeneration = () => {
    setIsAssetGenerationVisible(!isAssetGenerationVisible);
  };

  const toggleTimelineEditor = () => {
    setIsTimelineEditorVisible(!isTimelineEditorVisible);
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Top Section */}
      <div className={`flex w-full ${isTimelineEditorVisible ? 'h-2/3' : 'h-full'}`}>
        {/* Canvas Container */}
        <div id="canvas-container" className={`${isAssetGenerationVisible ? 'w-2/3' : 'w-full'} h-full`}>
          <CharacterScene url={status === 'complete' ? outputUrl : undefined} />
        </div>

        {/* Asset Generation Section */}
        {isAssetGenerationVisible && (
          <div id="asset-generation" className="w-1/3 h-full flex flex-col">
            <InputPrompt status={status} setStatus={setStatus} outputUrl={outputUrl} setOutputUrl={setOutputUrl} />
          </div>
        )}
      </div>

      {/* Timeline Editor Section */}
      {isTimelineEditorVisible && (
        <div id="timeline-editor" className="w-full h-1/3">
          <TimelineEditor />
        </div>
      )}

      {/* Toggle Buttons */}
      <button onClick={toggleAssetGeneration} className="absolute top-0 right-0 m-4">
        {isAssetGenerationVisible ? 'Hide Panel' : 'Show Panel'}
      </button>
      <button onClick={toggleTimelineEditor} className="absolute bottom-0 right-0 m-4">
        {isTimelineEditorVisible ? 'Hide Timeline' : 'Show Timeline'}
      </button>
    </div>
  );
};

export default HomePage;
