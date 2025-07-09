export function hasRecentlyMatched(userId:string,partnerId:string,cooldown:number,timedMap:Map<string,Map<string,number>>):boolean{
    const now = Date.now();
    const userPairs = timedMap.get(userId);
    const time = userPairs?.get(partnerId);
    return !!time && (now-time <= cooldown);
}

export function addRecentMatch(userA:string,userB:string,timedMap:Map<string,Map<string,number>>){
    const now = Date.now();
    if(!timedMap.has(userA)) timedMap.set(userA,new Map());
    if(!timedMap.has(userB)) timedMap.set(userB,new Map());
    timedMap.get(userA)!.set(userB,now);
    timedMap.get(userB)!.set(userA,now);
}

export function findEligiblePartner(currentId:string,waitingUsers:string[],timedMap:Map<string,Map<string,number>>,cooldown:number):string|null{
    while(waitingUsers.length > 0){
        const potential = waitingUsers.shift();
        if(potential){
            if(!hasRecentlyMatched(currentId,potential,cooldown,timedMap)){
                return potential;
            }else{
                waitingUsers.push(potential);
            }
        }
    }
    return null;
}

export function findAnyPartner(waitingUsers:string[]):string|null{
    return waitingUsers.shift() || null
}