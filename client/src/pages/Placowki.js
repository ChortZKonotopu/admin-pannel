import React, { useEffect, useState } from 'react'
import AddWorkPlace from '../components/modals/AddWorkPlace'
import Axios from 'axios'
import EditWorkPlace from '../components/modals/EditWorkPlace'
import Alert from '../components/modals/Alert'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'

export default function Placowki() {

  const [workplaces, setWorkplaces] = useState([])
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
    Axios.get('http://localhost:4000/workplaces')
      .then((response) => {
        setWorkplaces(response.data)
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [])

  const deletePlacowka = (id) => {
    console.log(id)
    Axios.delete('http://localhost:4000/deleteWorkplace/' + id)
      .then(() => {
        setAlert("green", "Placowka usunienta!")
        const newworkplaces = workplaces.filter(place => place._id !== id)
        setWorkplaces(newworkplaces)
      })
  }

  const findWorkplaces = () => {
    if (find !== '') {
      Axios.get('http://localhost:4000/findWorPlaces/' + find)
        .then((response) => {
          console.log(response.data)
          setWorkplaces(response.data)
        })
    } else {
      Axios.get('http://localhost:4000/workplaces')
        .then((response) => {
          setWorkplaces(response.data)
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
        <input value={find} onChange={e => setFind(e.target.value)} className="basis-6/12" type="text" placeholder='Wyszukaj placowke' />
        <button className='basis-3/12 button-primary' onClick={findWorkplaces}>Szukaj</button>

        <AddWorkPlace workplaces={workplaces} setWorkplaces={setWorkplaces} />
      </div>
      <div className="mt-4 rounded-xl max-h-[70vh] overflow-y-auto scroll-container">
        <table>
          <tr>
            <th className='w-[33.333%]'>
              Placowka
            </th>
            <th className='w-[33.333%]'>
              Adres Placowki
            </th>
            <th className='w-[33.333%]'>
              Działania
            </th>
          </tr>
          <tbody>
            {workplaces.map((workplace) => (
              <tr>
                <td>{workplace.name}</td>
                <td>{workplace.adress}</td>
                <td className=' flex justify-around'>
                  <EditWorkPlace workplaces={workplaces} setWorkplaces={setWorkplaces} id={workplace._id} />
                  <button onClick={() => deletePlacowka(workplace._id)} className='button-secondary bg-red'>Usunąć</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

