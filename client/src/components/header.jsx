import { FaSearch } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate=useNavigate();
  const [searchTerm,setSearchTerm]=useState('');

  const handleSubmit=(e)=>{
    e.preventDefault();

    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);
    try{

    }catch(error){

    }
  }

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between max-w-6xl mx-auto p-3 items-center">
        <Link to="/">
          <h1 className="font-bold text-sm flex flex-wrap sm:text-xl">
            <span className="text-slate-500"> Raza</span>
            <span className="text-slate-700"> Estate</span>
          </h1>
        </Link>

        {/* SearchBar here */}
        <form 
        onSubmit={handleSubmit}
        className="bg-slate-100 rounded-lg p-1 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600 cursor-pointer hover:text-slate-400"></FaSearch>
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline hover:underline text-slate-700">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline hover:underline text-slate-700">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-8 w-8 object-cover" src={currentUser.avatar} alt="profile" />
            ) : (
              <li className="text-slate-700 hover:underline">SignIn</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
