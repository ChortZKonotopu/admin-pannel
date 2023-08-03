import React, { useEffect, useState } from 'react'
import AddWorker from '../components/modals/AddWorker'
import Axios from 'axios'
import EditWorker from '../components/modals/EditWorker'
import { useStore } from '../store.js'
import Alert from '../components/modals/Alert.js'
import { useNavigate } from 'react-router-dom'




export default function Pracowniki() {

  const [workers, setWorkers] = useState([])
  const [find, setFind] = useState("")

  const setAlert = useStore((store) => store.setAlert)
  const isLoggedIn = useStore((store) => store.header)
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate('/')
    }
  }, [])

  useEffect(() => {
    Axios.get('http://localhost:4000/workers')
      .then((response) => {
        setWorkers(response.data)
        console.log(response.data)
      }).catch((err) => {
      console.log(err)
    })
  }, [])
  
  const deletePracownik = (id) => {
    console.log(id)
    Axios.delete('http://localhost:4000/deleteWorker/'+id)
      .then(() => {
        setAlert("green", "Pracownik usunienty!")
        const newWorkers = workers.filter(worker => worker._id !== id)
        setWorkers(newWorkers)
      })
  }

  const findWorkers = () => {
    if (find !== '') {
      Axios.get('http://localhost:4000/findWorker/' + find)
      .then((response) => {
        console.log(response.data)
        setWorkers(response.data)
      })
    } else {
      Axios.get('http://localhost:4000/workers')
        .then((response) => {
          setWorkers(response.data)
          console.log(response.data)
        }).catch((err) => {
          console.log(err)
        })
    }
  }
  
  return (
    <div className='container'>
      <Alert/>
      <div className="flex gap-3">
        <input value={find} onChange={e=>setFind(e.target.value)} className="basis-6/12"type="text" placeholder='Wyszukaj pracownika'/>
        <button className='basis-3/12 button-primary' onClick={findWorkers}>Szukaj</button>
        {/* <button className='basis-3/12 button-add '>
          <img src={plus} alt="add" />
          <p>Dobawic pracownika</p>
        </button> */}
        <AddWorker workers={workers} setWorkers={setWorkers} />
      </div>
      <div className="mt-4 rounded-xl max-h-[70vh] overflow-y-auto scroll-container">
      <table>
        <tr>
          <th className='w-[25%]'>
            Imię 
          </th>
          <th className='w-[25%]'>
            Nazwisko
          </th>
          <th className='w-[25%]'>
            Numer telefonu
          </th>
          <th className='w-[25%]'>
            Działania
          </th>
        </tr>
          <tbody>
            {workers.map((worker) => (
              <tr>
                <td>{ worker.imie }</td>
                <td>{worker.nazwisko}</td>
                <td>{worker.numer}</td>
                <td className=' flex justify-around'>
                  <EditWorker workers={workers} setWorkers={setWorkers} id={worker._id} />
                  <button onClick={() => deletePracownik(worker._id)} className='button-secondary bg-red'>Usunąć</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
