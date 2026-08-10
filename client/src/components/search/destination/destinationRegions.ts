import images from "../../../assets/images";

export type Coordinates = [longitude: number, latitude: number];

export interface DestinationCountry {
  name: string;
  center: Coordinates;
  zoom: number;
  aliases: string[];
}

export interface DestinationRegion {
  id: "africa" | "americas" | "asia" | "europe" | "oceania";
  image: string;
  center: Coordinates;
  zoom: number;
  countries: DestinationCountry[];
}

export const destinationRegions: DestinationRegion[] = [
  {
    id: "africa",
    image: images.map6,
    center: [18.5, 2.5],
    zoom: 2.35,
    countries: [
      { name: "Morocco", center: [-6.2, 31.8], zoom: 5.2, aliases: ["morocco", "marrakech", "casablanca"] },
      { name: "Egypt", center: [29.9, 26.8], zoom: 5.1, aliases: ["egypt", "cairo", "giza"] },
      { name: "Kenya", center: [37.9, 0.2], zoom: 5.4, aliases: ["kenya", "nairobi", "mombasa"] },
      { name: "South Africa", center: [24.1, -29], zoom: 4.7, aliases: ["south africa", "cape town", "johannesburg"] },
      { name: "Tanzania", center: [34.8, -6.3], zoom: 5.1, aliases: ["tanzania", "zanzibar", "dar es salaam"] },
    ],
  },
  {
    id: "americas",
    image: images.map4,
    center: [-84, 17],
    zoom: 1.75,
    countries: [
      { name: "United States", center: [-98.6, 39.8], zoom: 3.4, aliases: ["united states", "usa", "new york", "california", "joshua tree"] },
      { name: "Canada", center: [-106.3, 56.1], zoom: 3.1, aliases: ["canada", "toronto", "vancouver", "mayne island"] },
      { name: "Mexico", center: [-102.5, 23.6], zoom: 4.3, aliases: ["mexico", "cancun", "tulum"] },
      { name: "Brazil", center: [-51.9, -14.2], zoom: 3.8, aliases: ["brazil", "rio de janeiro", "sao paulo"] },
      { name: "Argentina", center: [-63.6, -38.4], zoom: 3.7, aliases: ["argentina", "buenos aires", "patagonia"] },
    ],
  },
  {
    id: "asia",
    image: images.map2,
    center: [91, 31],
    zoom: 2.15,
    countries: [
      { name: "Japan", center: [138.2, 36.2], zoom: 4.8, aliases: ["japan", "tokyo", "kyoto", "osaka"] },
      { name: "Thailand", center: [101, 15.8], zoom: 5.1, aliases: ["thailand", "bangkok", "koh samui", "phuket"] },
      { name: "Indonesia", center: [117.3, -2.5], zoom: 4.2, aliases: ["indonesia", "bali", "jakarta"] },
      { name: "India", center: [78.9, 22.6], zoom: 4.4, aliases: ["india", "delhi", "mumbai", "goa"] },
      { name: "South Korea", center: [127.8, 36.4], zoom: 6, aliases: ["south korea", "seoul", "busan"] },
    ],
  },
  {
    id: "europe",
    image: images.map3,
    center: [13, 50],
    zoom: 3.1,
    countries: [
      { name: "Switzerland", center: [8.23, 46.82], zoom: 7, aliases: ["switzerland", "zurich", "zermatt", "geneva"] },
      { name: "France", center: [2.2, 46.2], zoom: 5.4, aliases: ["france", "paris", "nice", "lyon"] },
      { name: "Spain", center: [-3.7, 40.4], zoom: 5.3, aliases: ["spain", "madrid", "barcelona", "ibiza"] },
      { name: "Italy", center: [12.5, 42.8], zoom: 5.2, aliases: ["italy", "rome", "milan", "venice"] },
      { name: "Portugal", center: [-8, 39.6], zoom: 6, aliases: ["portugal", "lisbon", "porto", "algarve"] },
    ],
  },
  {
    id: "oceania",
    image: images.map1,
    center: [151, -22],
    zoom: 2.6,
    countries: [
      { name: "Australia", center: [133.8, -25.3], zoom: 3.5, aliases: ["australia", "sydney", "melbourne", "brisbane"] },
      { name: "New Zealand", center: [172.5, -41.4], zoom: 4.8, aliases: ["new zealand", "auckland", "queenstown"] },
      { name: "Fiji", center: [178.1, -17.7], zoom: 6, aliases: ["fiji", "nadi", "suva"] },
      { name: "French Polynesia", center: [-149.4, -17.7], zoom: 5.8, aliases: ["french polynesia", "tahiti", "bora bora"] },
      { name: "Papua New Guinea", center: [143.9, -6.3], zoom: 5.1, aliases: ["papua new guinea", "port moresby"] },
    ],
  },
];
