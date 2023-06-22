export default {
  nav: {
    guide: "Anleitung",
    guide_url: "https://checkmyva.de/datenvisualisierung-anleitung/",
    faq: "Häufige Fragen und Antworten",
    faq_url: "https://checkmyva.de/datenvisualisierung-faq/",
  },
  common: {
    request: "Befehl",
    response: "Antwort",
    device: "Gerät",
  },
  categories: {
    action_create: "Neue Kategorie anlegen",
    action_create_short: "Neu",
    action_create_confirm: "Hinzufügen",
    action_delete: "Löschen",
    create_title: "Neue Kategorie anlegen",
    create_description: "Bilden Sie hier Ihre eigenen Kategorien. Vergeben Sie dazu zuerst einen Namen oder wählen Sie eine aus der Kategorienliste unten aus.​",
    create_placeholder: "Bitte geben Sie hier den Namen der Kategorie ein.​",
    word_description: "Geben Sie nun einzelne Begriffe ein, die der Kategorie zugeordnet werden sollen. Alternativ können Sie auch aus der Auswahlliste Begriffe auswählen, die erscheint sobald Sie das Eingabefeld anklicken.",
    word_placeholder: "Bitte wähle hier die Begriffe aus, die der Kategorie zugewiesen werden sollen.",
    logic_description: "Wie sollen die Begriffe verbunden werden?",
    or: "Logisches ODER",
    and: "Logisches UND",
    empty: "Es wurden noch keine Kategorien gefunden, bitte lege eine neue an.",
    add_word_to_category_title: "Wort zu Kategorie hinzufügen",
    add_word_to_category_description: "Bitte wähle eine Kategorie, zu der das Wort hinzugefügt werden soll.",
    add_word_to_category_action: "Zu Kategorie",
    cols: {
      name: "Name der Kategorie",
      color: "Farbe",
      words: "Zugewiesene Begriffe",
    },
  },
  category_suggestion: {
    description: "Hier finden Sie eine Liste mit typischen Kategorien. Um eine dieser Kategorie zu verwenden, klicken Sie auf „Auswählen, um diese zu übernehmen und anzupassen.​",
    fetching_error: "Vorschläge konnten nicht geladen werden.",
    action_subscribe: "Auswählen",
  },
  widget: {
    categories: {
      title: "Deine Kategorien",
      description: "Hier kannst Du mit Hilfe Deiner verwendeten Begriffe Kategorien bilden, um sie in der Visualisierung farblich darzustellen.",
    },
    category_stats: {
      title: "Häufigkeit einer Kategorie im Verhältnis zu anderen Kategorien",
      description: "Dieses Widget zeigt dir, welche Kategorien du am häufigsten nutzt.",
      series_name: "Anzahl der Vorkommen",
    },
    category_timeseries: {
      title: "Häufigkeit einer Kategorie im Verhältnis zu anderen Kategorien über die Zeit",
      description: "Dieses Widget zeigt dir, welche Kategorien du jeden Monat am häufigsten nutzt.",
      yaxis_label: "Anzahl der Befehle",
    },
    category_device_stats: {
      title: "Häufigkeit einer Kategorie/Geräte Kombination",
      description: "Dieses Widget zeigt dir, welche Kategorie/Geräte Kombination du am häufigsten nutzt.",
      series_name: "Anzahl der Vorkommen",
      title_inverted: "Häufigkeit einer Geräte/Kategorie Kombination",
      description_inverted: "Dieses Widget zeigt dir, welche Geräte/Kategorie Kombination du am häufigsten nutzt.",
      series_name_inverted: "Anzahl der Vorkommen",
    },
    device_stats: {
      title: "Häufigkeit von Gerätenutzung",
      description: "Dieses Widget zeigt dir, welchen Sprachassistenten du am häufigsten nutzt.",
      series_name: "Anzahl der Nutzungen",
    },
    timeseries: {
      title: "Zeitachse mit allen Interaktionen, farblich sortiert nach Kategorien​",
      description: "Mit diesem Widget kannst du genau sehen, wann du deinen Sprachassistenten angesprochen hast, welcher Befehl dabei verstanden wurde und was die Antwort war.",
    },
    heatmap: {
      title: "Heatmap",
      title_name: "Heatmap von {{name}}",
      description: "Dieses Widget gibt dir eine Übersicht, zu welchen Uhrzeiten und an welchen Wochentagen du deinen Sprachassisten am häufigsten benutzt.",
    },
    count_table: {
      word: {
        title: "Deine verwendeten Begriffe",
        description: "Hier findest Du alle Begriffe, die Du laut Datenauskunft zu Deinem Sprachassistenten gesagt hast.",
      },
      phrase: {
        title: "Deine verwendeten Befehle",
        description: "Hier findest Du alle Befehle, die Du laut Datenauskunft zu Deinem Sprachassistenten gesagt hast.",
      },
      cols: {
        word: "Begriff",
        phrase: "Befehl",
        count: "Häufigkeit",
        categories: "Zugewiesene Kategorie",
      },
    },
    ml_advertisement: {
      title: "Werbung",
      description: "...",
    },
    ml_health: {
      title: "Gesundheit",
      description: "...",
    },
    ml_household: {
      title: "Haushalt",
      description: "...",
    },
    ml_noise: {
      title: "Hintergrundgeräusche",
      description: "...",
    },
    ml_politeness: {
      title: "Höflichkeit gegenüber dem Sprachassistenten",
      description: "...",
      label_positive: "Höflich",
      label_neutral: "Neutral",
      label_negative: "Unhöflich",
    },
    ml_profiling: {
      title: "Profiling",
      description: "...",
      cat_extroverted: "Extrovertiert",
      cat_age: "Alter",
      cat_sexuality: "Sexualität",
      cat_education: "Bildung",
      cat_politicalLeft: "Politisch Links",
      cat_politicalRight: "Politisch Rechts",
    },
    ml_sentiment: {
      title: "Empfindung",
      description: "...",
      label_positive: "Positiv",
      label_neutral: "Neutral",
      label_negative: "Negativ",
    },
  },
};
