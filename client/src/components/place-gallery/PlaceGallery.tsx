/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { PlaceGalleryContainer, MenuWrapper } from './styles'
import Trending from './trending/Trending'
import Beachfront from './beachfront/BeachFront'
import IconicCities from './iconic-cities/IconicCities'
import { ToastContainer } from 'react-toastify'
//import { usePlaces } from '../../../hooks'
//import Spinner from '../common/progress/Progress'

import { FaTreeCity, FaUmbrellaBeach } from 'react-icons/fa6'
import {
  GiFamilyHouse,
  GiTropicalFish,
  GiCaveEntrance,
  GiCampingTent,
} from 'react-icons/gi'
import {
  FaShuttleVan,
  FaSkiing,
  FaLaptopHouse,
  FaFireAlt,
} from 'react-icons/fa'
import { AiFillPicture } from 'react-icons/ai'
import { MdFoodBank, MdCastle, MdOutlineSurfing } from 'react-icons/md'
import { PiWarehouseFill } from 'react-icons/pi'

type ComponentType = {
  icon: JSX.Element
  component: JSX.Element
}

const PlaceGallery = () => {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [activeComponent, setActiveComponent] = useState<
    keyof typeof components
  >('trending')

  const components: Record<string, ComponentType> = {
    trending: {
      icon: <FaFireAlt size={32} style={{ color: '#515151' }} />,
      component: <Trending />,
    },
    beachfront: {
      icon: <FaUmbrellaBeach size={32} style={{ color: '#515151' }} />,
      component: <Beachfront />,
    },
    iconicCities: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    tinyHomes: {
      icon: <FaLaptopHouse size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    mansions: {
      icon: <GiFamilyHouse size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    huts: {
      icon: <FaShuttleVan size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    ski: {
      icon: <FaSkiing size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    amazingViews: {
      icon: <AiFillPicture size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    luxe: {
      icon: <MdFoodBank size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    design: {
      icon: <PiWarehouseFill size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    tropical: {
      icon: <GiTropicalFish size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    historicalHomes: {
      icon: <MdCastle size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    surfing: {
      icon: <MdOutlineSurfing size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    caves: {
      icon: <GiCaveEntrance size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    camping: {
      icon: <GiCampingTent size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
  }

  const handleClick = (component: keyof typeof components, e: any) => {
    setActiveComponent(component)

    const buttonRect = e.currentTarget.getBoundingClientRect()
    setUnderlineStyle({
      left: buttonRect.left + window.scrollX,
      width: buttonRect.width,
    })
  }

  return (
    <PlaceGalleryContainer>
      <div className="place-gallery-wrapper">
        <MenuWrapper>
          {Object.keys(components).map((key) => (
            <div key={key} className="btn-wrapper">
              <button
                className={activeComponent === key ? 'active' : 'inactive'}
                onClick={(e) => handleClick(key as keyof typeof components, e)}
              >
                <div className="icon-places-wrapper">
                  {components[key as keyof typeof components].icon}
                </div>
                <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              </button>
            </div>
          ))}
          <div
            className="underlineIndicator"
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
          ></div>
        </MenuWrapper>
        <div className="card-wrapper">
          {activeComponent && components[activeComponent].component}
        </div>
      </div>
      <ToastContainer />
    </PlaceGalleryContainer>
  )
}

export default PlaceGallery
