import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PageHead from "../components/PageHead";
import { getSettings, REVALIDATE } from "../lib/content";

export default function Home({ position }: { position: string }) {
  return (
    <>
      <PageHead
        title="Daffa Yan Wijaya - Fullstack & Mobile Developer"
        description="Portfolio resmi Daffa Yan Wijaya (Daffa Wijaya, daffayanwijaya), fullstack & mobile developer di Malang, Indonesia. Membangun aplikasi web & mobile yang responsif dan user-friendly."
        path="/"
      />

      <h1 className="sr-only">
        Daffa Yan Wijaya - Fullstack &amp; Mobile Developer
      </h1>

      <main className="h-screen flex fixed w-[15%] h-full z-50">
        <Sidebar />
      </main>

      <main className="w-[85%] h-screen bg-black flex ml-[15%]">
        <div className="absolute inset-0 w-screen z-0 h-full dark:md:bg-[url('/bgl.png')] dark:bg-[url('/bgv.png')] md:bg-[url('/bgli.png')] bg-[url('/bgvi.png')] bg-cover bg-center">
          <div className="absolute dark:backdrop-brightness-[0.3] h-full w-full" />
        </div>

        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 0, opacity: 1 }}
            transition={{ delay: 0, duration: 1 }}
            className="relative flex flex-col items-center mr-[15%]"
          >
            <div className="bg-[url('/daaa.png')] lg:h-[240px] lg:w-[400px] sm:h-[180px] sm:w-[300px] bg-contain bg-center bg-no-repeat h-[145px] w-[240px]" />
            <p className="font-hazard text-black dark:text-white text-[1.2rem] lg:text-[2.3rem] -mt-1">
              {position}
            </p>
          </motion.div>
        </div>
      </main>

      <ThemeSwitcher />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { position: (await getSettings()).position },
    revalidate: REVALIDATE,
  };
}
