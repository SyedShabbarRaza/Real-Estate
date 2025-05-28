import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth.jsx'

function SignUp() {

const [formData,setFormData]=useState({});
const [error,setError]=useState(null);
const [isLoading,setisLoading]=useState(false);
const navigate=useNavigate();
  const handleChange=(e)=>{
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value,
      }
    );
}

const handleSubmit=async(e)=>{
  e.preventDefault();
try{
  setisLoading(true);
  const res=await fetch('/api/auth/signup',
    {
      method:'POST',
      headers:{
        'content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }
  );
 const data= await res.json();
  console.log('Response:',data);
  if(data.success===false){
    setisLoading(false);
    setError(data.message);
    return;
  }
  setisLoading(false);
  setError(null);
  navigate('/sign-in');
}catch(error){
  setisLoading(false);
  setError(error.message);


}

}

  return (
  <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>
      SignUp
    </h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="userName" placeholder='userName' className='border p-3 rounded-lg' id='userName' onChange={handleChange}/>
      <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
      <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
    <button disabled={isLoading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer'>
      {isLoading?'Loading...':'Sign up'}
    </button>
    <OAuth/>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Have an account?</p>
      <Link to={"/sign-in"}> 
      <span className='text-blue-700'>Sign in</span>
      </Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
  </div>
  )
}

export default SignUp