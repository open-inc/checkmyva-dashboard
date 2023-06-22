import Parse from "parse";

export interface _UserAttributes {
  username?: string;
  password?: string;
  email?: string;
  emailVerified?: boolean;
  authData?: any;
}

export type _User = Parse.User<_UserAttributes>;
