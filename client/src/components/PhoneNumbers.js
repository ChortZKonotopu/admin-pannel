import React, { useEffect, useState } from 'react'
import Axios from 'axios'

export default function PhoneNumbers({ grafiks }) {

    const [names, setNames] = useState([]);
    const [workers, setWorkers] = useState({})

    useEffect(() => {
        if (grafiks) {
            const newNames = Object.values(grafiks).map((grafik) => {
                const fullName = grafik.nameOfWorker;
                const [firstName, lastName] = fullName.split(' ');
                return { firstName, lastName };
            });
            setNames(newNames);
        }
    }, [grafiks]);

    useEffect(() => {
        if (names.length > 0) {
            
            Axios.get('http://localhost:4000/getNumbers', {
                params: {
                    names: names,
                }
            })
            .then((res) => {
                setWorkers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [names]);

    return (
        <div className="basis-1/3 h-[29vh] rounded-xl overflow-y-auto scroll-container">
            <table>
                <tbody>
                    {Object.keys(workers).length === 0 ? (
                        <tr>
                            <td colSpan="2" className='h-[30vh] text-xl'>No workers found</td>
                        </tr>
                    ) : (
                        workers.map((worker, key) => (
                            <tr key={key}>
                                <td>{worker.imie} {worker.nazwisko}</td>
                                <td>{worker.numer}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

