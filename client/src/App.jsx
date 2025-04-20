import { useState } from 'react'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import Home from './pages/home.jsx';
import SignUp from './pages/signUp.jsx';
import Profile from './pages/profile.jsx';
import About from './pages/about.jsx';
import Header from './components/header.jsx';
function App() {

  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="sign-in" element={<SignIn/>}/>
    <Route path="sign-Up" element={<SignUp />}/>
    <Route path="profile" element={<Profile />}/>
    <Route path="/about" element={<About />}/>
  </Routes>
  </BrowserRouter>
}

export default App
