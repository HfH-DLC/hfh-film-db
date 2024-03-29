export const FILTER_TYPE_SELECT = "SELECT";
export const FILTER_TYPE_RANGE = "RANGE";
export const FILTER_FORMAT_TIME = "TIME";

export const FIELDNAMES = {
  BEHINDERUNG: "Behinderung",
  THEMA: "Thema",
  RELEVANZ: "Heilpädagogische Relevanz",
  HERKUNFT: "Herkunft behinderte Person",
  FILM: "Film",
  GESCHLECHT: "Geschlecht behinderte Person",
  BILD: "Vorschaubild",
  LAENGE: "Länge",
  ALTERSGRUPPE: "Altersgruppe behinderte Person",
  CLIP: "Clip Nr.",
  KEYWORDS: "keywords",
  INHALT: "Inhalt",
  FILM_TITEL: "Film_Titel",
  FILM_JAHR: "Film_Jahr",
  FILM_LAND: "Film_Land",
  FILM_INHALT: "Film_Inhalt",
  FILM_WEITERE_ANGABEN: "Film_Weitere_Angaben",
  FILM_TON: "Film_Ton",
  FILM_HERKUNFT: "Film_Herkunft_behinderte_Person",
  FILM_ALTERSGRUPPE: "Film_Altersgruppe_behinderte_Person",
  FILM_GESCHLECHT: "Film_Geschlecht_behinderte_Person",
  VIDEO: "Vimeo-Link",
  STARTZEIT: "Startzeit",
};

export const FIELDS = {
  BEHINDERUNG: { name: FIELDNAMES.BEHINDERUNG },
  THEMA: { name: FIELDNAMES.THEMA },
  RELEVANZ: { name: FIELDNAMES.RELEVANZ },
  HERKUNFT: {
    name: FIELDNAMES.HERKUNFT,
    fallbackFieldName: FIELDNAMES.FILM_HERKUNFT,
  },
  FILM: { name: FIELDNAMES.FILM },
  GESCHLECHT: {
    name: FIELDNAMES.GESCHLECHT,
    fallbackFieldName: FIELDNAMES.FILM_GESCHLECHT,
  },
  BILD: { name: FIELDNAMES.BILD },
  LAENGE: { name: FIELDNAMES.LAENGE },
  ALTERSGRUPPE: {
    name: FIELDNAMES.ALTERSGRUPPE,
    fallbackFieldName: FIELDNAMES.FILM_ALTERSGRUPPE,
  },
  CLIP: { name: FIELDNAMES.CLIP },
  KEYWORDS: { name: FIELDNAMES.KEYWORDS },
  INHALT: { name: FIELDNAMES.INHALT },
  FILM_TITEL: { name: FIELDNAMES.FILM_TITEL, unwrapArray: true },
  FILM_JAHR: { name: FIELDNAMES.FILM_JAHR, unwrapArray: true },
  FILM_LAND: { name: FIELDNAMES.FILM_LAND },
  FILM_INHALT: { name: FIELDNAMES.FILM_INHALT, unwrapArray: true },
  FILM_WEITERE_ANGABEN: {
    name: FIELDNAMES.FILM_WEITERE_ANGABEN,
    unwrapArray: true,
  },
  FILM_TON: { name: FIELDNAMES.FILM_TON },
  VIDEO: { name: FIELDNAMES.VIDEO },
  STARTZEIT: { name: FIELDNAMES.STARTZEIT },
};

export const FILTERS = [
  {
    id: "behinderung",
    field: FIELDS.BEHINDERUNG,
    type: FILTER_TYPE_SELECT,
    params: { value: "behinderung" },
    label: "Behinderung",
  },
  {
    id: "thema",
    field: FIELDS.THEMA,
    type: FILTER_TYPE_SELECT,
    params: { value: "thema" },
    label: "Thema",
  },
  {
    id: "altersgruppe",
    field: FIELDS.ALTERSGRUPPE,
    type: FILTER_TYPE_SELECT,
    params: { value: "altersgruppe" },
    label: "Altersgruppe",
  },
  {
    id: "land",
    field: FIELDS.FILM_LAND,
    type: FILTER_TYPE_SELECT,
    params: { value: "land" },
    label: "Produktionsland",
  },
  {
    id: "jahr",
    field: FIELDS.FILM_JAHR,
    type: FILTER_TYPE_RANGE,
    params: { start: "jahr_start", end: "jahr_end" },
    label: "Produktionsjahr",
    startLabel: "Frühstes Jahr",
    endLabel: "Spätestes Jahr",
    step: 1,
  },
  {
    id: "laenge",
    field: FIELDS.LAENGE,
    type: FILTER_TYPE_RANGE,
    params: { start: "laenge_start", end: "laenge_end" },
    label: "Länge",
    startLabel: "Mindestlänge",
    endLabel: "Maximallänge",
    step: 10,
    format: FILTER_FORMAT_TIME,
  },
];

/**
 * The fields to be included in text search
 */
export const SEARCH_TEXT_FIELDS = [
  FIELDS.CLIP,
  FIELDS.BEHINDERUNG,
  FIELDS.THEMA,
  FIELDS.RELEVANZ,
  FIELDS.KEYWORDS,
  FIELDS.FILM_TITEL,
];

export const TABLE_NAME = "Clips";
