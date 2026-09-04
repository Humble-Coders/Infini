import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/sections/home/HomePage";

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata();
}

export default function Home() {
  return <HomePage />;
}
