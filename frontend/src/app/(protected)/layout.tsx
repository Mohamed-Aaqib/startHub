import NavBar from "@/components/protectedRoutes/NavBar";

export default async function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div className="">
            <main className="min-h-screen">
                {children}
            </main>
            <NavBar/>
        </div>
    )
}