"use client"

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div onClick={() => router.prefetch("/")} className="h-screen flex items-center justify-center">
      <div className="min-w-[400px] min-h-[300px] md:min-h-[500px] flex items-center justify-center flex-col gap-y-3 md:min-w-3xl bg-green-600">
        <h1 className="text-center font-extrabold text-2xl md:text-5xl ">Logic Logic Logic</h1>
        <button onClick={() => router.push("/findPartner")} className="text-2xl rounded-2xl bg-black p-2 cursor-pointer text-green-300 border-t-2 border-r-2 shadow-2xl shadow-green-400">
          Click Here  
        </button>
      </div>

    </div>
  );
}
