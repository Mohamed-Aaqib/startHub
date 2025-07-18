export default async function RootLayout({children}:{children:React.ReactNode}){
    return(
        <div>
            <h1>protected for the information</h1>
            {children}
        </div>
    )
}