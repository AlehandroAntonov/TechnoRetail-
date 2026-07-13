// Module augmentation for NextAuth.
//
// This file intentionally contains an `import` so it is treated as a *module*.
// That makes the `declare module` blocks below *augment* next-auth's types
// instead of replacing them. When these blocks live in a global script file
// (no import/export), TypeScript treats them as a full module replacement,
// which wipes out next-auth's real exports (NextAuthOptions, Account, the
// default NextAuth function, ...) and breaks the production type-check.
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
