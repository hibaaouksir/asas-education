import { UserRole } from "@/app/generated/prisma";

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
```

Sauvegarde et ferme.

---

## FICHIER 5 — Script pour créer le premier Admin (`src/lib/seed.ts`)

Ce fichier va créer ton premier compte administrateur :
```
notepad src/lib/seed.ts