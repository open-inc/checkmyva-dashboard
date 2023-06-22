import { DataItemInterface, DataItemValueInterface } from "@opendash/core";

// const isChrome = navigator.userAgent.includes("Chrome");s
const isFirefox = navigator.userAgent.includes("Firefox");

const EXTENSION_ID_DEFAULT_CHROME = "kpllpbalbkdcdoklbnjlbbbeapfhoodp";
const EXTENSION_ID_DEFAULT_FF = "checkmyva@openinc.dev";

const EXTENSION_ID_DEFAULT = isFirefox
  ? EXTENSION_ID_DEFAULT_FF
  : EXTENSION_ID_DEFAULT_CHROME;

// Example: window.localStorage.setItem("checkmyva.EXTENSION_ID", "xxx")

const EXTENSION_ID_LS_KEY = "checkmyva.EXTENSION_ID";
const EXTENSION_ID_LS_VAL = window.localStorage.getItem(EXTENSION_ID_LS_KEY);

export const EXTENSION_ID = EXTENSION_ID_LS_VAL || EXTENSION_ID_DEFAULT;

export const EXTENSION_SHOP_MSG = isFirefox
  ? "Es konnte keine Verbindung zu dem CheckMyVA Browser Add-On hergestellt werden. Wollen Sie das Add-On kostenlos herunterladen?"
  : "Es konnte keine Verbindung zu der CheckMyVA Browser Erweiterung hergestellt werden. Wollen Sie diese kostenlos aus dem Chrome Store laden?";

export const EXTENSION_SHOP_URL = isFirefox
  ? "https://addons.mozilla.org/de/firefox/addon/checkmyva/"
  : "https://chrome.google.com/webstore/detail/checkmyva-browser-erweite/kpllpbalbkdcdoklbnjlbbbeapfhoodp";

console.log(EXTENSION_ID_LS_KEY, EXTENSION_ID);

let MESSAGE_IDS = 1;
const MESSAGES = new Map<string, (response: any) => void>();

window.addEventListener(
  "message",
  (event) => {
    // if (event.source === window) return;

    const { action, messageId, response } = event.data || {};

    if (messageId && action === "external-fallback-response") {
      console.log(
        `[web] external-fallback-response (${messageId}): `,
        response
      );

      const resolve = MESSAGES.get(messageId);

      if (resolve) {
        resolve(response);
      }
    }
  },
  false
);

async function sendMessageToExtension<T = any>(
  type: "validate" | "fetch-items" | "fetch-values",
  data: any = {}
): Promise<T> {
  // @ts-ignore
  const browser = window.browser || window.chrome || null;

  // if (!browser?.runtime?.sendMessage) {
  //   // fallback for Firefox..

  return new Promise((resolve, reject) => {
    const action = "external-fallback-request";
    const messageId = "" + MESSAGE_IDS++;

    console.log(`[web] external-fallback-request (${messageId}): `, type);

    window.postMessage({ action, messageId, type, ...data }, "*");

    MESSAGES.set(messageId, resolve);

    setTimeout(() => {
      reject(new Error("window.postMessage() timeout"));

      MESSAGES.delete(messageId);
    }, 10000);
  });
  // } else {
  // return new Promise((resolve, reject) => {
  //   let timeout = false;

  //   browser.runtime.sendMessage(EXTENSION_ID, { type, ...data }, (response) => {
  //     if (!timeout) {
  //       console.log("sendMessage response", type, response);
  //       resolve(response);
  //     }
  //   });
  //   setTimeout(() => {
  //     //   console.log("sendMessage response timeout", type);
  //     timeout = true;
  //     reject(new Error("browser.runtime.sendMessage() timeout"));
  //   }, 10000);
  // });
  // }
}

export async function validateConnection() {
  try {
    return !!(await sendMessageToExtension<boolean>("validate"));
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchItems() {
  return await sendMessageToExtension<DataItemInterface[]>("fetch-items");
}

export async function fetchValues(id: string, start: number, end: number) {
  const rows = await sendMessageToExtension<DataItemValueInterface[]>(
    "fetch-values",
    { id, start, end }
  );

  // TODO: Sollte in Browser Erweiterung stattfinden..
  for (const row of rows) {
    row.value[0] = row.value[0]
      .toString()
      .toLowerCase()
      .replaceAll('"', "")
      .trim()
      .replace(/^(alexa)/, "")
      .trim()
      .replaceAll("  ", " ");
  }

  return rows.filter((row) => row.value[0] !== "");
}
