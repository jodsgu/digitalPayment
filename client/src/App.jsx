import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import ProtectedRoutes from './components/ProtectedRoutes'
import PublicRoutes from './components/PublicRoutes'



function App() {


  return (
    <>
     <BrowserRouter>
      <Routes>
          <Route path="/" element={
          <ProtectedRoutes>
           <Home/>
          </ProtectedRoutes>
          }></Route>
          <Route path="/profile" element={
          <ProtectedRoutes>
            <Profile/>
          </ProtectedRoutes>
          }></Route>

          <Route path="/login" element={
          <PublicRoutes>
             <Login/>
          </PublicRoutes>
          }></Route>
          <Route path="/register" element={
          <PublicRoutes>
            <Register/>
          </PublicRoutes>
          }></Route>
         
      </Routes>
     
     
     </BrowserRouter>
    </>
  )
}

export default App
