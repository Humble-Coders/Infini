import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/sections/home/HomePage";

/** Duplicate of / for colour comparison — never indexed. */
export async function generateMetadata(): Promise<Metadata> {
  const base = await homeMetadata();
  return { ...base, title: `${base.title} (blue variant)`, robots: { index: false, follow: false } };
}

export default function BlueHome() {
  return <HomePage />;
}
