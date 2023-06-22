const todayDate = new Date();

todayDate.setHours(0);
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

const today = todayDate.valueOf();

const hour = 1000 * 60 * 60;
const day = hour * 24;

export class MachineLearningService {
  household = [
    {
      name: "Max Muster",
      gender: "male",
      age: "adult",
      commandCount: 12000,
    },
    {
      name: "Marie Muster",
      gender: "female",
      age: "adult",
      commandCount: 10000,
    },
    {
      name: "Marta Muster",
      gender: "unknown",
      age: "child",
      commandCount: 379,
    },
  ];

  profiling = {
    extroverted: 4,
    age: 3,
    sexuality: 2,
    education: 4,
    politicalLeft: 4,
    politicalRight: 2,
  };

  sinusMilieus = null;

  /**
   * Sentiment analysis
   */
  sentiment = {
    positive: 60,
    neutral: 13,
    negative: 27,
  };

  /**
   * Politeness analysis
   */
  politeness: "positive" | "neutral" | "negative" = "positive";

  /**
   * Health analysis: Es können theoreisch Gesundheitszustände von der Stimme abgeleitet werden.
   *
   * Erkältung (Heiser, Husten, Nießen)
   * Müdigkeit (Müde stimme)
   * Betrunken ("Lallen")
   *
   * ggf. Weinen => Depression
   */

  health = [
    {
      timestamp: today - day * 10 + hour * 10,
      type: "cold",
      cause: "cough",
    },
    {
      timestamp: today - day * 11 + hour * 12,
      type: "cold",
      cause: "cough",
    },
    {
      timestamp: today - day * 11 + hour * 14,
      type: "cold",
      cause: "sneez",
    },
    {
      timestamp: today - day * 20 + hour * 15,
      type: "tired",
      cause: "tiredvoice",
    },
  ];

  /**
   * Background noise analysis
   */
  backgroundNoise = [
    {
      timestamp: today - day * 3 + hour * 10,
      type: "tv",
      falseActivation: true,
    },
    {
      timestamp: today - day * 4 + hour * 12,
      type: "music",
      falseActivation: false,
    },
    {
      timestamp: today - day * 5 + hour * 11,
      type: "talking",
      falseActivation: true,
    },
    {
      timestamp: today - day * 10 + hour * 16,
      type: "cough",
      falseActivation: false,
    },
    {
      timestamp: today - day * 11 + hour * 17,
      type: "cough",
      falseActivation: false,
    },
    {
      timestamp: today - day * 11 + hour * 6,
      type: "sneez",
      falseActivation: false,
    },
  ];

  /**
   * Advertisment: Der Sprachassistent kennt die Tagesabläufe teilweise relativ gut. Während Befehlen wird teilweise im Hintergrund über Produkte oder Vorlieben gesprochen oder der Befehl beinhaltet Produkte, Musikwünsche oder TV Programme direkt. Zusätzlich lässt sich aus der Stimme ableiten, mit welchen Emotionen die Markennamen genannt werden. Diese Informationen können zusammen mit dem Profiling und ggf. Sinus Milieus genutzt werden, um geeignete, personaisierte Werbungen anzuzeigen.
   */
  advertisement = {
    Nike: 2,
    "H&M": 3,
    "Coca Cola": 3,
    "Red Bull": 2,
    Kellogs: 1,
    Disney: 4,
    Apple: 2,
    Tesla: 4,
    IKEA: 2,
    Ford: 1,
    LEGO: 5,
    Netflix: 4,
  };

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Connect to Uni Siegen ML Service

      const response = await fetch("http://localhost:8123/results");

      if (!response.ok) {
        throw new Error("Bad status code.");
      }

      const data = await response.json();

      Object.assign(this, data);
    } catch (error) {
      console.error("ML Service seems to be offline. Using dummy data.");
      console.error(error);
    }
  }
}
