import { HomeStaffRoster } from "@/components/home/HomeStaffRoster";

/** Uzman kadro sayfası. */
export function ExpertsPage() {
  return (
    <div className="w-full max-w-full overflow-x-clip">
      <HomeStaffRoster showIntro={false} compact pageTitle="Uzmanlarımız" />
    </div>
  );
}
