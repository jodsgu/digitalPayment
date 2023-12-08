import React, { useState, useEffect } from 'react'
import { UserMenu, AdminMenu } from '../SidebarMenu/Menu.jsx'
import '../styles/LayoutStyle.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge, message } from 'antd';
import axios from 'axios';
const Layout = ({ children }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [name, setName] = useState("")

  const[userRole,setUserRole] = useState("");

  const location = useLocation();
  const auth = localStorage.getItem('token');

  const user_id = localStorage.getItem('user_id')


  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //fetch login user details
  const getUserDetials = async () => {
    try {
      const parseToken = JSON.parse(auth);
       console.log("fdgsdfgs77",parseToken);
      //const res = await axios.get(`http://localhost:3000/api/v1/users/${user_id}`, {
      const res = await axios.get(`http://localhost:3000/user-details/${user_id}`, {
        headers: {
          Authorization: `Bearer ${parseToken}`
        }
      })
      if (res.data.return_status) {
        setName(res.data.resource.attributes.first_name)
      }
    } catch (error) {
      console.log(error);
    }
  }

  //fetch user role
  const getUserRole = async () => {
    try {
      const parseToken = JSON.parse(auth);
      const action = 'filter';
      //const res = await axios.get(`http://localhost:3000/api/v1/user-role-maps`, {
      const res = await axios.get(`http://localhost:3000/role-maps`, {
        params: {
          action: action,
          'filter-user-id': user_id
        },
        headers: {
          Authorization: `Bearer ${parseToken}`
        }
      });
      if (res.data.return_status) {
        setRole(res.data.resource_list[0].id.role_id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successfully');
    navigate('/login');
  };

  useEffect(() => {
    if (user_id) {
      getUserDetials();
      getUserRole();
    }

  }, [])


  //check navber menu

  useEffect(() => {
    if (role == 1) {
      setUserRole("system");
    } else if (role == 2) {
      setUserRole("superadmin");
    } else if (role == 3) {
      setUserRole("admin");
    } else if (role == 4) {
      setUserRole("staff");
    } else {
      setUserRole("user");
    }
  }, [role]);

  //set sideber menu
  const sideberMenu = userRole && userRole === 'admin' ? AdminMenu : UserMenu;

  return (
    <>

      <div className="main">

        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>Offline Payment</h6>
              <hr />
            </div>
            <div className="menu">
              {
                sideberMenu.map((menu, index) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <div className={`menu-item ${isActive && 'active'}`} key={index}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  );
                })
              }
              {
                auth && auth ? (
                  <div className={`menu-item`} onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <Link to="/login">Logout</Link>
                  </div>
                ) : ""
              }

            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: 'pointer' }}>
                <Badge count="6">
                  <i className="fa-solid fa-bell" style={{ margin: '1px', color:'black' }}></i>
                </Badge>
                <Link to="/profile">{name ? name : "Wellcome"}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>



    </>
  )
}

export default Layout
