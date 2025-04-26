import { Tajawal } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: "700",
});

export const metadata = {
  title: "MedSupply Connect",
  description:
    "MedSupply Connect is the smart solution that connects pharmaceutical companies with pharmacies by automatically and regularly generating orders based on market demand — ensuring medications are always available without delays or shortages.",
  keywords: ["MedSupply Connect", "E-commerce", "MedSupply"],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl">
      <body className={tajawal.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
