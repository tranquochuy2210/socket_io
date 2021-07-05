const path=require('path')
const express=require('express')
const socketIo=require('socket.io')
const app=express()

app.use(express.static(path.join(__dirname,'../public')))

const port=5000
app.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})