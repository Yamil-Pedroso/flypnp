import NavbarMenu from './navbar-menu/NavbarMenu'
import UserMenu from './user-menu/UserMenu'
import { NavbarContainer } from './styles'
import images from '../../assets/images'

interface NavbarProps {
  menuClick: boolean
}

const Navbar = ({ menuClick }: NavbarProps) => {
  return (
    <NavbarContainer>
      <div className="navbar-wrapper">
        <div className="logo-wrapper">
          <a href="/">
            <img src={images.logo} alt="logo" />
          </a>
          <p>Flypnp</p>
        </div>
        <NavbarMenu menuClick={menuClick} />
        <UserMenu />
      </div>
    </NavbarContainer>
  )
}

export default Navbar
