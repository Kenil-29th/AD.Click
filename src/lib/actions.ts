"use server";

import { z } from "zod";

// Server action equivalent of the original createServerFn example.
// Invoked from client components via: const result = await getGreeting({ name: "Ada" })

const greetingSchema = z.object({ name: z.string().min(1) });

export async function getGreeting(input: z.infer<typeof greetingSchema>) {
  const validated = greetingSchema.parse(input);
  return {
    greeting: `Hello, ${validated.name}!`,
    mode: process.env.NODE_ENV ?? "unknown",
  };
}
