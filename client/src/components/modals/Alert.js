import React, { useEffect, useState } from 'react';
import styles from './alert.css'; // Import the CSS module
import {useStore} from '../../store'

export default function Alert() {
    const [modal, setModal] = useState(true); // Initialize modal to false

    const toggleModal = () => {
        setModal(prevModal => !prevModal);
        setAlert(color, "")
        // Invert the value of modal on click
    };

    let color = useStore((store) => store.alertColor)
    let message = useStore((store) => store.alertMessage)
    let setAlert = useStore((store) => store.setAlert)


    useEffect(() => { 
        if (message != "") {
            setModal(false)
            setTimeout(() => { setModal(true); setAlert(color, "") }, 4000)
            console.log("im here")
        }
    },[color, message])

    const greenStyle = {
        backgroundColor: '#7FEF75',
        borderColor: '#0EAA00'
    };

    const redStyle = {
        backgroundColor: '#EF9797',
        borderColor: '#FF1919'
    };

    return (
        <div
            style={color === 'green' ? greenStyle : redStyle}
            className={`z-20 cursor-pointer border-l-8 max-w-[300px] min-w-[300px] p-4 text-center text-lg rounded-xl fixed right-0 top-9 ${modal ? 'alert-enter' : 'alert-enter-active'}`}
            onClick={toggleModal}
        >
            <div>{message}</div>
        </div>
    );
}