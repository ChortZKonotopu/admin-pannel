import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import DatePicker from 'react-datepicker';

const BackupGrafik = () => {
  const { backup } = useParams()
  const [placowkaForm, setPlacowkaForm] = useState("")
  const [workplaces, setWorkplaces] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date);
  const [stringDate, setStringDate] = useState(formatDateToMMYYYY(selectedDate))
  const [backupGrafik, setBackupGrafik] = useState([])
  const [backupOptions, setBackupOptions] = useState({})


  const numbers = Array.from({ length: 31 }, (_, index) => index + 1);

  useEffect(() => {
    // set list of work places
    Axios.get(`http://localhost:5000/workplaces?backup=${backup}`)
      .then(response => {
        setWorkplaces(response.data)
        setPlacowkaForm(response.data[0].name)
      })
      .catch(error => {
        console.error('Error:', error.response.data);
      });

    
  }, [])
  
  useEffect(() => {
    if (placowkaForm !== "" && stringDate !== "") {
      
      //get info about backup grafik
      Axios.get('http://localhost:5000/grafik', {
        params: {
          backup: backup,
          placowka: placowkaForm,
          date: stringDate
        }
      })
        .then((res) => {
          setBackupGrafik(res.data[0]?.grafik || [])
          setBackupOptions(res.data[0]?.grafikOpcji || {})
      }).catch(err => {
        console.log(err)
      })
    }
  }, [placowkaForm, stringDate])


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
    } else {
      setStringDate(''); // Set stringDate to empty string when the date is cleared
    }
  };

  return (
    <div>
      <h1 className='text-xl font-bold text-blue'>Kopia bazy danych: {backup}</h1>
      <div className="flex gap-3 mt-6">
        <select required value={placowkaForm} onChange={e => {
          setPlacowkaForm(e.target.value)
        }} name="cars" placeholder='sdfd' className='basis-1/6'>
          {workplaces.map((workplace, key) => (
            <option key={key} value={workplace.name}>{workplace.name}</option>
          ))}
        </select>
        <DatePicker
          className='basis-1/6'
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
          isClearable
        />
      </div>
      <div className="">
        <div className="w-full mt-6 max-h-[35vh] rounded-xl overflow-y-auto scroll-container">
          <table>
            <tr>
              <th className='grafik-pracownik'>
                Pracowniki
              </th>
              {numbers.map((number, key) => (
                <th key={key} className=''>
                  {number}
                </th>
              ))}
            </tr>
            <tbody>
              {Object.keys(backupGrafik).length === 0 ? (
                <tr>
                  <td colSpan="32" className='h-[30vh] text-2xl'>
                    <div className=" flex flex-col justify-center gap-4 items-center">
                      <p className='block'>
                        Niema grafiku
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                  Object.values(backupGrafik).map((grafik, workerIndex) => (
                    <tr key={workerIndex}>
                      <td>{grafik.nameOfWorker}</td>
                      {grafik.workingHours.map((hour, dayIndex) => (
                        <td key={dayIndex} className='px-4 '>
                          {hour}
                        </td>
                      ))}
                    </tr>
                  )
                )
              )}
              </tbody>
          </table>
        </div>
        <div className="mt-6 w-[500px]">
          <div className="h-[29vh] rounded-xl overflow-y-auto scroll-container">
            <table >
              <tbody>
                {Object.keys(backupOptions).length === 0 ? (
                  <tr>
                    <td className='h-[30vh] text-xl flex items-center justify-center'>Niema Opcyj</td>
                  </tr>
                ) : (
                    Object.values(backupOptions).map((opcja, key) => (
                    <tr key={key}>
                      <td>{opcja.name}</td>
                      <td>{opcja.value}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackupGrafik
