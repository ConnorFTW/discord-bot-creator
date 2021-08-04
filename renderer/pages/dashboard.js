import Head from "next/head";
import { DashboardProvider } from "../components/dashboard/DashboardContext";
import DashboardWindow from "../components/dashboard/DashboardWindow";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Discord Bot Creator</title>
      </Head>
      <DashboardProvider>
        <DashboardWindow />
      </DashboardProvider>
    </>
  );
}
