import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneNumbers from '../components/PhoneNumbers';
import DeleteGrafik from '../components/modals/DeleteGrafik';
import { useStore } from '../store';
import Alert from '../components/modals/Alert';

export default function Grafik() {
    const { placowka } = useParams()
    const [placowkaForm, setPlacowkaForm] = useState(placowka)
    const [workplaces, setWorkplaces] = useState([])
    const [selectedDate, setSelectedDate] = useState(null);
    const [stringDate, setStringDate] = useState("")
    const [grafikData, setGrafikData] = useState([])
    const [grafikOpcji, setGrafikOpcji] = useState({})
    const [leavePage, setLeavePage] = useState(false)


    const [newOptionName, setNewOptionName] = useState("")
    const [newOptionHour, setNewOptionHour] = useState("")

    const [isReload,setIsReload] = useState(false);

    const navigate = useNavigate()

    const date = useStore((store) => store.date)
    const setDate = useStore((store) => store.setDate)

    const setAlert = useStore((store) => store.setAlert)
    const numbers = Array.from({ length: 31 }, (_, index) => index + 1);
    const isLoggedIn = useStore((store) => store.header)

    function formatDateToMMYYYY(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (add 1 as months are zero-based) and pad with leading zero if needed
        const year = String(date.getFullYear()); // Get the full year as a string

        const val = `${month}/${year}`;
        return val;
    }

    useEffect(() => {
        if (!isLoggedIn) {
            console.log('1')
            return navigate('/')
        }
        
        function setTheDate() {
            console.log(date)
            if (date.isDate) {

                setSelectedDate(date.dateIs)
                setDate(false, new Date())
                setCurrentGrafikData(stringDate)

            } else {
                setSelectedDate(new Date())
            }
        }

        setStringDate(formatDateToMMYYYY(new Date()))
        // setSelectedDate(new Date());
        setTheDate()

        // set list of work places
        Axios.get('http://localhost:4000/workplaces')
            .then((response) => {
                setWorkplaces(response.data)

            }).catch((err) => {
                console.log(err)
            })
    },[])

    useEffect(() => {
        // Whenever stringDate changes, fetch Grafik data again
        if (stringDate) {
            setCurrentGrafikData(stringDate);
        }
    }, [stringDate]);

    const setCurrentGrafikData = (stringDate) => {
        //get current grafik data
        Axios.get(`http://localhost:4000/find-grafik`, {
            params: {
                placowka: placowka,
                date: stringDate,
            }
        },)
            .then((response) => {
                // console.log(response.data[0])
                setGrafikData(response.data[0]?.grafik || []); // Use the optional chaining operator to handle empty response
                setGrafikOpcji(response.data[0]?.grafikOpcji || {});
                
            })
            .catch((error) => {
                console.error(error);
                setGrafikData({})
                setGrafikOpcji({})
            });
    }

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
            setStringDate(formatDateToMMYYYY(date));
        } else {
            setStringDate(''); // Set stringDate to empty string when the date is cleared
        }
    };

    const handleHourChange = (workerIndex, dayIndex, value) => {
        setGrafikData((prevData) => {
            setLeavePage(true)

            const newData = { ...prevData };
            newData[workerIndex].workingHours[dayIndex] = value;
            return newData;
        });
    };
    const handleOptionAdding = () => {
        console.log(grafikOpcji)

        const option = newOptionName;
        const hours = newOptionHour;

        const newGrafikOpcji = [...grafikOpcji, {name: option, value:hours } ];

        setGrafikOpcji(newGrafikOpcji);
        setNewOptionHour("")
        setNewOptionName("")

        setAlert("green", "Opcja dobawiona")

        setLeavePage(true)
    };

    const saveGrafik = () => {
        console.log(grafikData);

            // Assuming grafikData is an array of objects where each object contains nameOfWorker and workingHours
            const updatedGrafikData = Object.values(grafikData).map((workerData) => {
                return {
                    nameOfWorker: workerData.nameOfWorker, // Make sure nameOfWorker exists in each workerData object
                    workingHours: workerData.workingHours,
                };
            });

            const updateGrafik = {
                placowka: placowka,
                date: stringDate,
                grafikOpcji: grafikOpcji,
                grafik: updatedGrafikData, // Use the updated data with nameOfWorker included
            };

            Axios.put('http://localhost:4000/update-grafik', updateGrafik)
                .then((res) => {
                    setAlert("green", "Grafik zapisany!")
                    setLeavePage(false)
                    // Handle success or show a success message to the user
                })
                .catch((error) => {
                    console.error(error);
                    // Handle error or show an error message to the user
                });

    };

    useEffect(() => {
        // This code will run whenever placowkaForm changes, but not on initial load
        if (placowkaForm !== '') {
            navigate(`/grafik/${placowkaForm}`);
            if (isReload) {
                window.location.reload()
            }
        }
    }, [placowkaForm]);

    // const changeSelectedPlacowka = (e) => {
    //     setPlacowkaForm(e.target.value)
    //     console.log('im workimng')
    //     navigate(`/grafik/${placowkaForm}`)
    // }

    useEffect(() => {
        const handleBeforeUnload = (event) => {

            if (leavePage) {
                console.log('2')
                event.preventDefault();
                event.returnValue = ''; // This is required for some older browsers
            }
        };

            window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [leavePage]);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const getPageMargins = () => {
        return `@page { margin: 50px 10px 10px 10px !important; }`;
    };

return (
    <div>
        <Alert/>
        <div className="flex gap-3">
            <select required value={placowkaForm} onChange={e => {
                setPlacowkaForm(e.target.value)
                setIsReload(true)
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
            <div className="basis-1/6"></div>
            <button onClick={() => { handlePrint(); }} className='button-secondary bg-[#F4ED4D] basis-1/6'>Wydruk</button>
                <button onClick={saveGrafik} className='button-secondary bg-green basis-1/6'>Zapisz</button>
            <DeleteGrafik placowka={placowkaForm} date={stringDate} />
        </div>
        <div className="" ref={componentRef}>
          <div className="on-print-container mt-4 grafik-container rounded-xl overflow-y-auto scroll-container">
            <table>
                  <tbody>
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
                      {Object.keys(grafikData).length === 0 ? (
                          <tr>
                              <td colSpan="32" className='h-[30vh] text-2xl'>Niema grafiku</td>
                          </tr>
                      ) : (
                          Object.values(grafikData).map((grafik, workerIndex) => (
                              <tr key={workerIndex}>
                                  <td>{grafik.nameOfWorker}</td>
                                  {grafik.workingHours.map((hour, dayIndex) => (
                                      <td key={dayIndex} className='p-0'>
                                          <input
                                              className="uppercase border-none outline-none h-[35px] max-w-[50px] p-0 text-center"
                                              type="text"
                                              value={hour}
                                              maxLength="2"
                                              onChange={(e) =>
                                                  handleHourChange(workerIndex, dayIndex, e.target.value)
                                              }
                                          />
                                      </td>
                                  ))}
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
          <div className="flex gap-4 mt-4">
                <div className=" height-onprint basis-1/4 h-[29vh] rounded-xl overflow-y-auto scroll-container ">
                  <table >
                      <tbody>
                          {Object.keys(grafikOpcji).length === 0 ? (
                              <tr>
                                <td className='h-[30vh] text-xl flex items-center justify-center'>Niema Opcyj</td>
                              </tr>
                          ) : (
                              Object.values(grafikOpcji).map((opcja, key) => (
                                  <tr key={key}>
                                      <td>{opcja.name}</td>
                                      <td>{opcja.value}</td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
              <div className="height-onprint basis-2/4 h-[29vh] rounded-xl overflow-y-auto scroll-container">
                  <PhoneNumbers grafiks={grafikData} />
              </div>
                <div className="disable-on-print basis-1/4 flex flex-col gap-5 bg-white rounded-xl p-4 justify-center items-center">
                  <input value={newOptionName} onChange={e => setNewOptionName(e.target.value)} type="text" placeholder='Nazwa opcji'/>
                  <input value={newOptionHour} onChange={e => setNewOptionHour(e.target.value)} type="text" placeholder='Godziny' />
                  <button onClick={handleOptionAdding} className='button-primary bg-green'>Dodać</button>
                </div>
                <div className="aditional-print-info basis-2/4">
                    <p>Placowka: {placowka}</p>
                    <p>Rok/mies: {stringDate}</p>
                    <p>Telefon calodobowy(patrol CZA-TA): 694 942 500</p>
                    <p>Policja: 997</p>
                    <p>Straz pozarna: 998</p>
                    <p>Pogotowie: 999</p>
                    <p>Telefon Alarmowy: 112</p>



                </div>
        </div>
        </div>
        <style type="text/css" media="print">
            {
            "\
            @page {\ size: landscape;\ }\
            "
            }
        </style>
        <style>{getPageMargins()}</style>
    </div>
)
}
