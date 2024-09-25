import Index from "@/components/Dashboard";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata ={
    title: 'DrugXpert: A leading research plataform for drug Dicovery',
    description: 'This is a description for the plataform'
}

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Index/>
      </DefaultLayout>
    </>
  );
}
