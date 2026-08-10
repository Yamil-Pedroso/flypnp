import type { AppTranslations } from "../../en/app/app";

const app = {
  common: {
    flypnpHome: "Flypnp-Startseite",
    close: "Schließen",
    tryAgain: "Erneut versuchen",
    loading: "Wird geladen…",
    reserve: "Buchen",
    create: "Erstellen",
    clear: "Leeren",
  },
  home: {
    eyebrow: "Finde deine nächste Unterkunft",
    title:
      "Übernachte an einem Ort, der sich wie eine erzählenswerte Geschichte anfühlt.",
    description:
      "Besondere Unterkünfte, einfache Buchung und unvergessliche Auszeiten – alles an einem Ort.",
  },
  footer: {
    description:
      "Unvergessliche Aufenthalte und lokale Erlebnisse für Reisende, die sich überall zu Hause fühlen möchten.",
    madeIn: "Mit Sorgfalt in der Schweiz gemacht",
    explore: "Entdecken",
    stays: "Unterkünfte",
    experiences: "Erlebnisse",
    services: "Dienstleistungen",
    wishlist: "Favoriten",
    trips: "Reisen",
    profile: "Mein Profil",
    giftCards: "Geschenkkarten",
    help: "Hilfe-Center",
    contact: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
    tagline: "Reise mit offenem Geist",
  },
  welcome: {
    close: "Willkommensdialog schließen",
    eyebrow: "Deine Reise beginnt hier",
    title: "Willkommen bei Flypnp",
    titleWithName: "Willkommen, {{name}}!",
    returningDescription:
      "Schön, dass du da bist. Dein nächster unvergesslicher Aufenthalt wartet darauf, entdeckt zu werden.",
    newDescription:
      "Entdecke besondere Unterkünfte, inspirierende Reiseziele und neue Geschichten auf der ganzen Welt.",
    progress:
      "Das Kernerlebnis ist fertig – bis zur finalen Veröffentlichung fehlen nur noch 25 %.",
    start: "Jetzt entdecken",
  },
  access: {
    checking: "Sitzung wird geprüft",
    checkingProgress: "Sitzung wird geprüft…",
  },
  notifications: {
    deleted: "Benachrichtigung gelöscht.",
    deleteError: "Die Benachrichtigung konnte nicht gelöscht werden.",
    inbox: "Posteingang",
    empty: "Noch keine Benachrichtigungen",
    title: "Deine Benachrichtigungen",
    defaultTitle: "Flypnp-Update",
    unread: "Ungelesen",
    viewDetails: "Details ansehen",
    markRead: "Als gelesen markieren",
    delete: "Benachrichtigung löschen",
  },
  wishlist: {
    deleted: "Unterkunft erfolgreich entfernt",
    eyebrow: "Für später gespeichert",
    title: "Orte, an die du immer wieder denken musst.",
    description:
      "Bewahre inspirierende Unterkünfte in deiner Nähe und mache einen Favoriten zu deinem nächsten Abenteuer.",
    savedPlaces_one: "Gespeicherter Ort",
    savedPlaces_other: "Gespeicherte Orte",
    collection: "Deine Sammlung",
    myWishlist: "Meine Favoriten",
    discoverMore: "Mehr entdecken",
    loading: "Favoriten werden geladen",
    loadErrorTitle: "Deine Favoriten konnten nicht geladen werden",
    loadErrorDescription:
      "Deine gespeicherten Orte sind weiterhin sicher. Versuche es erneut.",
    emptyTitle: "Deine Favoriten warten auf Inspiration",
    emptyDescription:
      "Tippe bei einer Unterkunft auf das Herz, um sie hier wiederzufinden.",
    explore: "Unterkünfte entdecken",
    removeLabel: "{{title}} aus den Favoriten entfernen",
    savedExperience: "Gespeichertes Erlebnis",
    savedStay: "Gespeicherte Unterkunft",
    ready: "Wenn du bereit bist",
    reserve: "Buchen",
    dialogLabel: "Gespeicherten Ort entfernen",
    closeDialog: "Entfernungsdialog schließen",
    removeTitle: "Aus Favoriten entfernen?",
    removeNamed:
      "{{title}} wird nicht mehr in deinen gespeicherten Orten angezeigt.",
    removeGeneric:
      "Diese Unterkunft wird nicht mehr in deiner Sammlung angezeigt.",
    keep: "Behalten",
    remove: "Ort entfernen",
    created: "Favoritenliste erstellt!",
    saveError:
      "Dieses Element ({{itemType}}) konnte nicht gespeichert werden. Melde dich an und versuche es erneut.",
    closeCreate: "Favoritendialog schließen",
    createTitle: "Favoritenliste erstellen",
    namePlaceholder: "Liste benennen",
    characters: "Zeichen",
    overLimit: "Zeichenlimit überschritten.",
    clear: "Leeren",
    create: "Erstellen",
  },
  stubs: {
    notFound: "Seite nicht gefunden",
    booking: "Buchung",
    accountNav: "Kontonavigation",
    editProfile: "Profil bearbeiten",
    places: "Unterkünfte",
    rooms: "Zimmer",
    update: "Aktualisieren",
  },
} satisfies AppTranslations;

export default app;
