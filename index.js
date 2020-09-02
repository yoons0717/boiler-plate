
const express = require('express') // express 모듈을 가져옴
const app = express()              // 앱 
const port = 5000

const mongoose = require('mongoose') // 몽구스를 이용해서 몽고디비랑 연동
mongoose.connect('mongodb+srv://yoons0717:dbsal903*@boilerplate.ijw7o.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlPasrser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { // 루트 디렉토리에
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 
// 포트번호에서 이 앱 실행