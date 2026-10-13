import { NavLink } from 'react-router'
import { FaLaptopCode, FaTimes, FaBars } from 'react-icons/fa'
import React, { useState } from 'react'

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const base = 'transition hover:text-blue-400'
  const active = 'text-blue-400 font-semibold'

  const menus = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className='bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
        <NavLink
          to='/'
          className='flex items-center gap-2 text-lg font-bold text-blue-300'
        >
          <FaLaptopCode className='text-blue-400 text-xl' />
          <span>The Friendly Developer</span>
        </NavLink>

        {/** Desktop Nav */}
        <div className='hidden md:flex items-center'>
          <div className='space-x-4 text-sm text-gray-300'>
            {menus.map(({ to, label }) => (
              <NavLink
                key={to}
                className={({ isActive }) => (isActive ? active : base)}
                to={to}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
            <button className="text-blut-400 text-xl cursor-pointer"
              onClick={()=>setMenuOpen(!menuOpen)}
            >
              { menuOpen ? <FaTimes/> : <FaBars/> }
            </button>
        </div>
      </div>
        {/** Mobile Nav */}
        { menuOpen && (
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 space-y-2 space-x-4 text-center flex flex-col">
            {menus.map(({ to, label }) => (
              <NavLink
                key={to}
                className={({ isActive }) => (isActive ? active : base)}
                to={to}
                onClick={()=>setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
    </nav>
  )
}
export default Navbar
