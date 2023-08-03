import React from 'react'
import { Outlet } from 'react-router-dom'
import logo from '../utils/logo.svg'
import { Link } from 'react-router-dom'
import { useStore } from '../store.js'

export default function BgMain() {
    const isLoggedIn = useStore((store) => store.header)

  return (
      <div className='bgmain'>
        {isLoggedIn &&(<div className='bg-light-blue w-full rounded-xl rounded-t-none relative z-10'>
              <header className="mb-6">
                  <nav className='container flex justify-around items-center py-[18px] text-lg'>
                      <Link to={'/main'}><img src={logo} alt="" /></Link>
                      <div className="flex gap-[50px]">
              <Link to={'/main'}>Strona główna</Link>
                          <Link to={'/pracowniki'}>Zarządzanie pracownikami</Link>
                          <Link to={'/placowki'}>Zarządzanie placowkami</Link>
                      </div>
                      <div className=""></div>
                  </nav>
              </header>
      </div>)}
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}
