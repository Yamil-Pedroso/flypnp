/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { PlaceGalleryContainer, MenuWrapper } from './styles'
import Trending from './trending/Trending'
import Beachfront from './beachfront/BeachFront'
import IconicCities from './iconic-cities/IconicCities'
//import Spinner from '../common/progress/Progress'

import { FaFireAlt } from 'react-icons/fa'
import { LiaUmbrellaBeachSolid } from 'react-icons/lia'
import { FaTreeCity } from 'react-icons/fa6'

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
      icon: <LiaUmbrellaBeachSolid size={32} style={{ color: '#515151' }} />,
      component: <Beachfront />,
    },
    iconicCities: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    uno: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    dos: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    tres: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    cuatro: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    cinco: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    seis: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    siete: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    ocho: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    nueve: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    diez: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    once: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
      component: <IconicCities />,
    },
    doce: {
      icon: <FaTreeCity size={32} style={{ color: '#515151' }} />,
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
    </PlaceGalleryContainer>
  )
}

export default PlaceGallery
