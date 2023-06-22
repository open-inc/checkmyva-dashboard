import {
  UserInterface,
  NavigationGroupInterface,
  NavigationItemInterface,
  NavigationAdapterContext,
  NavigationAdapterInterface,
} from "@opendash/core";

interface AdapterOptions {
  navigationGroups: NavigationGroupInterface[];
  navigationItems: NavigationItemInterface[];
}

export class LocalNavigationAdapter implements NavigationAdapterInterface {
  private context: NavigationAdapterContext;

  private options: AdapterOptions;

  constructor(options?: Partial<AdapterOptions>) {
    this.options = Object.assign(
      {
        navigationGroups: [],
        navigationItems: [],
      },
      options
    );
  }

  onContext(context: NavigationAdapterContext) {
    this.context = context;

    this.init();
  }

  onUser(user: UserInterface) {
    this.init();
  }

  private async init() {
    this.context.setNavigationGroups(this.options.navigationGroups);
    this.context.setNavigationItems(this.options.navigationItems);
    this.context.setLoading(false);
  }

  async createNavigationGroup(input: NavigationGroupInterface) {
    // todo

    return "";
  }

  async updateNavigationGroup(input: NavigationGroupInterface) {
    // todo
  }

  async deleteNavigationGroup(input: NavigationGroupInterface) {
    // todo
  }

  async createNavigationItem(input: NavigationItemInterface) {
    // todo

    return "";
  }

  async updateNavigationItem(input: NavigationItemInterface) {
    // todo
  }

  async deleteNavigationItem(input: NavigationItemInterface) {
    // todo
  }
}
