import Head from "next/head";

interface PageHeadProps {
  title: string;
}

export default function PageHead({ title }: PageHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favico.png" />
    </Head>
  );
}
