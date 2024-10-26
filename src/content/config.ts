import { defineCollection, z } from "astro:content";

const food = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number(),
    title: z.string(),
    instructions: z.string(),
    thumbnail: z.string().url(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  food,
};
