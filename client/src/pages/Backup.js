import {useState, useEffect} from 'react'
import backup from '../utils/backup.svg'
import Axios from 'axios'
import { format } from 'date-fns';
import {useNavigate} from 'react-router-dom' 
import Alert from '../components/modals/Alert'
import {useStore} from '../store'

const Backup = () => {
    const [backups, setBackups] = useState([])
    const navigate = useNavigate()
    const [grafiks, setGrafiks] = useState([])
    const [placowkas, setPlacowkas] = useState([])
    const [stateDate, setStateDate] = useState('')
    const [previousPlacowkas, setPreviousPlacowkas] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const setAlert = useStore((store) => store.setAlert)

    useEffect(() => {
        Axios.get('http://localhost:5000/backup')
            .then((res) => {
                setBackups(res.data)
            }).catch((err) => { console.log(err) })
    },[])

    const createBackup = () => {
        setIsLoading(true)
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

        console.log(formattedDate)
        setStateDate(formattedDate)

        //getting original grafiks and changing them to backup grafiks
        Axios.get('http://localhost:4000/grafikOriginal').then((res) => {
            const backupGrafiks = res.data.map(obj => {

                const { __v, _id, ...rest } = obj;
                return {
                    ...rest,
                    backup: formattedDate,
                };
            })
            setGrafiks(backupGrafiks)
        })
            .catch((err) => {
                setAlert("red", "Problem tworzenia kopii.")

                console.log(err)
            })
    }

    //run code after grafiks is setted
    useEffect(() => {
        if (grafiks.length > 0 && stateDate !== '') {
            //creating backup grafiks
            Axios.post('http://localhost:5000/backupGrafik', { grafiks })
                .then((res) => {
                    console.log('backup grafiks have been created')
                })
                .catch((err) => {
                    setAlert("red", "Problem tworzenia kopii.")
                    console.log(err)
                });

            //getting placowkas and formating it to backup placowkas
            Axios.get('http://localhost:4000/workplaces').then((res) => {
                const backupPlacowkas = res.data.map(obj => {
                    // Create a shallow copy of the object without _v and _id properties
                    const { __v, _id, adress, ...rest } = obj;
                    // Add the backup property
                    return {
                        ...rest,
                        backup: stateDate, // You can change this value to whatever you want
                    };
                })
                setPlacowkas(backupPlacowkas)
            })
        
        }
    }, [grafiks])

    useEffect(() => {
        if (placowkas.length > 0 && stateDate !== '' && placowkas != previousPlacowkas) {
            //adding placowkas backup
            setPreviousPlacowkas(placowkas)
            console.log('placowkas setted: ', placowkas)

                Axios.put('http://localhost:5000/addworkPlace', { placowkas })
                .then((res) => {
                    console.log("placowkas backup have been created")
                })
                    .catch((err) => {
                        setAlert("red", "Problem tworzenia kopii.")

                        console.log(err)
                    });

            //creating backup record
            Axios.post('http://localhost:5000/backup', { backup: stateDate })
                .then((res) => {
                    const updatedBackups = [{backup:stateDate}, ...backups];
                    console.log('creating backup reccord')
                    console.log(updatedBackups)
                    setBackups(updatedBackups)
                })
                .catch((err) => {
                    console.log(err)
                    setAlert("red", "Problem tworzenia kopii.")
                })
            
            console.log("new\n new \n new\n")
            setStateDate('')
            setTimeout(() => {
                setAlert("green", "Kopia stworzona.")
                setIsLoading(false)
            },2000)
        }
    }, [placowkas])
    return (
        <div className='text-center'>
            <Alert/>
            <h1 className='text-4xl text-blue font-bold block mb-[80px]' >Tworzenie i przeglądanie kopii bazy danych</h1>
            <div className="flex justify-around">
                <div className=" bg-blue rounded-xl max-w-[300px] p-4 flex flex-col items-center gap-4">
                    {isLoading ? (
                        <p className='block w-[400px] text-2xl font-bold text-light-blue'>Loading...</p>
                    ) : (
                    <>
                    <img src={backup} alt="stworzyc kopie bazy danych" />
                    <button className='button-primary bg-green' onClick={createBackup} >Stworzyc kopie</button>
                    <p className='block text-white '>Stworzyc kopie bazy danych</p>
                    <p className='block text-white '>Ostatnia kopia: {backups[0]?.backup}</p>
                    </>
                    )}
            </div>
            <div className=" bg-white rounded-xl p-4 flex flex-col items-center gap-4">
                <div className="px-3">
                    <h2 className='font-bold text-xl text-blue '>Lista kopii bazy danych:</h2>
                    
                                    {isLoading ? (
                                        <p className='block w-[200px] text-2xl font-bold text-light-blue'>Loading...</p>

                        ) : (
                                <div className="scroll-container max-h-[300px] w-full my-4">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Data</td>
                                                <td>Przeglądanie</td>
                                            </tr>
                                            {backups.map((backup, key) => (
                                                <tr key={key}>
                                                    <td className='font-bold text-xl'>{backup.backup}</td>
                                                    <td className='p-2'>
                                                        <button className='button-secondary bg-green' onClick={() => navigate(`/bazaZobacz/${backup.backup}`)}>Zobaczyc</button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                                )}
                </div>
            </div>
        </div>
    </div>
)
}

export default Backup
