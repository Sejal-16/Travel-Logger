import "./app.css";
import * as React from 'react';
import { useState , useEffect } from 'react';
import axios from 'axios';
import ReactMapGL, {Marker ,Popup} from 'react-map-gl';
import {Room , Star} from '@material-ui/icons';
import {format} from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';


function App() {
  const myStorage = window.localStorage;
  // useState for loading of maps.
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4
  });
  //useState for fetching backend data of pins and rendering them into frontend.
  const [pins , setPins] = useState([]);
  //use state for handling closing of popup
  const [currentPlaceId , setCurrentPlaceId] = useState(null);
  //use state for setting pin by user.
  const [newPlace , setNewPlace] = useState(null);

  // use state for currentUser 
  const [currentUser , setCurrentUser] = useState(myStorage.getItem("user"));
  //use state for setting title
  const [title , setTitle] = useState(null);
  //use state for setting description
  const [desc , setDesc] = useState(null);
  //use state for setting rating
  const [rating , setRating] = useState(1);

  //use state for showing register section
  const [showRegister , setShowRegister] = useState(false);

   //use state for showing login section
   const [showLogin , setShowLogin] = useState(false);

  // for data fetching from backend.
  useEffect(() => {
    const getPins = async () =>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data);
      }catch(err){
        console.log(err);
      }
    };
    getPins();

  },[]);

  //const for handling marker click
  const handleMarkerClick = (id , lat , long) =>{
    setCurrentPlaceId(id);
    setViewport({...viewport , latitude:lat ,longitude:long});
  }
  // const for pinning a new place
  const handleAddClick = (e) =>{
    console.log(e);
     const [long , lat] = e.lngLat;
     setNewPlace({
       long ,
       lat
     }); 
  }
  //const for when user clicks on submit button
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newPin = {
      username : currentUser,
      title ,
      desc,
      rating ,
      lat : newPlace.lat,
      long : newPlace.long

    }
    try{
      const res = await axios.post("/pins",newPin);
      setPins([...pins , newPin]);
      setNewPlace(null);

    }catch(err){
      console.log(err);
    }
  }

  // const for handling logout
  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onDblClick = {handleAddClick}
      >
      {pins.map(p => (
        <>
        <Marker 
          latitude={p.lat} 
          longitude={p.long} 
          offsetLeft={- viewport.zoom * 3.5} 
          offsetTop={- viewport.zoom * 7}>
          <Room 
            style = {{fontSize : viewport.zoom * 7, color : p.username === currentUser?"tomato":"slateblue" , cursor : "pointer"}}
            onClick = {() => handleMarkerClick(p._id , p.lat ,p.long)}
            
          />
        </Marker>
        {p._id === currentPlaceId && (
          <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left" 
            onClose = {()=> setCurrentPlaceId(null)}
          >
          <div className = "card">
            <label>Place</label>
            <h4 className = "place">{p.title}</h4>
            <label>Review</label>
            <p className = "desc">{p.desc}</p>
            <label>Rating</label>
              <div>
                {Array(p.rating).fill(<Star className = "star"/>)}
              </div>
            <label>Information</label>
            <span className = "username">Created by <b>{p.username}</b></span>
            <span className = "date">{format(p.createdAt)}</span>
          </div>
        </Popup>
        )}
        </>
      ))}
      {newPlace && (
        <Popup
        latitude={newPlace.lat}
        longitude={newPlace.long}
        closeButton={true}
        closeOnClick={false}
        anchor="left" 
        onClose = {()=> setNewPlace(null)}
      >
        <div>
          <form onSubmit = {handleSubmit}>
            <label>Title</label>
            <input onChange = {e => {setTitle(e.target.value)}} placeholder = "Enter a title"/>
            <label>Review</label>
            <textarea onChange = {e => {setDesc(e.target.value)}} placeholder = "Write a review..."></textarea>
            <label>Rating</label>
            <select onChnage = {e => {setRating(e.target.value)}}>
              <option value = "1">1</option>
              <option value = "2">2</option>
              <option value = "3">3</option>
              <option value = "4">4</option>
              <option value = "5">5</option>
            </select>
            <button className = "submitButton">Add Pin</button>
          </form>
        </div>
      </Popup>
      )}
      { currentUser ? 
      (
        <button className = "button logout" onClick = {handleLogout}>Log Out</button>
      ) : (
        <div className = "buttons">
          <button className = "button login" onClick = {() => setShowLogin(true)}>Log In</button>
          <button className = "button register"  onClick = {() => setShowRegister(true)}>Register</button>
        </div>
      )}
      {showRegister && <Register setShowRegister = {setShowRegister}/>}
      {showLogin && <Login setShowLogin = {setShowLogin} myStorage = {myStorage} setCurrentUser = {setCurrentUser}/> }
      
      </ReactMapGL> 
    </div>
  );
}

export default App;
