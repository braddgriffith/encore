import type { Metadata } from "next";
import { TextScreen } from "@/components/TextScreen";

export const metadata: Metadata = {
  title: "Text",
};

export default function Page() {
  return <TextScreen />;
}
