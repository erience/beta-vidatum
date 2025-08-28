import { Geist, Geist_Mono, Karla } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import UnauthorizedRedirectListener from "@/utils/UnauthorizedRedirectListener";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const karla = Karla({ subsets: ["latin"] });

export const metadata = {
  title: "Vidatum Solution Private Limited",
  description: "Vidatum Solution Private Limited",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Wrap AppLayout here */}
        <AuthProvider>
          <UnauthorizedRedirectListener />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
