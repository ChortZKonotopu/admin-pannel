import React, { useState } from 'react'
import plus from '../../utils/plus.svg'
import Axios from 'axios'

import { useStore } from '../../store'
import Alert from './Alert'

export default function AddWorker({workers, setWorkers}) {
    const [modal, setModal] = useState(false)

    const [imie, setImie] = useState("")
    const [nazwisko, setNazwisko] = useState("")
    const [numer, setNumer] = useState("")
    const setAlert = useStore((store) => store.setAlert)

    const toggleModal = () => {
        setModal(!modal)
    }

    const addWorker = () => {
        Axios.put('http://localhost:4000/addworker', {
            imie: imie,
            nazwisko: nazwisko,
            numer: numer,
        }).then((response) => {
                console.log(response.data);
                setAlert("green", 'Pracownik dobawiony')
                setNazwisko("")
                setNumer("")
                setImie("")
                setWorkers([...workers, {imie: imie, nazwisko: nazwisko, numer: numer, _id: response.data._id }])
        }).catch((error) => {
            setAlert("red", 'Sprawdz poprawnosc wypewnionej formy!')
            console.error(error);
        });
    }

    return (
        <>
            <Alert />
            <button className='basis-3/12 button-add ' onClick={toggleModal}>
                <img src={plus} alt="add" />
                <p>Dobawic pracownika</p>
            </button>
            
            {modal && (
                <div className="w-[100vw] h-[100vh] top-0 left-0 fixed z-10">
                    <div className="w-[100vw] h-[100vh] top-0 left-0 fixed bg-black opacity-50 z-10" onClick={toggleModal}>
                    </div>
                    <div className="rounded-2xl flex flex-col gap-[50px] py-[60px] px-[28px] items-center z-10 bg-white absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <h2 className='font-bold text-2xl'>Dodaj pracownika</h2>
                        <input onChange={(e)=> {setImie(e.target.value)}} className='w-[460px]' type="text"  placeholder='Imie'/>
                        <input onChange={(e) => { setNazwisko(e.target.value) }} className='w-[460px]' type="text" placeholder='Nazwisko' />
                        <input onChange={(e) => { setNumer(e.target.value) }} className='w-[460px]' type="text" placeholder='Numer telefonu' />
                        <button onClick={() => {
                            addWorker()
                            toggleModal()
                        }} className='button-primary'>Dodać</button>
                    </div>
                </div>
            )}
    </>
  )
}
