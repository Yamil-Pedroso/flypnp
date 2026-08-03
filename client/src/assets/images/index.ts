import logo from "./svg/logo.svg";
import map1 from "./jpeg/map1.jpeg";
import map2 from "./jpeg/map2.jpeg";
import map3 from "./jpeg/map3.jpeg";
import map4 from "./jpeg/map4.jpeg";
import map5 from "./jpeg/map5.jpeg";
import map6 from "./jpeg/map6.jpeg";
import logi from "./png/logi.png";
import emptyBox from "./png/empty-box.png";

// icons
import car from "./png/car.png";
import petFoot from "./png/pet_foot.png";
import local from "./png/local.png";
import foot from "./png/foot.png";

// pets
import pet1 from "./jpg/pet_1.jpg";
import pet2 from "./jpg/pet_2.jpg";
const pet3 = "/demo-avatar.jpg";

// airports transfer
import airportTransfer from "./airport_transfer/airport_transfer.png";

// local guide
import localGuide from "./local_guide/local_guide.jpg";

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
  logi,
  emptyBox,
  car,
  petFoot,
  local,
  foot,
  pet1,
  pet2,
  pet3,
  airportTransfer,
  localGuide,
};

export default images;
