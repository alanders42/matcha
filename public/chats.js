// Make connection
var socket = io.connect('localhost:8013');

// socket.on('connect',()=>{
//     update()
// })

// Query DOM
var message = document.getElementById('message'),
      from = document.getElementById('from'),
      to = document.getElementById('to'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      chatId = document.getElementById('chatId');
      feedback = document.getElementById('feedback');

if (chatId){
      socket.emit('room',chatId.value)
// Emit events
btn.addEventListener('click', function(){
    // io.sockets.to().emit('notification')
    socket.emit('chat', {
        message: message.value,
        from: from.value,
        to: to.value,
        chatId:chatId.value
    });
    message.value = "";
});
}

// message.addEventListener('keypress', function(){
//     socket.to().emit('typing', from.value);
// })
// socket.broadcast.to(chatId).emit('message','You have a new message');
// function update(){
//     socket.emit('update',{
//         user:from.value,
//         id: socket.id
//     })
// }

   
//    socket.on('notification',(data)=>{
//     console.log(data)
//     notifblock.innerHTML ="<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
//      + data.message +
//     "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
//     + "</div>";
// })

    
// Listen for events
socket.on('chat', (data)=>{
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.message + '</p>';
});
socket.on('typing',function(data){
    feedback.innerHTML ="<p><em>"+data +" is typing a message...</em></p>";
})
