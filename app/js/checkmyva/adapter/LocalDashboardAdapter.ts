import {
  DashboardInterface,
  WidgetInterface,
  UserInterface,
  MonitoringAdapterInterface,
  MonitoringAdapterContext,
  AlarmInterface,
  equals,
  SourceInterface,
  WidgetPresetInterface,
} from "@opendash/core";

interface AdapterOptions {
  defaultDashboards: DashboardInterface[];
  defaultWidgets: WidgetInterface[];
}

export class LocalDashboardAdapter implements MonitoringAdapterInterface {
  private context: MonitoringAdapterContext;

  private options: AdapterOptions;

  constructor(options: Partial<AdapterOptions> = {}) {
    this.options = Object.assign(
      {
        defaultDashboards: [],
        defaultWidgets: [],
      },
      options
    );

    // this.setDashboards([]);
    // this.setWidgets([]);
  }

  onContext(context: MonitoringAdapterContext) {
    this.context = context;

    this.init();
  }

  onUser(user: UserInterface) {
    this.init();
  }

  private async init() {
    this.context.setDashboards(await this.getDashboards());
    this.context.setWidgets(Object.values(await this.getWidgets()));
    this.context.setLoading(false);
  }

  async createDashboard(input: DashboardInterface) {
    // console.log("DashboardAdapter.createDashboard()", JSON.stringify(input));

    await timeout();

    try {
      const id = uuid();

      const dashboard = {
        id,
        widgets: input.widgets || [],
        ...input,
      };

      const dashboards = await this.getDashboards();

      await this.setDashboards([...dashboards, dashboard]);

      this.context.updateDashboard(id, dashboard);

      return dashboard.id;
    } catch (error) {
      console.error(error);
    }
  }

  async updateDashboard(input: DashboardInterface) {
    // console.log("DashboardAdapter.updateDashboard()", JSON.stringify(input));

    try {
      const dashboards = await this.getDashboards();

      const dashboard = dashboards.find((o) => o.id === input.id);

      if (
        JSON.stringify(dashboard, null, 2) === JSON.stringify(input, null, 2)
      ) {
        return;
      }

      const newDashboards = dashboards.filter(
        (dashboard) => dashboard.id !== input.id
      );
      const newDashboard = Object.assign({}, dashboard, input);

      newDashboards.push(newDashboard);

      await this.setDashboards(newDashboards);

      await timeout(5000);

      this.context.updateDashboard(newDashboard.id, newDashboard);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteDashboard(input: DashboardInterface): Promise<void> {
    // console.log("DashboardAdapter.deleteDashboard()", JSON.stringify(input));

    await timeout();

    try {
      const dashboards = await this.getDashboards();

      const dashboardsFiltered = dashboards.filter(
        (dashboard) => dashboard.id !== input.id
      );

      await this.setDashboards(dashboardsFiltered);

      this.context.updateDashboard(input.id, undefined);
    } catch (error) {
      console.error(error);
    }
  }

  async createWidget(input: WidgetInterface) {
    // console.log("DashboardAdapter.createWidget()", JSON.stringify(input));

    await timeout();

    try {
      const id = uuid();

      const widget = {
        id,
        ...input,
      };

      const widgets = await this.getWidgets();

      widgets[id] = widget;

      await this.setWidgets(widgets);

      this.context.updateWidget(id, widget);

      return widget.id;
    } catch (error) {
      console.error(error);
    }
  }

  async updateWidget(input: WidgetInterface) {
    // console.log("DashboardAdapter.updateWidget()", JSON.stringify(input));

    await timeout();

    try {
      const widgets = await this.getWidgets();

      widgets[input.id] = input;

      this.context.updateWidget(input.id, input);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteWidget(input: WidgetInterface): Promise<void> {
    // console.log("DashboardAdapter.deleteWidget()", JSON.stringify(input));

    await timeout();

    try {
      const widgets = await this.getWidgets();

      delete widgets[input.id];

      await this.setWidgets(widgets);

      this.context.updateWidget(input.id, undefined);
    } catch (error) {
      console.error(error);
    }
  }

  private async getDashboards() {
    const jsonString = window.localStorage.getItem("opendashLocalDashboards");

    // console.log("getDashboards", jsonString);

    return JSON.parse(jsonString) || this.options.defaultDashboards;
  }

  private async setDashboards(dashboards: DashboardInterface[]) {
    return window.localStorage.setItem(
      "opendashLocalDashboards",
      JSON.stringify(dashboards)
    );
  }

  private async getWidgets(): Promise<Record<string, WidgetInterface>> {
    const jsonString = window.localStorage.getItem("opendashLocalWidgets");

    // console.log("getWidgets", jsonString);

    const widgets = JSON.parse(jsonString) || this.options.defaultWidgets;

    if (Array.isArray(widgets)) {
      return Object.fromEntries(widgets.map((widget) => [widget.id, widget]));
    }

    return widgets;
  }

  private async setWidgets(widgets: Record<string, WidgetInterface>) {
    // console.log("setWidgets", JSON.stringify(widgets, null, 2));
    return window.localStorage.setItem(
      "opendashLocalWidgets",
      JSON.stringify(widgets)
    );
  }

  async createAlarm(alarm: Omit<AlarmInterface, "id">): Promise<string> {
    return "";
  }
  async updateAlarm(alarm: AlarmInterface): Promise<void> {}

  async deleteAlarm(alarm: AlarmInterface): Promise<void> {}

  async openDashboardSharingDialog(
    dashboard: DashboardInterface
  ): Promise<boolean> {
    return false;
  }

  async openWidgetSharingDialog(
    dashboard: WidgetInterface<any>
  ): Promise<boolean> {
    return false;
  }

  async createWidgetPreset(
    preset: Omit<
      WidgetPresetInterface,
      "id" | "isOwner" | "isShared" | "isReadOnly"
    >
  ): Promise<string> {
    return "";
  }

  async updateWidgetPreset(preset: WidgetPresetInterface): Promise<void> {}

  async deleteWidgetPreset(preset: WidgetPresetInterface): Promise<void> {}

  async openWidgetPresetSharingDialog(
    preset: WidgetPresetInterface
  ): Promise<boolean> {
    return false;
  }

  onSource(source: SourceInterface, descendents: SourceInterface[]) {}
}

function uuid(a?): string {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : // @ts-ignore
      ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

async function timeout(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
