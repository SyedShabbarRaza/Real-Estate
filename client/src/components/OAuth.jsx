import {getAuth, GoogleAuthProvider, signInWithPopup} from '@firebase/auth'
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
function OAuth() {
  const dispatch=useDispatch();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate=useNavigate();
    const handleGoogleClick=async ()=>{
        try{
            const provider=new GoogleAuthProvider();

            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider);
            console.log("google ka response:",result);

            const res=await fetch(`/api/auth/google`,{
              method:'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL,
              }),
            });
            const data=await res.json();
            console.log("BackEnd ka response:",data);
            dispatch(signInSuccess(data));
            navigate('/');
        }catch(error){
            console.log(error)
        }
    }


  return (
    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer' type='button' onClick={handleGoogleClick}>
    Continue with google
    </button>
  )
}

export default OAuth