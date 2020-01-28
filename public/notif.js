var socket = io.connect('http://localhost:8013');
var notif = document.getElementById('notif'),
    uname = document.getElementById('uname')
    likeBtn = document.getElementById('likeBtn'),
    unlikeBtn = document.getElementById('unlikeBtn'),
    to = document.getElementById('to'),
    message = document.getElementById('message'),
    from = document.getElementById('from');
    viewedBtn = document.getElementById('view'),
    
    socket.emit('notif', uname.value);
    if (likeBtn){
    likeBtn.addEventListener('click',function(){
        socket.emit('liked',{
            from: uname.value,
            to: to.value,
        })

    })}
    if (unlikeBtn){
        unlikeBtn.addEventListener('click',function(){
            socket.emit('unliked',{
                from: from.value,
                to: to.value,
            })
        })}
        // if (viewedBtn){
        //     viewedBtn.addEventListener('click',function(){
        //         socket.emit('viewed',{
        //             from: from.value,
        //             to: to.value,
        //         })
        //     })}
  

        // if (viewedBtn){
        //     viewedBtn.addEventListener('click',function(){
        //         var viewed = document.getElementById('view');
        //         document.getElementById("view").value = viewed;
        //         console.log('to '+viewed.value)
                
        //         socket.emit('viewed',{
        //             from: from.value,
        //             to: viewed.value,
        //         })
        //     })}
            
        //     console.log('from'+from.value)
        //     console.log('to'+viewed.value)
       
        socket.on('viewed_notification',function(data){
            notif.innerHTML += "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" + 
            "Your profile was viewed by " + data + 
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>" + "</div>";
        })
        socket.on('unlike_notification',function(data){
        
            notif.innerHTML += "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" + 
            "Your profile was unliked by " + data + 
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>" + "</div>";
        })
        socket.on('like_notification',function(data){
            
            notif.innerHTML += "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" + 
            "Your profile was liked by " + data + 
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>" + "</div>";
        })
        socket.on('msg_notification',function(data){
            console.log(data);
            notif.innerHTML += "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" + 
            "You have a new message from " + data + 
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>" + "</div>";
        })
  