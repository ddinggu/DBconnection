module.exports = (app, Members) => {
    // form 태그를 이용해 Post로 통신하여 주소창에 회원 관련 정보가 없도록 만듬    
    // 이 부분은 팀원들과 의논해야하는 부분

    // 회원가입(실패할 시 스키마에서 설정한 error 값을 반환하도록 함)
    app.post('/signup', function(req, res){
        var body = req.body;

        var member = new Members({
            email_address : body.email_address,
            password : body.password,
            name : body.name
        });   
        
        member.save(function(err){
            if(err) {
                var property = Object.keys(err.errors)[0];
                res.send(err.errors[property]['message']);
                console.log('\n' + err);
            }
            else {
                res.send('DB 확인해 주세요');
            }
        }) 
    })

    // 로그인 (아이디와 비밀번호를 확인하는 작업. --> session처리 아직 안함)
    app.post('/accessLogin', function(req, res){
        var body = req.body,
            validator = {email_address : body.email_address},
            enteredUserPassword = body.password;
            
        Members.findOne(validator, function(err, member){
            if(err) res.send(err);
            else{
                if(!member) res.send('아이디가 틀렸음!')
                else {
                    member.checkUser(enteredUserPassword, function(err, isMatch){
                        if(err) res.send(err);
                        if(isMatch) res.send('로그인 되었습니다.');
                        else res.send('비밀번호가 틀렸습니다.')
                    })
                }
            }
        })
    })

    // 회원탈퇴를 원하면 다른 페이지를 안내
    app.get('/signout', function(req, res){
        res.render('signout');
    })

    // 회원탈퇴 ( 로그인 부분과 동일하게 비밀번호 검색후 삭제 진행 )
    app.post('/deleteUser', function(req, res){
        var body = req.body,
            validator = {email_address : body.email_address},
            enteredUserPassword = body.password;
            
        Members.findOne(validator, function(err, member){
            if(err) res.send(err);
            else{
                if(!member) res.send('아이디가 틀렸음!')
                else {
                    member.checkUser(enteredUserPassword, function(err, isMatch){
                        if(err) res.send(err);
                        if(!isMatch) res.send('비밀번호가 틀렸습니다.');
                        else {
                            // 모델에서 찾은 아이디를 삭제
                            member.remove();
                            res.send('삭제됬으니 DB확인하세요.')
                        }
                    })
                }
            }
        })
    })

}
