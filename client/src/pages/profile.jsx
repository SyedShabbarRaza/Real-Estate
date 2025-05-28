import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [ShowListingError,setShowListingError]=useState(false);
  const [userListings,setUserListings]=useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    console.log("button"),
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData:=>", formData);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log(res);
      const data = await res.json();
      // console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log("catch");
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async (e) => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings=async()=>{
    try{
      setShowListingError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      console.log(data);
      if(data.success===false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    }catch(error){
      setShowListingError(true);
    }
  };

  const handleListingDelete=async(e)=>{
    try{
      // setShowListingError(false);
      const res=await fetch(`/api/listing/delete/${e}`,{
        method:'Delete',
      });
      const data=await res.json();
      if(data.success===false){
        // setShowListingError(true);
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing)=>listing._id!==e));
    }catch(error){
      console.log(error.message);
      // setShowListingError(true);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-2">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center my-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload image must be less than 2 mb
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="userName"
          className="border p-3 rounded-lg "
          defaultValue={currentUser.userName}
          id="userName"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          className=" border p-3 rounded-lg"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.password}
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 uppercase cursor-pointer"
        >
          {loading ? "loading..." : "update"}
        </button>

        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 rounded-lg text-white hover:opacity-95 uppercase cursor-pointer"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated Successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full cursor-pointer">Show Listings</button>
      <p className="text-red-700 mt-5">{ShowListingError?'Error showing listings':''}</p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase cursor-pointer'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button 
                  className='text-green-700 uppercase cursor-pointer'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;

// Firebase Rules
//   match /{allPaths=**} {
//     allow read;
//     allow write:if
//     request.resource.size<2* 1024 *1024 &&
//     request.resource.contentType.matches('images/.*')

//   }
// }
// }
