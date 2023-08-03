import React, { useState } from 'react'
import Axios from 'axios'
import { useStore } from '../../store'

export default function DeleteGrafik({ placowka, date }) {
    const [module, setModule]=useState(false)

    const setAlert = useStore((store) => store.setAlert)

    const deleteGrafik = () => {
        console.log(placowka, date)
        setModule(true)
        Axios.delete("http://localhost:4000/delete-grafik", {
            data: {
                placowka,
                date,
            },
        }).then(() => {
            window.location.reload()
            setAlert("green", "Usunienty!")
        }).catch(err => {
            setAlert("red", "problem")
            console.error(err)
        })


        setModule(!module)
    }

    const toggleModal= () => {
        setModule(!module)
    }

  return (
    <>
          <button onClick={toggleModal} className='button-secondary bg-red basis-1/6'>Usunąć</button>
          {module && (
              <div className="w-[100vw] h-[100vh] top-0 left-0 fixed z-10">
                  <div className="w-[100vw] h-[100vh] top-0 left-0 fixed bg-black opacity-50 z-10" onClick={toggleModal}>
                  </div>
                  <div className="rounded-2xl flex flex-col gap-[50px] py-[60px] px-[28px] items-center z-10 bg-white absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <h2 className='font-bold text-2xl'>Czy jestes pewna ze chcesz usunac grafik?</h2>
                      <div className="flex gap-4">
                      <button onClick={deleteGrafik} className='button-primary bg-red'>Tak</button>
                          <button onClick={toggleModal} className='button-primary bg-green'>Nie</button>
                      </div>
                  </div>
              </div>
          )}
    </>
  )
}
