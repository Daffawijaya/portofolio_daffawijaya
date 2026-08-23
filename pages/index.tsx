import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PageHead from "../components/PageHead";

export default function Home() {
  return (
    <>
      <PageHead title="Daffa Wijaya" />

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
            className="bg-[url('/dafaaalogo2i2.png')] dark:bg-[url('/dafaaalogo2.png')] relative lg:h-[290px] lg:w-[400px] sm:h-[220px] sm:w-[300px] bg-cover h-[180px] w-[240px] mr-[15%]"
          />
        </div>
      </main>

      <ThemeSwitcher />
    </>
  );
}
