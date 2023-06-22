import {
  SourceInterface,
  UserInterface,
  SourceAdapterInterface,
  SourceAdapterContext,
} from "@opendash/core";

interface AdapterOptions {
  sources: SourceInterface[];
}

export class LocalSourceAdapter implements SourceAdapterInterface {
  private context: SourceAdapterContext;

  private options: AdapterOptions;

  constructor(options: AdapterOptions) {
    this.options = options;
  }

  onContext(context: SourceAdapterContext) {
    this.context = context;

    this.init();
  }

  onUser(user: UserInterface) {
    this.init();
  }

  private async init() {
    this.context.setSources(this.options.sources);
    this.context.setLoading(false);
  }
}
