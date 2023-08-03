import {useEffect, useState} from 'react'
import { useStore } from '../store.js'
import { useNavigate, Link } from 'react-router-dom'
import plus from '../utils/plus.svg'
import Axios from 'axios'


export default function Main() {
  const [placowka, setPlacowka] = useState("")
  const [workplaces, setWorkplaces] = useState([])



    const isLoggedIn = useStore((store) => store.header)
    let navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            return navigate('/')
      }

      

      Axios.get('http://localhost:4000/workplaces')
        .then((response) => {
          setWorkplaces(response.data)
          console.log(response.data)
          setPlacowka(response.data[0].name)
      }).catch((err) => {
        console.log(err)
      })

    }, [])

  return (
    <div className='container h-[80vh] flex flex-col gap-4 items-center justify-center'>
      <div className="">
        <select id="cars" value={placowka} onChange={e => { setPlacowka(e.target.value)}} name="cars" placeholder='sdfd' className='w-[330px] text-center'>
          {workplaces.map((workplace, key) => (
            <option key={key} value={workplace.name}>{workplace.name}</option>
          ))}
        </select>
      </div>
      <Link to={`/grafik/${placowka}`} className='button-primary rounded-xl hover:text-white hover:opacity-80 transition hover:no-underline'>Zobacz grafik</Link>
      <Link to="/createGrafik" className='button-add px-[50px] rounded-xl hover:opacity-80 transition hover:no-underline'>
        <img src={plus} alt=""/>
        <p>Dodaj nowy grafik</p>
      </Link>
      </div>
  )
}
