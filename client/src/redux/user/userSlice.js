import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false,
};

const userSlice=createSlice(
    {
        name:'user',
        initialState,
        reducers:{
            signInStart:(state)=>{
                state.loading=true;
            },
            signInSuccess:(state,action)=>{
                state.currentUser=action.payload;
                state.loading=false;
                state.error=null;
            },
            signInFailure:(state,action)=>{
                state.error=action.payload;
                state.loading=false;

            },
            updateUserStart:(state)=>{
                state.loading=true;
            },
            updateUserSuccess:(state,action)=>{
                state.currentUser=action.payload;
                state.loading=false;
                state.error=false;
            },
            updateUserFailure:(state,action)=>{
                state.error=action.payload;
                state.loading=false;
            },
            deleteUserStart:(state)=>{
                state.loading=true;
            },
            deleteUserSuccess:(state,action)=>{
                state.currentUser=null;
                state.loading=false;
                state.error=false;
            },
            deleteUserFailure:(state,action)=>{
                state.error=action.payload;
                state.loading=false;
            },
            signOutUserStart:(state)=>{
                state.loading=true;
            },
            signOutUserSuccess:(state,action)=>{
                state.currentUser=null;
                state.loading=false;
                state.error=false;
            },
            signOutUserFailure:(state,action)=>{
                state.error=action.payload;
                state.loading=false;
            }
        }
    }
);
export const {signInSuccess,signInStart,signInFailure,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserFailure,signOutUserStart,signOutUserSuccess}=userSlice.actions;

export default userSlice.reducer;
