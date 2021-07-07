socket=io()

const messageForm=document.getElementById('message-form')
const messageSubmitButton=messageForm.querySelector('button')
const input=messageForm.querySelector('input')
const sendLocationButton=document.getElementById('send-location')
const messages=document.querySelector('#messages')
const sidebar=document.getElementById('sidebar')

//template
const messageTemplate=document.querySelector('#message-template').innerHTML

const URLTemplate=document.getElementById('url-template').innerHTML

const sidebarTemplate=document.getElementById('sidebar-template').innerHTML

//option
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

messageSubmitButton.addEventListener('click',(event)=>{
    event.preventDefault()
    messageSubmitButton.setAttribute('disabled','disabled')
    let message=input.value
    if(message){
       socket.emit('chat message',message,(error)=>{
        messageSubmitButton.removeAttribute('disabled')
        input.value=''
        input.focus()
        if(error){return console.log(error)}
       }) 
       console.log('message deliveried')
    }else{
        messageSubmitButton.removeAttribute('disabled')
    }

})
const autoScroll=()=>{
    const newMessage=messages.lastElementChild
    //height of new message:
    const newMessageStyle=getComputedStyle(newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=newMessageMargin+newMessage.offsetHeight
    //visible height
    const visibleHeight=messages.offsetHeight
    //heigh of message container
    const containerHeight=messages.scrollHeight
    //how far have i scrolled?

    const scrollOffset=messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight>=scrollOffset){
        messages.scrollTop=messages.scrollHeight
    }

}


sendLocationButton.addEventListener('click',()=>{
    sendLocationButton.setAttribute('disabled','disabled')

    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition((location)=>{
          let {latitude,longitude}=location.coords
           socket.emit('send location',{latitude,longitude},(error)=>{
            sendLocationButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            console.log('message was deliveried')        
           })
        })
       
    }
})




//event 
socket.on('new message',({username,text,createdAt})=>{
    const html=Mustache.render(messageTemplate,
        {message:text,
        createdAt:moment(createdAt).format('h:mm a'),
        username
    })
    
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('location message',({username,url,createdAt})=>{

    const html=Mustache.render(URLTemplate,{
        username,
        url,
        createdAt:moment(createdAt).format('h:mm a')})
  
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})


socket.on('update users',(users,room)=>{
    const html=Mustache.render(sidebarTemplate,{room,users})
    sidebar.innerHTML=html
})



socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})


