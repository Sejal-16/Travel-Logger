import "./app.css";
import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, {Marker ,Popup} from 'react-map-gl';
import {Room , Star} from '@material-ui/icons';


function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4
  });
  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      >
      <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
        <Room style = {{fontSize : viewport.zoom * 7, color : "slateblue"}}/>
      </Marker>
        <Popup
          latitude={37.78}
          longitude={-122.41}
          closeButton={true}
          closeOnClick={false}
          anchor="left" >
          <div className = "card">
            <label>Place</label>
            <h4 className = "place">San Francisco</h4>
            <label>Review</label>
            <p className = "desc">This is beautiful City</p>
            <label>Rating</label>
              <div>
                <Star className = "star"/>
                <Star className = "star"/>
                <Star className = "star"/>
                <Star className = "star"/>
                <Star className = "star"/>
              </div>
            <label>Information</label>
            <span className = "username">Created by <b>Jane</b></span>
            <span className = "date">1 hour ago</span>
          </div>
        </Popup>
      </ReactMapGL>
    </div>
  );
}

export default App;
