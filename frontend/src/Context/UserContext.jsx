import React, { createContext } from 'react'
import { useState } from 'react'
import { AuthUserContext } from './Authcontext';
import { useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
export const Userdatacontext=createContext()
export default function UserContext({children}) {
    let [userdata,setuserdata]=useState(null)
       const [edit, setedit] = useState(false) 
     const { serveruri } = useContext(AuthUserContext); 
     const [postdata,setpostdata]=useState([])

const getusers=async()=>{
    try {
        let result=await axios.get(`${serveruri}/api/currentuser`,{
            withCredentials:true
        })
        setuserdata(result.data)
    } catch (error) {
        console.log(error)
        setuserdata(null)
    }
}

const posts=async()=>{
    try {
        let result=await axios.get(`${serveruri}/api/posts`,{withCredentials:true})
        setpostdata(result.data)
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
    getusers()
    posts()
},[])


    const value={
        userdata,setuserdata,edit,setedit,postdata,setpostdata
    }
  return (
    <div>
        <Userdatacontext.Provider value={value}> 
     {children}
     </Userdatacontext.Provider>
    </div>
  )
}
