import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enNavbar from "./locales/en/navbar/navbar";
import esNavbar from "./locales/es/navbar/navbar";
import itNavbar from "./locales/it/navbar/navbar";
import frNavbar from "./locales/fr/navbar/navbar";
import deNavbar from "./locales/de/navbar/navbar";
import enApp from "./locales/en/app/app";
import esApp from "./locales/es/app/app";
import itApp from "./locales/it/app/app";
import frApp from "./locales/fr/app/app";
import deApp from "./locales/de/app/app";
import enAuth from "./locales/en/auth/auth";
import esAuth from "./locales/es/auth/auth";
import frAuth from "./locales/fr/auth/auth";
import itAuth from "./locales/it/auth/auth";
import deAuth from "./locales/de/auth/auth";
import enSearch from "./locales/en/search/search";
import esSearch from "./locales/es/search/search";
import frSearch from "./locales/fr/search/search";
import itSearch from "./locales/it/search/search";
import deSearch from "./locales/de/search/search";
import enPlaces from "./locales/en/places/places";
import esPlaces from "./locales/es/places/places";
import frPlaces from "./locales/fr/places/places";
import itPlaces from "./locales/it/places/places";
import dePlaces from "./locales/de/places/places";
import enExperiences from "./locales/en/experiences/experiences";
import esExperiences from "./locales/es/experiences/experiences";
import frExperiences from "./locales/fr/experiences/experiences";
import itExperiences from "./locales/it/experiences/experiences";
import deExperiences from "./locales/de/experiences/experiences";
import enServices from "./locales/en/services/services";
import esServices from "./locales/es/services/services";
import frServices from "./locales/fr/services/services";
import itServices from "./locales/it/services/services";
import deServices from "./locales/de/services/services";
import enBookings from "./locales/en/bookings/bookings";
import esBookings from "./locales/es/bookings/bookings";
import frBookings from "./locales/fr/bookings/bookings";
import itBookings from "./locales/it/bookings/bookings";
import deBookings from "./locales/de/bookings/bookings";
import enCommerce from "./locales/en/commerce/commerce";
import esCommerce from "./locales/es/commerce/commerce";
import frCommerce from "./locales/fr/commerce/commerce";
import itCommerce from "./locales/it/commerce/commerce";
import deCommerce from "./locales/de/commerce/commerce";
import enHelp from "./locales/en/help/help";
import esHelp from "./locales/es/help/help";
import frHelp from "./locales/fr/help/help";
import itHelp from "./locales/it/help/help";
import deHelp from "./locales/de/help/help";
import enMessages from "./locales/en/messages/messages";
import esMessages from "./locales/es/messages/messages";
import frMessages from "./locales/fr/messages/messages";
import itMessages from "./locales/it/messages/messages";
import deMessages from "./locales/de/messages/messages";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        app: enApp,
        auth: enAuth,
        search: enSearch,
        places: enPlaces,
        experiences: enExperiences,
        services: enServices,
        bookings: enBookings,
        commerce: enCommerce,
        help: enHelp,
        messages: enMessages,
      },
      es: {
        navbar: esNavbar,
        app: esApp,
        auth: esAuth,
        search: esSearch,
        places: esPlaces,
        experiences: esExperiences,
        services: esServices,
        bookings: esBookings,
        commerce: esCommerce,
        help: esHelp,
        messages: esMessages,
      },
      it: {
        navbar: itNavbar,
        app: itApp,
        auth: itAuth,
        search: itSearch,
        places: itPlaces,
        experiences: itExperiences,
        services: itServices,
        bookings: itBookings,
        commerce: itCommerce,
        help: itHelp,
        messages: itMessages,
      },
      fr: {
        navbar: frNavbar,
        app: frApp,
        auth: frAuth,
        search: frSearch,
        places: frPlaces,
        experiences: frExperiences,
        services: frServices,
        bookings: frBookings,
        commerce: frCommerce,
        help: frHelp,
        messages: frMessages,
      },
      de: {
        navbar: deNavbar,
        app: deApp,
        auth: deAuth,
        search: deSearch,
        places: dePlaces,
        experiences: deExperiences,
        services: deServices,
        bookings: deBookings,
        commerce: deCommerce,
        help: deHelp,
        messages: deMessages,
      },
    },
    ns: ["navbar", "app", "auth", "search", "places", "experiences", "services", "bookings", "commerce", "help", "messages"],
    defaultNS: "app",
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr", "it", "de"],
    debug: import.meta.env.DEV && import.meta.env.MODE !== "test",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
