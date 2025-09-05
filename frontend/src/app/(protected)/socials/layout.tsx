import NavBar from "@/components/protectedRoutes/socials/NavBar";
import SocialSidebar from "@/components/protectedRoutes/socials/SocialSidebar";

export default function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div>
            <div className="h-screen flex flex-col">
                <div className="flex-1 flex flex-row items-center">
                    <div className="flex-[0.75] h-full w-full">
                        {children}
                    </div>
                    <div className="h-full flex-[0.25]">
                        <SocialSidebar/>
                    </div>
                </div>
                {/* offset value */}
                <div className="h-[51.2px] w-full"/>
            </div>
        </div>
    )
}