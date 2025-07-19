import Footer from "@/components/mainPage/Footer"
import NavBar from "@/components/mainPage/NavBar"

export default function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div className="min-h-screen">
            <NavBar/>
            <main className="h-full">
                {children}
            </main>
            <Footer/>
        </div>
    )
}