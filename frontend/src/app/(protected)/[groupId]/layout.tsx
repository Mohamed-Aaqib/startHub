import GroupChecker from "@/components/protectedRoutes/groupId/GroupChecker";

export default function layout({children}:{children:React.ReactNode}){
    return(
        <>
        <GroupChecker/>
        {children}
        </>
    )
}