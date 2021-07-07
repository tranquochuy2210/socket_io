const path=require('path')
const express=require('express')
const {Server}=require('socket.io')
let app=express()
const http=require('http')
const Filter=require('bad-words')
const server=http.createServer(app)
const {generateMessage,generateLocationMessage}=require('./utils/message')
const{getUsersInRoom,getUser,addUser,removeUser}=require('./utils/users')

let io=new Server(server)

app.use(express.static(path.join(__dirname,'../public')))

io.on('connection',(socket)=>{
    
    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('new message', generateMessage(`${user.username} has joined`))
        socket.emit('new message',generateMessage('admin','welcome'))
        const users=getUsersInRoom(user.room)
        io.emit('update users',users,user.room)
        callback()
    })
    
    //sendchatmessage
    socket.on('chat message',(message,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(message)){
            callback('Profane is not allowed')
        }
        const user=getUser(socket.id)
        
        io.emit('new message',generateMessage(user.username,message))
        callback()
    })

    //send location
    socket.on('send location',({latitude,longitude},callback)=>{
        const user=getUser(socket.id)
        
        io.to(user.room).emit('location message',generateLocationMessage(user.username,`https://www.google.com/maps?q=${latitude},${longitude}`))

        callback()
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        io.emit('new message',generateMessage(`${user.username} has left`))
        const users=getUsersInRoom(socket.id)
        io.emit('update users',users,user.room)
    })
})

const port=5000
server.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})