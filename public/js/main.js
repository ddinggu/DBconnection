$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

// $('.go_form').on('click', function(){
//    // body값으로 사용자가 입력한 값들을 members collection에 전송 
//    // 전송 후 로그인 세션에 로그인 정보 입력
//    // 홈페이지로 재접속 res.redirect('/')
// });

$('.loginbutton').on('click', () => {
    var parameters = {email_address : $('.a').val() , 
                      password : $('.b').val()};
    console.log(parameters);
    
    $.get('/login/show', parameters, (data) => {
        if(data === 'login') {
            window.location.replace('/');
            // 다른 public JS 파일에 보내는 법?? 
            // 세션에 로그인정보가 들어감을 확인했으므로, naverelements.js에 세션정보의 일부(로그인 됨을) 알려주고 싶다. 
        }
        else {
            $('#result').html(data);
        }
    })    

})

$('.createbutton').on('click', (e) => {
    var parameters = {email_address : $('.c').val(), 
                      password : $('.d').val(),
                      name : $('.e').val()};
    console.log(parameters);
    
    $.post('/login/join', parameters, (data) => {
        $('#result').html(data);
    })
})

// $('.changebutton').on('click', () =>{
//     var parameters = {email_address : $('.c').val(), 
//                       password : $('.d').val(),
//                       name : $('.e').val()};
//     console.log(parameters);

//     $.put('/login/change', parameters, (data) =>{
//         $('#result').html(data);
//     })
// })

