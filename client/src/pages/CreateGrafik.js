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
  const [find, setFind] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate('/')
    }
  },[])


  useEffect(() => {
    // set list of work places
    Axios.get('https://admin-pannel-azms.onrender.com/workplaces')
      .then((response) => {
        setWorkplaces(response.data)
      }).catch((err) => {
        console.log(err)
      })
    Axios.get('https://admin-pannel-azms.onrender.com/workers')
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


    Axios.post('https://admin-pannel-azms.onrender.com/enter-grafik', data)
      .then(() => {
        //select date for setting it in grafik component
        setDate(true, selectedDate)
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
  
  const findWorkers = () => {
    if (find !== '') {
      Axios.get('https://admin-pannel-azms.onrender.com/findWorker/' + find)
        .then((response) => {
          console.log(response.data)
          setWorkers(response.data)
        })
    } else {
      Axios.get('https://admin-pannel-azms.onrender.com/workers')
        .then((response) => {
          setWorkers(response.data)
        }).catch((err) => {
          console.log(err)
        })
    }
  }
  
    return (
      <div className='flex gap-4'>
          <Alert/>
        <div className=" basis-1/3 w-full flex max-h-[80vh] flex-col items-center justify-start gap-4">
          <input value={find} onChange={e => setFind(e.target.value)} type="text" placeholder='Imie lub nazwisko pracownika' className='w-full' />
          <button onClick={findWorkers} className="button-primary w-full">Wyszukaj</button>
          <div className="bg-white p-6 rounded-xl scroll-container w-full h-full">
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
        <div className="basis-1/3 w-full flex max-h-[80vh] flex-col items-center gap-4 justify-start">
          <DatePicker
            className='text-center text-2xl'
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="MM/YYYY"
            isClearable
          />
          <div className="h-[60px] mb-4"></div>
          <div className="bg-white p-6 rounded-xl scroll-container text-center w-full h-full">
            <h2 className='text-blue font-bold text-xl mb-4'>Wybrane pracowniki:</h2>
            {checkedWorkers.map((worker, key) => (
              <div key={key} className="w-full rounded-xl py-3 text-lg transition hover:bg-gray-50">
                <p className='block'>
                  {worker}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="basis-1/3 w-full flex flex-col justify-between items-center">
          <div className="flex flex-col items-center w-full h-[80vh] justify-between">
            <div className="w-full">
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

          <button onClick={createGrafik} className='button-primary w-full py-6 text-2xl'>Stworzyć</button>
          </div>
        </div>
      </div>
    )
  }
