
const express = require('express') // express 모듈을 가져옴
const app = express()              // 앱 
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require("./config/key");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());


const mongoose = require('mongoose') // 몽구스를 이용해서 몽고디비랑 연동
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { // 루트 디렉토리에
  res.send('Hello World! 헬로')
})

// 회원가입을 위한 라우트 
app.post('/register',(req, res)=>{
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준당

    const user = new User(req.body) // POST 방식을 넘어오는 파라미터를 담고 있음, body-parser와 같은 모듈을 통해 파싱 가능

    user.save((err,userInfo)=>{
        if(err) 
            return res.json({success:false,err}) // 클라이언트에게 json 값을 보냄
        return res.status(200).json({  // status(200)은 성공했다는 것
            success:true
        })
    }) // mongodb 메서드
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 
// 포트번호에서 이 앱 실행