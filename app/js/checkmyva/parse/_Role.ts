import Parse from "parse";

import { _User } from "./_User";

export interface _RoleAttributes {
  name?: string;
  users?: Parse.Relation<_User>;
  roles?: Parse.Relation<_Role>;
}

export type _Role = Parse.Role<_RoleAttributes>;
