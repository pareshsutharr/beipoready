import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteAlert from "@/components/sections/SiteAlert";
import { getActiveSiteAlert, getNewsAlertItems } from "@/lib/cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banner, popup, newsAlertItems] = await Promise.all([
    getActiveSiteAlert("banner"),
    getActiveSiteAlert("popup"),
    getNewsAlertItems(),
  ]);

  return (
    <>
      <SiteAlert banner={banner} popup={popup} />
      <Header newsAlertItems={newsAlertItems} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
