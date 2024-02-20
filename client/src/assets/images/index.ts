import logo from './svg/logo.svg';
import map1 from './jpeg/map1.jpeg';
import map2 from './jpeg/map2.jpeg';
import map3 from './jpeg/map3.jpeg';
import map4 from './jpeg/map4.jpeg';
import map5 from './jpeg/map5.jpeg';
import map6 from './jpeg/map6.jpeg';
import logi from './png/logi.png';


interface Images {
    [key: string]: string;
}

const images: Images = {
    logo,
    map1,
    map2,
    map3,
    map4,
    map5,
    map6,
    logi
};

export default images;
