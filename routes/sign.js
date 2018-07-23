module.exports = (app, Members) =>{
    // form 태그를 이용해 Post로 통신하여 주소창에 회원 관련 정보가 없도록 만듬    

    // 회원가입(실패할 시 스키마에서 설정한 error 값을 반환하도록 함)
    app.post('/signup', (req, res) => {
        var body = req.body,
            member = new Members();

            member.email_address = body.email_address;
            member.password = body.password;
            member.name = body.name;

            // if(!member.email_address || !member.password || !member.name) res.send('회원정보를 확인하고 다시 생성해주세요!');
           
            member.save((err) =>{
                if(err) {
                    var property = Object.keys(err.errors)[0];
                    console.log(property);
                    res.send(err.errors[property]['message']);
                }
                else res.send('DB 확인해 주세요');
            }) 
    })

    // 로그인 (아이디와 비밀번호를 확인하는 작업. --> session처리 아직 안함)
    app.post('/accessLogin', (req, res) => {
        var body = req.body,
        validator = { email_address : body.email_address, 
            password : body.password};

            Members.find(validator).exec( (err, members) => {
                if(err) res.send(err);
                else if (!members.length) res.send('아이디와 비밀번호를 확인해주세요');
                else res.send('로그인 성공!');
            })  
    })

    // 회원탈퇴를 원하면 다른 페이지를 안내
    app.get('/signout', (req, res) => {
        res.render('signout');
    })

    // 회원탈퇴 
    app.post('/deleteUser', (req, res) => {
        var body = req.body,
        validator = { email_address : body.email_address, 
            password : body.password};

        Members.findOneAndRemove(validator).exec( (err, result) => {
            if(err) res.send(err);
            else res.send('정상적으로 탈퇴되었습니다. 감사합니다.');
        })    
    })

    
}
