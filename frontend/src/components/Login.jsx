import React from 'react';
import "./login.css";
import {Room , Cancel} from '@material-ui/icons';
import { useState , useRef } from 'react';
import axios from 'axios';


export default function Login({setShowLogin , myStorage , setCurrentUser}) {
    
    //use state for error message
    const [error , setError] = useState(false);

    // setting some references

    const nameRef = useRef();
    
    const passwordRef = useRef();

    // const for handling submit
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const user = {
            username : nameRef.current.value,
            password : passwordRef.current.value,
        }
        try{
            const res = await axios.post("/users/login" , user);
            myStorage.setItem("user" , res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);

        }catch(err){
            console.log(err);
            setError(true);
        }

    }

    return (
        <div className = "loginContainer">
            <div className = "logo">
                <Room/>
                TravelLogger
            </div>
            <form onSubmit = {handleSubmit}>
                <input type = "text" placeholder = "username" ref = {nameRef}/>
                <input type = "password" placeholder = "password" ref = {passwordRef}/>
                <button className = "loginBtn">Log In</button>
                {(error && <span className = "failure">Something went wrong ! Try again</span> )}
                
                
            </form>
            <Cancel className = "loginCancel" onClick = {() => setShowLogin(false)}/>

        </div>
    )
}