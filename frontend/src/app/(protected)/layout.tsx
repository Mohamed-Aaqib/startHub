import HelperBar from "@/components/protectedRoutes/HelperBar";
import NavBar from "@/components/protectedRoutes/NavBar";

export default async function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex flex-row overflow-y-hidden">
            <main className="min-h-screen flex-1">
                {children}
            </main>
            <HelperBar/>
            <NavBar/>
        </div>
    )
}