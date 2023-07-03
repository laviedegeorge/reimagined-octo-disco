import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import classNames from "classnames";
const MainView = dynamic(() => import("../components/MainView"));
const Profile = dynamic(() => import("../components/Profile"), { ssr: false });

/** eslint-ignore react/react-in-jsx-scope */
export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" min-w-full min-h-screen relative">
        {/* @ts-ignore */}
        <Profile />
        <div className="flex flex-col items-center my-10">
          {/* @ts-ignore */}
          <MainView />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
