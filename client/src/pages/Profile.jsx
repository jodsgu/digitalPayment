import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/PasswordUpdateStyle.css';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'

import axios from 'axios'


const Profile = () => {
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);

  
  const storedUser = localStorage.getItem('user-basic-details');
  const parsedUser = JSON.parse(storedUser);

  const navigate = useNavigate();


  const onFinishHandler = async (values) => {
    values = values.password
    try {
      const res = await axios.put(`http://localhost:3000/api/v1/users/${parsedUser.id}?auto-login=1`, { password: values }, {
        headers: {
          'user-id': parsedUser.id, // Set the user-id header
        },
      });

      console.log("*******************", res);
      //console.log(">>>>>>>>>>>>>>>>>>>.",res.data.resource.attributes);



      if (res.data.return_status) {
        const responseMessage = res.data.return_message
        message.success(responseMessage);

        // Make an additional API call to fetch the updated user information
       /*  const updatedUserRes = await axios.get(`http://localhost:3000/api/v1/users/${parsedUser.id}`, {
          headers: {
            'user-id': parsedUser.id, // Set the user-id header
          },
        }); */

         
        //localStorage.setItem('user', JSON.stringify(updatedStoredUser));
        localStorage.clear();

        navigate('/login');
      } else {
        const errorMessage = res.data.return_message
        message.error(errorMessage);
      }
    } catch (error) {

      console.log("------------------", error);
      message.error("Something Went Wrong");

    }

  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordMatch(newPassword === cpassword);
  };

  const handleCPasswordChange = (e) => {
    const newCPassword = e.target.value;
    setCPassword(newCPassword);
    setPasswordMatch(newCPassword === password);
  };



  return (
    <>
      <Layout>
        {storedUser ? (
          <div className="passwordUpdate">
            <Form layout="vertical" onFinish={onFinishHandler} className="passwordUpdate-form">
              <h3 className="text-center" style={{ color: '#16536c' }}>
                Password Update Form
              </h3>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
                <Input type="password" onChange={handlePasswordChange} required />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="c-password"
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        setPasswordMatch(true);
                        return Promise.resolve();
                      }
                      setPasswordMatch(false);
                      return Promise.reject(new Error('The passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input type="password" onChange={handleCPasswordChange} required />
              </Form.Item>
              <button className="btn btn-primary" type="submit" disabled={!passwordMatch}>
                Update
              </button>
            </Form>
          </div>
        ) :  (
                <div>
                  <h3>Profile Page</h3>
                </div>
            ) 
        
        
        }
      </Layout>
    </>
  )
}

export default Profile
