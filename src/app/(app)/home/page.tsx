import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse greeting card templates and create your personalized wish",
};

export default function HomePage() {
  return <HomeClient />;
}
