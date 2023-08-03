import React, { useState } from 'react'
import Axios from 'axios'

import { useStore } from '../../store'
import Alert from './Alert'

export default function EditWorker({ workplaces, setWorkplaces, id }) {
    const [modal, setModal] = useState(false)

    const [name, setName] = useState("")
    const [adress, setAdress] = useState("")
    const setAlert = useStore((store) => store.setAlert)

    const toggleModal = () => {
        setModal(!modal)
    }

    const EditWorker = () => {
        Axios.get('http://localhost:4000/findWorPlaces/' + id)
            .then((response) => {
                console.log(response.data)
                setName(response.data[0].name)
                setAdress(response.data[0].adress)
            })
    }
    const ChangeWorker = () => { 
        Axios.put('http://localhost:4000/updateWorkPlace', { newName: name, newAdress: adress, id: id })
            .then(() => {
                // setFriends(friends.map((val) => { return val._id == id ? { _id: id, name: newName, age: newAge } : val })
                setWorkplaces(workplaces.map((worker) => { return worker._id == id ? { _id: id, name: name, adress: adress } : worker}))
                setAlert("green", "zostal obnowiony")
            })
            .catch((err) => {
                setAlert("red", err)
        })
    }
    return (
        <>
            <Alert />
            <button className='button-secondary bg-green' onClick={() => {
                EditWorker()
                toggleModal()
            }}>
                Edytować
            </button>

            {modal && (
                <div className="w-[100vw] h-[100vh] top-0 left-0 fixed z-10">
                    <div className="w-[100vw] h-[100vh] top-0 left-0 fixed bg-black opacity-50 z-10" onClick={toggleModal}>
                    </div>
                    <div className="rounded-2xl flex flex-col gap-[50px] py-[60px] px-[28px] items-center z-10 bg-white absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <h2 className='font-bold text-2xl'>Edytuj pracownika</h2>
                        <input value={name} onChange={(e) => { setName(e.target.value) }} className='w-[460px]' type="text" placeholder='name' />
                        <input value={adress} onChange={(e) => { setAdress(e.target.value) }} className='w-[460px]' type="text" placeholder='adress' />
                        <button onClick={() => {
                            ChangeWorker()
                            toggleModal()
                        }} className='button-primary'>Edytować</button>
                    </div>
                </div>
            )}
        </>
    )
}
