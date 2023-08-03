import React, { useEffect, useState } from 'react'
import { useStore } from '../store.js'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Alert from '../components/modals/Alert.js'

export default function LogIn() {
    const setIsHeader = useStore((store) => store.displayHeader)
    const setAlert= useStore((store)=> store.setAlert)


    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate();

    const loginIn = () => {
        Axios.post("http://localhost:4000/login", { username: login, password: password })
            .then((res) => {
                setIsHeader(true) 
                return navigate('/main')
            })
            .catch((err) => {
                setAlert("red", "Błędne dane uwierzytelniające")
            })

    }

    useEffect(() => {
        setIsHeader(false)
    },[])

    return (
        <div className="bglogin">
            <Alert message="Błędne dane uwierzytelniające" color="red" />
        <div className=' flex justify-center items-center h-full'>
            <div className="bg-white flex flex-col max-w-[530px] rounded-xl p-[57px] items-center">
                    <h2 className='text-3xl font-bold'>Zaloguj sie</h2>
                    <input className='mt-[75px] w-full block' onChange={(e) => { setLogin(e.target.value) }} value={login} type="text" placeholder='Użytkownik'/>
                    <input className='mt-[20px] w-full block' onChange={(e) => { setPassword(e.target.value) }} value={password} type="text" placeholder='Hasło' />
                    <button className='mt-[91px] bg-orange block button-primary' onClick={loginIn}>Zaloguj sie</button>
            </div>
        </div>
    </div>
  )
}