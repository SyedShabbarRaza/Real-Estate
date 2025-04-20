import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between max-w-6xl mx-auto p-3 items-center">
        <Link to='/'><h1 className="font-bold text-sm flex flex-wrap sm:text-xl">
          <span className="text-slate-500"> Raza</span>
          <span className="text-slate-700"> Estate</span>
        </h1></Link>

        {/* SearchBar here */}
        <form className="bg-slate-100 rounded-lg p-1 flex items-center">
         <input type="text" placeholder="Search..." className="focus:outline-none w-24 sm:w-64"/>
         <FaSearch></FaSearch>
        </form>
        
        <ul className='flex gap-4'>
        <Link to='/'><li className='hidden sm:inline hover:underline text-slate-700'>Home</li></Link>

        <Link to='/about'><li className='hidden sm:inline hover:underline text-slate-700'>About</li></Link>

        <Link to='/sign-in'><li className='text-slate-700 hover:underline'>SignIn</li></Link>
        </ul>        
    
      </div>
    </header>
  );
}

export default Header;
