// Components
import MapView from '../MapView/MapView';
import FiresChart from '../Charts/USFiresChart';
import React from 'react';

const App = () => {
  return (
    <div className="app-container">
      <div className="mapview-container">
        <MapView />
      </div>
      <div className="chart-container">
        <FiresChart />
        </div>
      {/* <BasemapContainer mapView={MapView} /> */}
    </div>
  );
};

export default App;
