import Axios from 'axios';
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import {useNavigate} from 'react-router-dom'
import { useStore } from '../store';
import Alert from '../components/modals/Alert';

export default function CreateGrafik() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [stringDate, setStringDate] = useState(formatDateToMMYYYY(new Date()))
  const [placowkaForm, setPlacowkaForm] = useState("")
  const [workplaces, setWorkplaces] = useState([])
  const [workers, setWorkers] = useState([])
  const [checkedWorkers, setCheckedWorkers] = useState([]);

  const navigate = useNavigate();

  const setDate = useStore((store) => store.setDate)
  const date = useStore((store) => store.date)
  const setAlert = useStore((store) => store.setAlert)
  const isLoggedIn = useStore((store) => store.header)

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate('/')
    }
  },[])


  useEffect(() => {
    // set list of work places
    Axios.get('http://localhost:4000/workplaces')
      .then((response) => {
        setWorkplaces(response.data)
      }).catch((err) => {
        console.log(err)
      })
    Axios.get('http://localhost:4000/workers')
      .then((response) => {
        setWorkers(response.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [])



  function formatDateToMMYYYY(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (add 1 as months are zero-based) and pad with leading zero if needed
    const year = String(date.getFullYear()); // Get the full year as a string

    const val = `${month}/${year}`;
    return val;
  }

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      setStringDate(formatDateToMMYYYY(date));
      console.log(stringDate)
    } else {
      setStringDate(''); // Set stringDate to empty string when the date is cleared
    }
  };

  const handleCheckboxChange = (worker) => {
    if (checkedWorkers.includes(worker)) {
      setCheckedWorkers(checkedWorkers.filter((w) => w !== worker));
    } else {
      setCheckedWorkers([...checkedWorkers, worker]);
      console.log(checkedWorkers)
    }
  };

  const createGrafik = () => {
    const grafik = createGrafikArray();
    console.log("dfsd")
    const grafikOpcji = [{ name: 'Opcji:', value: 'Godziny:' }]

    const data = {
      placowka: placowkaForm,
      date: stringDate,
      grafikOpcji: grafikOpcji,
      grafik: grafik,
    }


    Axios.post('http://localhost:4000/enter-grafik', data)
      .then(() => {
        //select date for setting it in grafik component
        setDate(true, selectedDate)
        console.log(date)
        navigate(`/grafik/${placowkaForm}`)
      }).catch((err) => {
        console.log(err)
        setAlert('red', 'Sprawdź poprawność wypełnionej formy. Lub ten grafik może już istnieć.')
      })
  }


  function createGrafikArray() {
      return checkedWorkers.map((name) => {
        return {
          nameOfWorker: name,
          workingHours: Array(31).fill("-")
        };
      });
      

      
    }
  
    return (
      <div className='flex gap-4'>
          <Alert/>
        <div className=" basis-1/3 w-full ">
          <p className='text-blue text-2xl mb-6 text-center font-bold w-full bg-white py-4 rounded-xl'>Wybierz pracowników: </p>
          <div className="bg-white p-6 rounded-xl max-h-[70vh] scroll-container">
            {workers.map((worker, key) => (
              <div key={key} className="flex items-center mb-3">
                <input
                  name="check"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(`${worker.imie} ${worker.nazwisko}`)}
                  checked={checkedWorkers.includes(`${worker.imie} ${worker.nazwisko}`)} />
            
                <label value={`${worker.imie} ${worker.nazwisko}`} className='text-2xl text-blue block' htmlFor="check">{worker.imie} {worker.nazwisko}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="basis-1/3 w-full max-h-[70vh]">
          <p className='text-blue text-2xl mb-6 text-center font-bold w-full bg-white py-4 rounded-xl'>Wybierz placówkę: </p>
          <select className="w-full text-2xl" required value={placowkaForm} onChange={e => {
            setPlacowkaForm(e.target.value)
            console.log(placowkaForm)
          }} placeholder='sdfd'>
            <option selected className='text-center text-gray-400' value="nie wybrales placowki przy tworzeniu" >Wybierz placówkę</option>
            {workplaces.map((workplace, key) => (
              <option className='text-center' key={key} value={workplace.name}>{workplace.name}</option>
            ))}
          </select>
        </div>
        <div className="basis-1/3 w-full flex flex-col justify-between items-center">
          <div className="">
            <p className='text-blue text-2xl mb-6 text-center font-bold w-full bg-white py-4 rounded-xl'>Wybierz datę: </p>
            <DatePicker
              className='text-center text-2xl'
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="MM/YYYY"
              isClearable
            />
          </div>
          <button onClick={createGrafik} className='button-primary w-full py-6 text-2xl'>Stworzyć</button>
        </div>
      </div>
    )
  }
