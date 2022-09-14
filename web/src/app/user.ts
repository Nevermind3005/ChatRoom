export interface UserSignUp {
  username: string;
  email: string;
  password: string;
}

export interface UserSignIn {
  email: string;
  password: string;
}

export class User {
  username!: string;
  email!: string;
  userImage!: string;
}
