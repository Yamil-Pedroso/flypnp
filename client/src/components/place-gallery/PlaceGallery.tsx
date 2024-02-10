import { useState } from 'react'
import { PlaceGalleryContainer, MenuWrapper, CardWrapper } from './styles'
import Trending from './trending/Trending'
import Beachfront from './beachfront/BeachFront'
import IconicCities from './iconic-cities/IconicCities'

import { FaFireAlt } from 'react-icons/fa'
import { LiaUmbrellaBeachSolid } from 'react-icons/lia'
import { FaTreeCity } from 'react-icons/fa6'

type ComponentType = {
  icon: JSX.Element
  component: JSX.Element
}

const PlaceGallery = () => {
  const [activeComponent, setActiveComponent] = useState<
    keyof typeof components
  >('trending')

  const components: Record<string, ComponentType> = {
    trending: { icon: <FaFireAlt />, component: <Trending /> },
    beachfront: { icon: <LiaUmbrellaBeachSolid />, component: <Beachfront /> },
    iconicCities: { icon: <FaTreeCity />, component: <IconicCities /> },
    uno: { icon: <FaTreeCity />, component: <IconicCities /> },
    dos: { icon: <FaTreeCity />, component: <IconicCities /> },
    tres: { icon: <FaTreeCity />, component: <IconicCities /> },
    cuatro: { icon: <FaTreeCity />, component: <IconicCities /> },
    cinco: { icon: <FaTreeCity />, component: <IconicCities /> },
    seis: { icon: <FaTreeCity />, component: <IconicCities /> },
    siete: { icon: <FaTreeCity />, component: <IconicCities /> },
    ocho: { icon: <FaTreeCity />, component: <IconicCities /> },
    nueve: { icon: <FaTreeCity />, component: <IconicCities /> },
    diez: { icon: <FaTreeCity />, component: <IconicCities /> },
    once: { icon: <FaTreeCity />, component: <IconicCities /> },
    doce: { icon: <FaTreeCity />, component: <IconicCities /> },
  }

  const handleClick = (component: keyof typeof components) => {
    setActiveComponent(component)
  }

  return (
    <PlaceGalleryContainer>
      <div>
        <MenuWrapper>
          {Object.keys(components).map((key) => (
            <div key={key} style={{}}>
              <button
                className={activeComponent === key ? 'active' : 'inactive'}
                onClick={() => handleClick(key as keyof typeof components)}
              >
                {components[key as keyof typeof components].icon}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            </div>
          ))}
          <div className="card-wrapper">
            {activeComponent && components[activeComponent].component}
          </div>
        </MenuWrapper>
      </div>
    </PlaceGalleryContainer>
  )
}

export default PlaceGallery
