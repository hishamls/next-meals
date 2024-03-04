import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "../../components/meals/meals-grid";
import { getMeals } from "@/lib/meals";
import { Suspense } from "react";

export const metadata = {
  title: "all meals",
  description: "browse the delicious meals shared by our vibrant community,",
};

async function Meals() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}

export default function MealsPage(params) {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meal, created{" "}
          <span className={classes.highlight}>by you</span>
          <p>
            Choose your favorite recipe and cook it yourself. It is easy and fun
          </p>
          <p className={classes.cta}>
            <Link href="/meals/share">Share Your favorite recipe</Link>
          </p>
        </h1>
      </header>

      <main className={classes.main}>
        <Suspense
          fallback={<p className={classes.loading}>Fetching meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
