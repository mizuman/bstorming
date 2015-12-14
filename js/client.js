var socket = io();
// submit chat message
$('#form-chat').submit(function(){
    socket.emit('chat message', $('#mes').val());
    $('#mes').val('');
    return false;
});
// submit username
$('#form-popup').submit(function(){
    // display none
    $('#popup').css({'display':'none'});
    $('#black-overlay').css({'display':'none'});
    // socket connection
    var username = $('#username').val();
    socket.emit('show username', username);
    $('#username').val('');
    return false;
});
socket.on('connect', function(){
    console.log("connected");
    // show user name
    socket.on('show userlist', function(userlist){
        // reset
        $('#userlist').empty();
        // show all value in array userlist
        for(var i = 0; i < userlist.length; i++){
            $('#userlist').append($('<li>').text(userlist[i]));
        }
    });
});

//     // prepend message li
// socket.on('chat message', function(msg){
//     $('#messages').prepend($('<li>').text(msg));
// });
// // show user name
// socket.on('show username', function(username){
//     $('#form-header').empty().append($('<h4>').text(username + ' has joined!'));
// });