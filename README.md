## Installing and Building

You will need Node (v14) and Yarn (v1) and run the yarn install command:

```
yarn
```

To start a development web server which listens on port 8080 and listens for code changes to rebuild the website run the command

```
yarn start
```

To create a production deployment, which will end up in the ./dist folder, run the command.

```
yarn build
```

Put the content of the `./dist` folder on a web server, make sure to have a not-found fallback on `index.html` to allow client side routing.

In general deployments will be done by our CI, so you don't need to deploy it manually.

## Development

For development you will need either a working development version of the CheckMyVA Browser Extension or install it from the Firefox/Chrome Store:

- https://addons.mozilla.org/de/firefox/addon/checkmyva/
- https://chrome.google.com/webstore/detail/checkmyva-browser-erweite/kpllpbalbkdcdoklbnjlbbbeapfhoodp

You will need to import some data to the extension. You can create your own Google Takeout/Amazon Alexa Data Export or contact someone from the CheckMyVA Team to get a sample.

If you use a Chrome based browser and a development version of the Browser Extension, chances are that you will end up with a diffrent extension key. First right-click on the extension icon, select 'Options' and you will endup on a URL which looks like this one: `chrome://extensions/?options=xxx` but with a key instead of `xxx`. Copy the key and go to the browser console on `http://localhost:8080` and run the following command:

```js
// replace "xxx" with your browser extension key
window.localStorage.setItem("checkmyva.EXTENSION_ID", "xxx");
```

### Widgets

CheckMyVA specific widgets are located in the `app/js/checkmyva/widgets` folder. To create a new folder, copy the folder of an existing widget, make sure to give it a fitting name and update the `type` property in the `index.ts` file.

Please use translation where ever possible and update the translation file in `app/js/checkmyva/translations/de.ts`.

Example `timeseries`:

- It's located in the `app/js/checkmyva/widgets/checkmyva-timeseries` folder
- The type property is `opendash-widget-checkmyva-timeseries`
- Translations use the `checkmyva:widget.timeseries.xxx` namespace

Each widget has the following files:

- `index.ts` - For configuration and as an entrypoint
- `types.ts` - For widget specific typings, especially for typings of the widget config
- `component.ts` - The React component which will render the widget in the dashboard view
- `settings.ts` - (optionally) The React component which will render the settings dialog
