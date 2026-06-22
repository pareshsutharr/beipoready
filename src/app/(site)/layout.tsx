import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteAlert from "@/components/sections/SiteAlert";
import { getActiveSiteAlert } from "@/lib/cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banner, popup] = await Promise.all([
    getActiveSiteAlert("banner"),
    getActiveSiteAlert("popup"),
  ]);

  return (
    <>
      <SiteAlert banner={banner} popup={popup} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
