import React from 'react'
import { Navigate } from 'react-router-dom'


const ProtectedRoutes = (props) => {

  const token = localStorage.getItem('token');
  const sessionId = document.cookie


  if(!token){
    document.cookie = 'sessionId=; max-age=0'; // Remove the cookie
    return <Navigate to ='/login' />
  }else{
    if(sessionId){
      return props.children
    }else{
      // //if token have and session expire then create seesion id and update throuth user id 

      return <Navigate to ='/login' />
    }
  }




  //here i used user from local storage but token also save
 /* if(localStorage.getItem("token") || localStorage.getItem("user-basic-details") ){
    return props.children
  }else{
    return <Navigate to ='/login' />
  } */
}

export default ProtectedRoutes
