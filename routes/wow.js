module.exports = (app, Members) =>{
    app.post('/wow', (req, res) => {
        let member = new Members();

        member.email_address = req.body.email_address;
        member.password = req.body.password;
        member.name = req.body.name;
        
        member.save((err) =>{
            if(err) {
                console.err = err;
                res.json({err : 0});
                return;
            }
            res.json({result : 1});
        })
    });
}    