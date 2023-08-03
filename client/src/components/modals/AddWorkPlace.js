import React, { useState } from 'react'
import plus from '../../utils/plus.svg'
import Axios from 'axios'

import { useStore } from '../../store'
import Alert from './Alert'

export default function AddWorker({ workplaces, setWorkplaces}) {
    const [modal, setModal] = useState(false)

    const [name, setName] = useState("")
    const [adress, setAdress] = useState("")
    const setAlert = useStore((store) => store.setAlert)

    const toggleModal = () => {
        setModal(!modal)
    }

    const addWorkPlace = () => {
        Axios.put('http://localhost:4000/addworkPlace', {
            name: name,
            adress: adress,
        })
        .then((response) => {
            console.log(response.data);
            setAlert("green", 'Placowka dobawiona')
            setName("")
            setAdress("")
                setWorkplaces([...workplaces, { name: name, adress: adress, _id: response.data._id }])
            })
            .catch((error) => {
                setAlert("red", 'Sprawdź poprawność wypełnionej formy.')
                console.error(error);
            });
    }

    return (
        <>
            <Alert/>
            <button className='basis-3/12 button-add ' onClick={toggleModal}>
                <img src={plus} alt="add" />
                <p>Dobawic placowke</p>
            </button>

            {modal && (
                <div className="w-[100vw] h-[100vh] top-0 left-0 fixed z-10">
                    <div className="w-[100vw] h-[100vh] top-0 left-0 fixed bg-black opacity-50 z-10" onClick={toggleModal}>
                    </div>
                    <div className="rounded-2xl flex flex-col gap-[50px] py-[60px] px-[28px] items-center z-10 bg-white absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <h2 className='font-bold text-2xl'>Dodaj placowke</h2>
                        <input onChange={(e) => { setName(e.target.value) }} className='w-[460px]' type="text" placeholder='Nazwa' />
                        <input onChange={(e) => { setAdress(e.target.value) }} className='w-[460px]' type="text" placeholder='Adres' />
                        <button onClick={() => {
                            addWorkPlace()
                            toggleModal()
                        }} className='button-primary'>Dodać</button>
                    </div>
                </div>
            )}
        </>
    )
}