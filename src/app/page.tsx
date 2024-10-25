"use client"; 

import Index from "@/components/Dashboard";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Home() {
  return (
    <HelmetProvider>
      <DefaultLayout>
        <Helmet>
          <title>DrugXpert | Home</title>
          <meta
            name="description"
            content="This is Next.js Home for TailAdmin Dashboard Template"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <Index />
      </DefaultLayout>
    </HelmetProvider>
  );
}
