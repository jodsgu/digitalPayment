import React, {  useState } from 'react'
import { Form, Input, DatePicker, Select, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/RegisterStyle.css';
import moment from "moment";
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { SetUser } from '../features/UserSlice';

const { Option } = Select; 


const Register = () => {
  ///newwwwwwwww
  
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [countryCode, setCountryCode] = useState("+91")

  // Set initial values for the form
  const initialValues = {
    country_iso4code: countryCode,
  };

  // Form handler
  const onFinishHandler = async (values) => {

    //set user_identities null
    values.user_identities = null;

    // Convert the date format
    if (values.date_of_birth) {
      values.date_of_birth = moment(values.date_of_birth).format('YYYY-MM-DD');
    }

    // Convert Postal Code to a number
    if (values.postal_code) {
      values.postal_code = Number(values.postal_code);
    }


    // Set the __params value before submitting
    values.__params = {
      output: {
        format: 'dereference',
      },
    };

    // console.log(values);
    try {
      
      const res = await axios.post('http://localhost:3000/api/v1/users', values, {
        headers: {
          'user-id': 1, // Set the user-id header
        },
      });

      console.log("*******************", res);
      console.log(">>>>>>>>>>>>>>>>>>>.",res.data.resource.attributes);


      
      if (res.data.return_status) {
        const responseMessage = "Register Successfully"
        message.success(responseMessage);
        dispatch(SetUser(res.data.resource))
       
       localStorage.setItem("user-basic-details", JSON.stringify(res.data.resource));
        navigate('/profile');
      } else {
        const errorMessage = "Register Failed"
        message.error(errorMessage);
      }
    } catch (error) {

      console.log("------------------", error);
      message.error("Something Went Wrong");

    }
  };


 

  return (
    <>
      <div className="form-container" style={{ height: 'auto' }}>
        <Form layout='vertical' initialValues={initialValues} onFinish={onFinishHandler} className="register-form" >
          <h3 className='text-center'>Register From</h3>
          <Form.Item label="First Name" name="first_name">
            <Input type='text' required></Input>
          </Form.Item>
          <Form.Item label="Last Name" name="last_name">
            <Input type='text' required></Input>
          </Form.Item>
          <Form.Item label="Date of Birth" name="date_of_birth" required>
            <DatePicker className='m-2' format="DD-MM-YYYY" onChange={(value) => setDate(moment(value).format('DD-MM-YYYY'))} />
          </Form.Item>
          <Form.Item label="Country Code" name="country_iso4code">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Postal Code" name="postal_code">
            <Input type='number' required></Input>
          </Form.Item>

          <Form.Item label="Aadhar No" name="user_identities">
            <Input type='text'></Input>
          </Form.Item>

          <Form.Item label="Type of User" name="type_of_user" rules={[{ required: true }]}>
            <Select>
              <Option value="customer">Customer</Option>
              <Option value="vendor">Vendor</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Contact Details">
            <Form.List name="user_contact_details">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <Form.Item
                        label="Type ID"
                        name={[field.name, 'type_id']}
                        initialValue={index === 0 ? 'email' : 'mobile_phone_number'}
                        rules={[{ required: true, message: 'Type ID is required' }]}
                      >
                        <Input readOnly />
                      </Form.Item>
                      <Form.Item
                        label="ID"
                        name={[field.name, 'id']}
                        rules={[{ required: true, message: 'ID is required' }]}
                      >
                        <Input />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button type="danger" onClick={() => remove(field.name)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Contact
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Link to="/login" className="m-2">If you have account then login here</Link>
          <button className='btn btn-primary' type='submit'>Register</button>

        </Form>

      </div>

    </>
  )
}

export default Register
