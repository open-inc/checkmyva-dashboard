import {
  AuthPayloadInterface,
  UserInterface,
  UserAdapterContext,
  UserAdapterInterface,
} from "@opendash/core";

interface AdapterOptions {
  user: UserInterface;
}

export class LocalUserAdapter implements UserAdapterInterface {
  private context: UserAdapterContext;
  private user: UserInterface;

  constructor(options?: Partial<AdapterOptions>) {
    this.user = options?.user || {
      id: "anonymous",
      username: "anonymous",
      name: "Anonymous",
      email: "anonymous@openinc.dev",
      session: "xxx",
    };
  }
  onContext(context: UserAdapterContext) {
    this.context = context;

    this.init();
  }

  private async init() {
    try {
      this.context.setCurrentUser(this.user);

      this.context.setLoading(false);
      this.context.setValidated(true);
      this.context.setOffline(false);
    } catch (error) {
      console.error(error);
      this.context.setCurrentUser(undefined);

      this.context.setLoading(false);
      this.context.setValidated(false);
      this.context.setOffline(false);
    }
  }

  async login(payload: AuthPayloadInterface) {
    await this.init();
  }

  async register(payload: AuthPayloadInterface) {
    await this.init();
  }

  async logout() {
    window.localStorage.clear();
    window.location.reload();
  }
}
