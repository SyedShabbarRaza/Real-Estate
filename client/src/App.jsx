import { useState } from 'react'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import Home from './pages/home.jsx';
import SignUp from './pages/signUp.jsx';
import Profile from './pages/profile.jsx';
import About from './pages/about.jsx';
import Header from './components/header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/updateListing.jsx';
import Listing from './pages/Listing.jsx';
import Search from './pages/Search.jsx';
function App() {

  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-up" element={<SignUp />}/>
    <Route path="search" element={<Search />}/>

    <Route path="/listing/:listingId" element={<Listing />}/>



    <Route element={<PrivateRoute/>}>
    <Route path="/profile" element={<Profile />}/>
    <Route path="/create-listing" element={<CreateListing />}/>

    <Route path="/update-listing/:listingId" element={<UpdateListing />}/>
    </Route>
    <Route path="/about" element={<About />}/>
  </Routes>
  </BrowserRouter>
}

export default App
