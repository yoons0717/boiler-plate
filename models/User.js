const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength:50
    },
    email:{
        type: String,
        trim: true, // 공백 없애주는 역할
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token: {
        type:String
    },
    tokenExp:{
        type: Number
    }
})


// 유저 모델에 유저 정보를 저장하기 전에, 무엇을 한다
userSchema.pre('save', function(next){
    var user = this; // User을 가리킴
    // 비밀번호를 암호화 시킨다

    if(user.isModified('password')){ // password가 변환될 때만 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) 
                return next(err) // next 하면 바로 index.js의 save로 감
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) 
                    return next(err)
                user.password = hash // hash가 암호화된 password
                next()
            })
        })
    }
    else{
        next()
    }

   
}) 

userSchema.methods.comparePassword = function(plainPassword,cb){
    // plainPassword 123456 을 암호화해서 DB에 저장된거랑 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
            cb(null, isMatch); // 비번이 같으면 isMatch가 true
    })

}

userSchema.methods.generateToken = function(cb){

    var user = this;
    //jsonwebtoken 을 이용해서 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken') // db의 id

   // user._id + 'secretToken' = token
    user.token = token;
    user.save(function(err, user){
      if(err) return db(err)
         cb(null, user)  
    })

    
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;
    
    // user._id + '' = token
    // 토큰을 decode 한다.
    jwt.verify(token,'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err,user){

            if(err) return cb(err);
            cb(null, user)
        })

    })
}
const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸기

module.exports = {User} 
