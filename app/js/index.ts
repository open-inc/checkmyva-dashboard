// @ts-check

import "antd/dist/antd.min.css";

import {
  init,
  StorageAdapterLS,
  WidgetInterface,
  WidgetTypeInterface,
} from "@opendash/core";
import { registerIconPack } from "@opendash/icons";

import { DataAdapter } from "./checkmyva/adapter/DataAdapter";
import { LocalUserAdapter } from "./checkmyva/adapter/LocalUserAdapter";
import { LocalSourceAdapter } from "./checkmyva/adapter/LocalSourceAdapter";
import { LocalDashboardAdapter } from "./checkmyva/adapter/LocalDashboardAdapter";
import { LocalNavigationAdapter } from "./checkmyva/adapter/LocalNavigationAdapter";

import "./highcharts.config";
import "./parse.config";
import {
  validateConnection,
  EXTENSION_SHOP_MSG,
  EXTENSION_SHOP_URL,
} from "./checkmyva/extension";

import { AppGlobals } from "./checkmyva/components/AppGlobals";

import { runUpdate } from "./checkmyva/update";

setTimeout(main, 1000);

async function main() {
  const valid = await validateConnection();

  console.log("no connection to extension, valid =", valid);

  if (!valid) {
    if (window.confirm(EXTENSION_SHOP_MSG)) {
      if (EXTENSION_SHOP_URL) {
        window.location.href = EXTENSION_SHOP_URL;
      } else {
        window.alert(
          "Leider ist die Erweiterung momentan nicht öffentlich verfügbar."
        );
      }
    }

    return;
  }

  await runUpdate();

  init("opendash", async (factory) => {
    // Logo:
    // factory.ui.setLogoLink("/");
    // factory.ui.setLogoLinkExternal(true);
    // factory.ui.setLogoImage(require("../assets/greis.png"));
    factory.ui.disableFooter();

    factory.registerGlobalComponent(AppGlobals);

    // Translations:
    // factory.registerLanguage("en", "English");
    factory.registerLanguage("de", "Deutsch");

    // @ts-ignore
    registerIconPack(await import("@opendash/icons/dist/fa-regular.json"));

    factory.registerTranslationResolver(
      "en",
      "parse-custom",
      // @ts-ignore
      async (language) => await import("./translations/parse-custom_en")
    );

    factory.registerTranslationResolver(
      "en",
      "table",
      // @ts-ignore
      async (language) => await import("./translations/table_en")
    );

    factory.registerTranslationResolver(
      "de",
      "table",
      // @ts-ignore
      async (language) => await import("./translations/table_en")
    );

    factory.registerTranslationResolver(
      "en",
      "checkmyva",
      // @ts-ignore
      async (language) => await import("./checkmyva/translations/de")
    );

    factory.registerTranslationResolver(
      "de",
      "checkmyva",
      // @ts-ignore
      async (language) => await import("./checkmyva/translations/de")
    );

    factory.registerAntDesignTranslation(
      "en",
      () => import("antd/lib/locale/en_US")
    );

    factory.registerAntDesignTranslation(
      "de",
      () => import("antd/lib/locale/de_DE")
    );

    // Routing

    factory.registerRoute({
      path: "/",
      redirectPath: "/monitoring/dashboards",
    });

    // Adapter + Plugins

    factory.registerDataAdapter(new DataAdapter());
    factory.registerDeviceStorageAdapter(
      new StorageAdapterLS({ scope: "dev" })
    );
    factory.registerUserStorageAdapter(new StorageAdapterLS({ scope: "user" }));

    factory.registerUserAdapter(new LocalUserAdapter());
    factory.registerSourceAdapter(
      new LocalSourceAdapter({
        sources: [
          {
            id: "checkmyva",
            tag: "checkmyva",
            name: "CheckMyVA",
            meta: {},
            parent: null,
          },
          {
            id: "checkmyva-categories",
            tag: "checkmyva-categories",
            name: "CheckMyVA (Categories)",
            meta: {},
            parent: null,
          },
        ],
      })
    );

    const widgets = [
      {
        id: "widget-checkmyva-categories",
        type: "opendash-widget-checkmyva-categories",
        layout: {
          w: 12,
          h: 6,
          x: 12,
          y: 0,
        },
        config: {
          _history: {
            historyType: "relative",
            unit: "year",
            value: 1,
          },
        },
      },
      {
        id: "widget-2",
        type: "opendash-widget-checkmyva-timeseries",
        layout: {
          w: 16,
          h: 9,
          x: 0,
          y: 6,
        },
        config: {
          _sources: [],
          _items: [],
          _dimensions: [
            ["checkmyva", "checkmyva.alexa.takeout", 0],
            ["checkmyva", "checkmyva.google.takeout", 0],
          ],
          _history: {
            live: false,
            historyType: "relative",
            value: 3,
            unit: "month",
            aggregation: false,
          },
        },
      },
      {
        id: "widget-3",
        type: "opendash-widget-checkmyva-wordcount",
        layout: {
          w: 6,
          h: 6,
          x: 6,
          y: 0,
        },
        config: {
          _history: {
            historyType: "relative",
            unit: "year",
            value: 1,
          },
        },
      },
      {
        id: "widget-4",
        type: "opendash-widget-checkmyva-category-stats",
        layout: {
          w: 8,
          h: 9,
          x: 16,
          y: 6,
        },
        config: {
          _history: {
            historyType: "relative",
            unit: "year",
            value: 1,
          },
        },
      },
      {
        id: "widget-5",
        type: "opendash-widget-checkmyva-wordcount",
        layout: {
          w: 6,
          h: 6,
          x: 0,
          y: 0,
          moved: false,
          static: false,
        },
        config: {
          _history: {
            historyType: "relative",
            unit: "year",
            value: 1,
          },
          type: "word",
        },
      },
    ];

    const widgetsML = [
      "opendash-widget-ml-advertisement",
      "opendash-widget-ml-health",
      "opendash-widget-ml-household",
      "opendash-widget-ml-noise",
      "opendash-widget-ml-politeness",
      "opendash-widget-ml-profiling",
      "opendash-widget-ml-sentiment",
    ].map((type, i) => {
      return {
        id: type,
        type,
        layout: {
          w: 24,
          h: 6,
          x: 0,
          y: i * 6,
          moved: false,
          static: false,
        },
        config: {},
      };
    });

    factory.registerMonitoringAdapter(
      new LocalDashboardAdapter({
        defaultDashboards: [
          {
            id: "default-dashboard",
            widgets: widgets.map((widget) => widget.id),
            name: "Home",
            source: "checkmyva",
            heroWidget: undefined,
            isOwner: true,
            isReadOnly: false,
            isShared: false,
            type: "grid",
            layout: widgets.map((widget) => ({
              i: widget.id,
              ...widget.layout,
            })),
          },
          {
            id: "ml-dashboard",
            widgets: widgetsML.map((widget) => widget.id),
            name: "ML Dashboard",
            source: "checkmyva",
            heroWidget: undefined,
            isOwner: true,
            isReadOnly: false,
            isShared: false,
            type: "grid",
            layout: widgets.map((widget) => ({
              i: widget.id,
              ...widget.layout,
            })),
          },
        ],
        defaultWidgets: [...widgets, ...widgetsML].map((widget) => ({
          id: widget.id,
          type: widget.type,
          name: "",
          config: widget.config,
        })),
      })
    );
    factory.registerNavigationAdapter(new LocalNavigationAdapter());

    // factory.use(
    //   new OpenwarePlugin({
    //     secure: true,
    //     host: "odv3.kompetenzzentrum-siegen.digital",
    //   })
    // );

    // Widgets

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-categories")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-timeseries")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-category-timeseries")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-category-device-stats")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-category-stats")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-device-stats")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-wordcount")
    );

    factory.registerWidget(
      await import("./checkmyva/widgets/checkmyva-heatmap")
    );

    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-advertisement").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-health").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-household").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-noise").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-politeness").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-profiling").default
    );
    factory.registerWidget(
      require("./checkmyva/widgets/checkmyva-ml-sentiment").default
    );

    // factory.registerWidget(await import("./widgets/table"));

    // Routing:

    // factory.registerRoute({
    //   path: "/route/to/*",
    //   component: () => import("./path/to/component")
    // });

    // Navigation:

    // factory.registerStaticNavigationGroup({
    //   id: "admin/parse",
    //   label: "openware:admin.label",
    //   order: 20,
    // });

    // factory.registerStaticNavigationItem({
    //   id: "default",
    //   group: "admin/parse",
    //   place: "sidebar",
    //   order: 10,

    //   label: "openware:admin.classes.roles.label",
    //   // icon: "string",
    //   // color: "string",

    //   link: "/",
    //   // event: "string",

    //   routeCondition: "**/*",
    //   activeCondition: "/",
    // });
  }).then(async (app) => {
    // @ts-ignore
    // window.app = app;

    const { DataService } = app.services;

    await DataService.wait();
  });
}
