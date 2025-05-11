import { Tajawal } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientWrapper from "./_components/ClientWrapper";

// إعداد الخط
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata = {
  title: "MedSupply Connect",
  description:
    "MedSupply Connect is the smart solution that connects pharmaceutical companies with pharmacies...",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <head>
          <meta
            name="format-detection"
            content="telephone=no, date=no, email=no, address=no"
          />
        </head>
        <body className={`${tajawal.variable} font-tajawal min-h-screen`}suppressHydrationWarning={true}>
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
