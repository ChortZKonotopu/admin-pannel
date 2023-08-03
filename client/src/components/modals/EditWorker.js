import React, { useState } from 'react'
import plus from '../../utils/plus.svg'
import Axios from 'axios'

import { useStore } from '../../store'
import Alert from './Alert'

export default function EditWorker({ workers, setWorkers, id }) {
    const [modal, setModal] = useState(false)

    const [imie, setImie] = useState("")
    const [nazwisko, setNazwisko] = useState("")
    const [numer, setNumer] = useState("")

    const setAlert = useStore((store) => store.setAlert)


    const toggleModal = () => {
        setModal(!modal)
    }

    const EditWorker = () => {
        Axios.get('http://localhost:4000/findWorker/' + id)
            .then((response) => {
                console.log(response.data)
                setImie(response.data[0].imie)
                setNazwisko(response.data[0].nazwisko)
                setNumer(response.data[0].numer)
            })
    }
    const ChangeWorker = () => { 
        Axios.put('http://localhost:4000/updateWorker', { newImie: imie, newNazwisko: nazwisko, newNumer: numer, id: id })
            .then(() => {
                // setFriends(friends.map((val) => { return val._id == id ? { _id: id, name: newName, age: newAge } : val })
                setWorkers(workers.map((worker) => { return worker._id == id ? { _id: id, imie: imie, nazwisko: nazwisko, numer: numer } : worker}))
                setAlert("green",'Zostal obnowiony')
            })
            .catch((err) => {
                setAlert("red", err)
        })
    }
    return (
        <>
            <Alert/>
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
                        <input value={imie} onChange={(e) => { setImie(e.target.value) }} className='w-[460px]' type="text" placeholder='Imie' />
                        <input value={nazwisko} onChange={(e) => { setNazwisko(e.target.value) }} className='w-[460px]' type="text" placeholder='Nazwisko' />
                        <input value={numer} onChange={(e) => { setNumer(e.target.value) }} className='w-[460px]' type="text" placeholder='Numer telefonu' />
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
