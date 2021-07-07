const users=[]

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room ){
        return {
            error:'username and room must be provided'
        }
    }
    const isExist=users.find((user)=>{
        return( user.username===username && user.room===room)
       
    })
    if(isExist){
        return {
            error:'username is exist'
        }
    }
    user={id,username,room}
    users.push(user)
    return{user}

}
const getUser=(id)=>{
    return(users.find((user)=>
        user.id===id
    ))
    

}
const getUsersInRoom=(room)=>{
    const userInRoom=users.filter((user)=>
        user.room===room
    )
    return userInRoom
}




const removeUser=(id)=>{
    let index=users.findIndex((user)=>user.id===id)
    if(id!==-1){
        return(users.splice(index,1)[0])
    }
}
module.exports={addUser,removeUser,getUser,getUsersInRoom}
