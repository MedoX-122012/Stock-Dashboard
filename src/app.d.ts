// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').User | null;
      userId: string | null;
    }
  }
}

export {};
