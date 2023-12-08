import React, { useEffect, useState } from 'react'
import { Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/RegisterStyle.css';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'; // Import uuid


const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const authToken = localStorage.getItem('token');
  


  useEffect(() => {
    // Fetch the user_id from localStorage and set it in the state
    const user_id = localStorage.getItem('user_id');
    setUserId(user_id);
  }, []);






  //form handeler
  const onFinishHandler = async (values) => {

    try {

      if (authToken) {

        ////////////////////////////////////////////////////////
         /*  here token is valid code api call php phalcon */
        ///////////////////////////////////////////////////////



        // Generate a session ID using uuid
          const sessionId = uuidv4();
          // Save the sessionId in a cookie
          document.cookie = `sessionId=${sessionId}; max-age=86400`; // Max age in seconds (e.g., 120/2 minit)   86400 24hour
          setTimeout(() => {

            document.cookie = 'sessionId=; max-age=0'; // Remove the cookie

          }, 86400000)  // 120000/2 minit  86400000 24 hour


          const res = await axios.patch('http://localhost:3000/users/sessionUpdate', {
            user_id: userId,
            sessionId: sessionId // Include the session ID
          });

           // Check the response from the server and proceed accordingly
           if (res.data.success) {
            navigate('/');

          } else {
            message.error("Login Failed");
          }


      }else{
        //this code run when session and token 1 st time create or empty...
       // const res = await axios.post('http://localhost:3000/api/v1/user-auth-tokens',
        const res = await axios.post('http://localhost:3000/login',
          {
            user_name: values.email,
            user_password: values.password
          }, {
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          }

        });

        if (res.data.return_status) {

          localStorage.setItem("token", JSON.stringify(res.data.resource.attributes.access_token));
          localStorage.setItem("user_id", JSON.stringify(res.data.resource.references.user.id));

          // Generate a session ID using uuid
          const sessionId = uuidv4();
          // Save the sessionId in a cookie
          document.cookie = `sessionId=${sessionId}; max-age=86400`; // Max age in seconds (e.g., 120/2 minit)   86400 24hour
          setTimeout(() => {

            document.cookie = 'sessionId=; max-age=0'; // Remove the cookie

          }, 86400000)  // 120000/2 minit  86400000 24 hour
          
          
          //navigate('/');

          const userRes = await axios.post('http://localhost:3000/users/sessionStore', {
            user_id: res.data.resource.references.user.id,
            login_name: values.email,
            password: values.password,
            sessionId: sessionId, // Include the session ID
          });

          // Check the response from the server and proceed accordingly
          if (userRes.data.success) {
            const responseMessage = "Login Successfully"
            message.success(responseMessage);
            navigate('/');

          } else {
            message.error("Login Failed");
          }

        } else {
          const errorMessage = "Login Failed"
          message.error(errorMessage);
        }
      }


      



    } catch (error) {

      console.log("------------------", error);
      message.error("Something Went Wrong");

    }
  }

  return (
    <>
      <div className="form-container">
        <Form layout='vertical' onFinish={onFinishHandler} className="register-form" >
          <h3 className='text-center'>Login From</h3>

          <Form.Item label="Email" name="email">
            <Input type='email' required></Input>
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type='password' required></Input>
          </Form.Item>
          <Link to="/register" className="m-2">Not a user register here</Link>
          <button className='btn btn-primary' type='submit'>Login</button>

        </Form>

      </div>

    </>
  )
}

export default Login
