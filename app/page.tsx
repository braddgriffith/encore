import type { Metadata } from "next";
import { DiscoverScreen } from "@/components/DiscoverScreen";

export const metadata: Metadata = {
  title: "Discover",
};

export default function Page() {
  return <DiscoverScreen />;
}
