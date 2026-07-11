import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Tomorrow } from "@next/font/google";
import NextProgress from "nextjs-progressbar";
import { ThemeProvider } from "next-themes";

const tomorrow = Tomorrow({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "800", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <title>
          Daffa Yan Wijaya - Web Developer, IT Consultant & Digitalisasi UMKM
        </title>

        <meta
          name="description"
          content="Website resmi Daffa Yan Wijaya. Web Developer, IT Consultant, Digitalisasi UMKM, Next.js Developer, dan pengembang aplikasi EtamHub."
        />

        <meta
          name="keywords"
          content="Daffa Yan Wijaya, Daffa, Yan Wijaya, Web Developer Indonesia, Next.js Developer, React Developer, IT Consultant, Digitalisasi UMKM, EtamHub"
        />

        <meta name="author" content="Daffa Yan Wijaya" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        <link rel="canonical" href="https://daffayanwijaya.vercel.app" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Daffa Yan Wijaya - Web Developer & IT Consultant"
        />

        <meta
          property="og:description"
          content="Website resmi Daffa Yan Wijaya. Portfolio, proyek, pengalaman, dan layanan pengembangan web."
        />

        <meta property="og:url" content="https://daffayanwijaya.vercel.app" />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://daffayanwijaya.vercel.app/og-image.jpg"
        />

        <meta property="og:site_name" content="Daffa Yan Wijaya" />
        <meta property="og:locale" content="id_ID" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="Daffa Yan Wijaya - Web Developer" />

        <meta
          name="twitter:description"
          content="Website resmi Daffa Yan Wijaya."
        />

        <meta
          name="twitter:image"
          content="https://daffayanwijaya.vercel.app/og-image.jpg"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Daffa Yan Wijaya",
              url: "https://daffayanwijaya.vercel.app",
              image: "https://daffayanwijaya.vercel.app/profile.jpg",
              jobTitle: "Web Developer",
              description:
                "Web Developer, IT Consultant, dan Digitalisasi UMKM.",
              knowsAbout: [
                "Next.js",
                "React",
                "TypeScript",
                "Web Development",
                "Digitalisasi UMKM",
              ],
            }),
          }}
        />
      </Head>

      <main className={tomorrow.className}>
        <NextProgress color="#A3D800" height={2} />
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
