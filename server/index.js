
const express = require('express') // express 모듈을 가져옴
const app = express()              // 앱 
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());

app.use(cookieParser());


const mongoose = require('mongoose') // 몽구스를 이용해서 몽고디비랑 연동
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { // 루트 디렉토리에
  res.send('Hello World! 헬로')
})

// 회원가입을 위한 라우트 
app.post('/api/users/register',(req, res)=>{
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

// 로그인 라우트
app.post('/api/users/login', (req,res) =>{

    // 요청된 이메일을 DB에서 찾는다
    User.findOne({email: req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    

        // 요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch)
            return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})

            
            // 비밀번호까지 맞다면 토큰 생성
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                
                //  토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId : user._id})
            })
        })
    })
})

// auth route

app.get('/api/users/auth', auth, (req,res)=>{
     // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말
     res.status(200).json({
         _id: req.user._id,
         isAdmin: req.user.role === 0 ? false : true,
         isAuth: true,
         email: req.user.email,
         name: req.user.name,
         lastname:req.user.lastname,
         role: req.user.role,
         image: req.user.image

     })
})

app.get('/api/users/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id: req.user._id},
        { token: ""}
    , (err,user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success:true
        })
    })
        
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 
// 포트번호에서 이 앱 실행