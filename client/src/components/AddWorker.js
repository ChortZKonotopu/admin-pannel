import { useState } from 'react'
import Axios from 'axios';

const AddWorker = ({ setLeavePage, grafikData, setGrafikData }) => {
    const [toggle, setToggle] = useState(false)
    const [workers, setWorkers] = useState([])
    const [find, setFind] = useState("")

    const handleModal = () => {
        setToggle(true)

        Axios.get('https://admin-pannel-azms.onrender.com/workers')
            .then((response) => {
                const workersData = response.data
                // Create a new array instead of modifying the existing one
                const updatedWorkers = workersData.filter(worker => {
                    return !grafikData.some(el => el.nameOfWorker === `${worker.imie} ${worker.nazwisko}`);
                });

                setWorkers(updatedWorkers);
                console.log(updatedWorkers);

                // setWorkers(response.data)
            }).catch((err) => {
                console.log(err)
            })
        
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
                    const workersData = response.data
                    // Create a new array instead of modifying the existing one
                    const updatedWorkers = workersData.filter(worker => {
                        return !grafikData.some(el => el.nameOfWorker === `${worker.imie} ${worker.nazwisko}`);
                    });
                    setWorkers(updatedWorkers);
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
    
    const handleAdding = (index, nameOfWorker, id) => {

        const workingHours = Array(31).fill("-");

        const newWorker = { nameOfWorker: nameOfWorker, workingHours: workingHours, _id: id }
        console.log(newWorker)

        setGrafikData(prev => [...prev, newWorker])

        setToggle(false)
        setLeavePage(true)
    }

    const toggleModal = () => {
        setToggle(false)
    }

    return ( 
    <>
    <button className='button-primary rounded-xl cursor-pointer ml-4' onClick={handleModal}>
          Dodać pracownika
    </button>
            {toggle && (
                <div className="w-[100vw] h-[100vh] top-0 left-0 fixed z-10">
                    <div className="w-[100vw] h-[100vh] top-0 left-0 fixed bg-black opacity-50 z-10" onClick={toggleModal}>
                    </div>
                    <div className="rounded-2xl flex flex-col gap-[50px] py-[60px] px-[28px] items-center z-10 bg-white absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <input value={find} onChange={e => setFind(e.target.value)} type="text" placeholder='Wyszukaj pracownika' />
                        <button className='button-primary m-0' onClick={findWorkers}>Szukaj</button>

                        <div className="flex flex-col gap-2 max-h-[200px] overflow-auto">
                            {workers.map((worker, key) => (
                                <div key={key} className="w-[300px] rounded-xl py-4 transition cursor-pointer hover:bg-green">
                                    <p className='block' onClick={() => handleAdding(key, `${worker.imie} ${worker.nazwisko}`, worker._id)}>
                                        {worker.imie} {worker.nazwisko}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
        )}
    </>
  )
}

export default AddWorker
