import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

export async function getMeals() {
  const dp = sql("meals.dp");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return dp.prepare("SELECT * FROM meals").all();
}

export async function getMeal(slug) {
  return dp.prepare("SELECT * FROM meals WHERE slug = ?".get(slug));
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instruction = xss(meal.instruction);

  const extension = meal.image.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(
    Buffer.from(bufferedImage, (error) => {
      if (error) {
        throw new Error("Saving image failed");
      }
    })
  );
  meal.image = `/images/${fileName}`;

  dp.prepare(
    `INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug) VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
      )
      `
  ).run(meal);
}
