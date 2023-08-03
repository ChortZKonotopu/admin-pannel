import { create } from 'zustand'

const store = (set) => ({
    header: false,
    displayHeader: (val) => set((store) =>
        ({ header: val })),
    date: { isDate: false, dateIs: new Date() },
    setDate: (isDate, date) => set((store)=>
        ({ date: { isDate: isDate, dateIs: date } })),
    alertColor: "gray",
    alertMessage: "",
    setAlert: (color, message) => set((store)=>({alertColor: color, alertMessage: message}))
    
})

export const useStore = create(store);