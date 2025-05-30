import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";

function UpdateListing() {
  const [files, setFiles] = useState([]);
  const params=useParams();
  const [uploading, setUploading] = useState(false);
  const navigate=useNavigate();
  const {currentUser}=useSelector(state=>state.user)
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(false);
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  useEffect(()=>{
    const fetchListing=async()=>{
        const listingId=params.listingId;
        const res=await fetch(`${API_BASE}/api/listing/get/${listingId}`);
        const data=await res.json();
        if(data.success===false){
            console.log('error');
            return;
        }
        setFormData(data);
    }
    fetchListing();
  },[]);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
      } else {
      setUploading(false);
      setImageUploadError("you can only upload 6 images maximum");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

 const handleRemoveImage=(index)=>{
setFormData({
  ...formData,
  imageUrls:formData.imageUrls.filter((_,i)=>i!==index)
})
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();

    try{
      if(formData.imageUrls.length<1)return setError('You must upload at least one image');
      if(+formData.regularPrice<+formData.discountPrice)return setError('discounted price should less than Regular price');
      setLoading(true);
      setError(false);

      const res=await fetch(`${API_BASE}/api/listing/update/${params.listingId}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id,
        }),
      });
      const data=await res.json();
      console.log(`response:${data}`)
      setLoading(false)
      if(data.success===false){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    }catch(error){
      console.log('error',error);
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>

      <form  onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg "
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />

            <input
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg "
              id="description"
              maxLength="162"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.description}
            />

            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg "
              id="address"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" 
              onChange={handleChange}
              checked={formData.type==='sale'}
              className="w-5" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" 
              onChange={handleChange}
              checked={formData.type==='rent'}
              
              className="w-5" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking"
              onChange={handleChange}
              checked={formData.parking}
              
              className="w-5" />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished"
              onChange={handleChange}
              checked={formData.furnished}
              className="w-5" />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" 
              onChange={handleChange}
              checked={formData.offer}
              
              className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}                
                
                className="border rounded-lg border-gray-300 p-3"
                />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border rounded-lg border-gray-300 p-3"
                onChange={handleChange}
                value={formData.bathrooms}
                />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="border rounded-lg border-gray-300 p-3"
                onChange={handleChange}
                value={formData.regularPrice}
                />
              <div className="">
                <p>Regular price</p>
                {
                  formData.type==='rent' ?<span className="text-xs">$ / month</span>:''
                }
              </div>
            </div>
            {
              formData.offer && (
                <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="border rounded-lg border-gray-300 p-3"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="">
                  <p>Discounted Price</p>
                  {
                  formData.type==='rent' ?<span className="text-xs">$ / month</span>:''
                }
                </div>
              </div>
              )
            }

          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-grey-300 rounded w-full cursor-pointer"
              type="file"
              accept="image/*"
              multiple
              id="images"
            />
            <button
            disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer"
            >
           {uploading?'Uploading...':'Upload'}   
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
  formData.imageUrls.map((url, index) => (
    <div key={url} className="flex justify-between">
      <img
        src={url}
        alt="listing"
        className="w-30 h-30 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => handleRemoveImage(index)}
        className="text-red-700 hover:opacity-95 uppercase cursor-pointer p-3"
      >
        Delete
      </button>
    </div>
  ))}

          <button disabled={loading||uploading}
            className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 uppercase cursor-pointer"
          >
            {loading?'Updating...':'Update Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
}

export default UpdateListing;
