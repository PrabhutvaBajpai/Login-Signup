import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Navbar from "./pages/Navbar";
import Register from "./pages/Register" ; 
import ForgotPassword from "./pages/ForgotPassword.jsx" ; 

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
  
        <Route path="/register" element={<Register />}></Route>

        <Route path="/forgotPassword" element={<ForgotPassword/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
