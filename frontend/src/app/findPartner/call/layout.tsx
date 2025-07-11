export default function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div>
            <nav className="w-full bg-emerald-950 text-gray-500 font-bold text-xl text-center ">Congratulations you made it finally</nav>
            {children}
        </div>
    )
}