import React, { useState, useEffect } from 'react';
import UserPicker from './UserPicker'
import fb from '../../fb'

const defaults = [
    { email: "joe@joe.com", password: "joejoe" },
    { email: "ann@ann.com", password: "annann" },
    { email: "admin@admin.com", password: "adminadmin" },
    { email: "gehad@gehad.com", password: "gehadgehad" },
    { email: "jimmy@jimmy.com", password: "jimmyjimmy" },
    { email: "fred@fred.com", password: "fredfred" },
    { email: "raul@raul.com", password: "raulraul" }
]

export default function LoginPicker({ setEmail, setPassword, setUid }) {

    const findAuthUser = fb.functions().httpsCallable('findAuthUser');
    const [user, setUser] = useState(null)

    const handleUser = async user => {
        if (user) {
            const { email, uid } = (await findAuthUser(user.id)).data

            if (setEmail){
                setEmail(email)
            }
            if (setPassword){
                setPassword(defaults.find(user => user.email === email).password)
            }
        }
    }
    
    useEffect(() => {
        handleUser(user)

        // return () => {
        //     setUser(null)
        //     if(setEmail){
        //         setEmail(null)
        //         setPassword(null)
        //     }
        //     setUid(null)
        //   };
    }, [user])

    return ( 
        <UserPicker setUID={setUid} set={setUser} />
    )
}