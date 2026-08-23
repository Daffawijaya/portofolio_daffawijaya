import Head from "next/head";

interface PageHeadProps {
  title: string;
  description?: string;
  path?: string; // untuk canonical per halaman, mis. "/about"
  noindex?: boolean; // sembunyikan dari mesin pencari (admin)
}

const SITE = "https://daffayanwijaya.vercel.app";

export default function PageHead({ title, description, path, noindex }: PageHeadProps) {
  const url = SITE + (path ?? "");
  return (
    <Head>
      <title>{title}</title>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <link rel="icon" href="/favico.png" />
    </Head>
  );
}
