export default function Home() {

  return (
    <div className="w-full h-full">

      <main className="bg-[rgb(139,197,238)] min-h-screen pt-20 relative">

        <div className="absolute top-10 left-10 w-52 h-60 bg-[#298dd4]  rounded-full opacity-60 blur-[50px] pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-[#298dd4] rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-[#298dd4] rounded-full opacity-60 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#298dd4] rounded-full opacity-30 blur-[45px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-52 h-32 bg-[#298dd4] rounded-md opacity-40 blur-[50px] pointer-events-none" style={{transform: 'translateY(-50%)'}} />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-lg z-10 pointer-events-none" />

        <div className="z-20 relative">
          <h1 className="text-4xl font-medium tracking-tight text-blue-900">Testing</h1>
        </div>
      </main>

      <section className="bg-gray-100 min-h-screen">
        <h1> Next skibidi section</h1>
      </section>

    </div>
  );
}
