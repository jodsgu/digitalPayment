import React from 'react'
import { Navigate } from 'react-router-dom'



const PublicRoutes = (props) => {
  
    const token = localStorage.getItem('token');
    const sessionId = document.cookie
   
    
    if(!token){
      document.cookie = 'sessionId=; max-age=0'; // Remove the cookie
      return props.children
    }else{

      //code for check token is valied? PHP 


      if(sessionId){
        return<Navigate to="/" />
      }else{
         return props.children
        
      }
    }

/* if(localStorage.getItem('token')){   
    return<Navigate to="/" />
  }else{
    return props.children
  } */
}

export default PublicRoutes
