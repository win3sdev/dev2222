import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  interface Session {
    user: User;
  }

  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
}
