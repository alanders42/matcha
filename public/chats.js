// Make connection
var socket = io.connect('http://localhost:8013');


// Query DOM
var message = document.getElementById('message'),
      from = document.getElementById('from'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        from: from.value,
        to: to.value,
        chatId:chatId.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', from.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.message + '</p>';
});
socket.on('typing',function(data){
    feedback.innerHTML ="<p><em>"+data +" is typing a message...</em></p>";
})