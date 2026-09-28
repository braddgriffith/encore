import type { Metadata } from "next";
import { WeekScreen } from "@/components/WeekScreen";

export const metadata: Metadata = {
  title: "Week",
};

export default function Page() {
  return <WeekScreen />;
}
