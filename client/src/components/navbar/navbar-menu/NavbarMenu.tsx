import { useState, useEffect } from 'react'
import Search from '../../search/Search'

interface NavbarMenuProps {
  active: string
}

interface NavMenuClickProps {
  menuClick: boolean
}

const NavbarMenu = ({ menuClick }: NavMenuClickProps) => {
  const [active, setActive] = useState<NavbarMenuProps>({ active: 'Stays' })
  const [myMenuClick, setMyMenuClick] = useState<boolean>(false)

  const handleClick = (name: string) => {
    setActive({ active: name })
    if (name === 'Experiences') {
      setMyMenuClick(true)
    } else {
      setMyMenuClick(false)
    }
  }

  useEffect(() => {
    setMyMenuClick(menuClick)
  }, [menuClick])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ul className="nav-menu-wrapper">
        {['Stays', 'Experiences', 'Online Experiences'].map((menu, index) => (
          <li
            key={index}
            className={active.active === menu ? 'active' : ''}
            onClick={() => handleClick(menu)}
          >
            {menu}
          </li>
        ))}
      </ul>
      <Search menuClick={myMenuClick} />
    </div>
  )
}

export default NavbarMenu
