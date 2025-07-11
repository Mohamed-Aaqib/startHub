export default function RootLayout({children}:{children:React.ReactNode}){

    return(
        <div className="overflow-x-hidden">
            <nav className="bg-green-500 w-screen text-center">Finding Partners like always</nav>
            {children}
        </div>
    )

}