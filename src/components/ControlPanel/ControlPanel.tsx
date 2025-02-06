import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Components
import MapController from '../../controllers/MapController';

// Redux
import { mapLoaded as mapLoadedSelector } from './../../store/slices/mapSlice';

// Styles
import './ControlPanel.scss';
import React from 'react';

const ControlPanel = () => {
  // LOCAL STATE
  const [brightnessValue, setBrightnessValue] = useState<number>(0);
  const [confidenceValue, setConfidenceValue] = useState<number>(0);
  const [firesVisibility, setFiresVisibility] = useState<boolean>(true);
  // REDUX
  const mapLoaded = useSelector(mapLoadedSelector);

  useEffect(() => {
    if (mapLoaded) {
      MapController.updateFeatureFilter(brightnessValue, confidenceValue);
    }
  }, [brightnessValue, confidenceValue, mapLoaded]);

  useEffect(() => {
    if (mapLoaded) {
      MapController.updateLayerVisibility('us-fires', firesVisibility);
    }
  }, [firesVisibility, mapLoaded]);

  return (
    <div className='control-panel' id='control-panel'>
      <div className='control-container'>
        <p>Brightness Greater Than {brightnessValue}</p>
        <input
          type='range'
          min='0'
          max='11'
          step='0.1'
          value={brightnessValue}
          id='brightnessRange'
          onChange={(e) => setBrightnessValue(e.target.valueAsNumber)}
        />
      </div>
      <div className='control-container'>
        <p>Confidence Greater Than {confidenceValue}</p>
        <input
          type='range'
          min='0'
          max='100'
          value={confidenceValue}
          id='confidenceRange'
          onChange={(e) => setConfidenceValue(e.target.valueAsNumber)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={firesVisibility}
            onChange={() => setFiresVisibility(!firesVisibility)}
          /> US Fires
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;
