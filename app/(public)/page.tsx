import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/sections/home/HomePage";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata();
}

export default function Home() {
  return <HomePage />;
}
