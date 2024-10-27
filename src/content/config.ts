import { defineCollection, z } from "astro:content";

const food = defineCollection({
  schema: z.object({
    id: z.number(),
    title: z.string(),
    instructions: z.string(),
    thumbnail: z.string().url(),
    tags: z.array(z.string()).optional(),
  }),
});

const apiFood = defineCollection({
  loader: async () => {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/filter.php?a=British"
    );
    const data = await response.json();
    const foodData = await Promise.all(
      data.meals.map(async (meal: any) => {
        const mealRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const mealData = await mealRes.json();
        return mealData.meals[0];
      })
    );

    return foodData.map((meal) => ({
      id: meal.idMeal,
      ...meal,
    }));
  },
  schema: z
    .object({
      // api structure
      idMeal: z.string(),
      strMeal: z.string(),
      strInstructions: z.string(),
      strMealThumb: z.string().url(),
      strTags: z.string().or(z.null()),
    })
    .transform((data) => ({
      id: Number(data.idMeal),
      title: data.strMeal,
      instructions: data.strInstructions,
      thumbnail: data.strMealThumb,
      tags: data.strTags ? data.strTags.split(",") : undefined,
    })),
});

export const collections = {
  food,
  apiFood,
};
