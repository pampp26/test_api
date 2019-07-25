/*const express = require('express')
const bodyParser = require('body-parser')
//const router = express.Router()
//module.exports = router
const cors = require('cors')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'check_db'
  }
})
const app = express()
const port = 7001

app.use((req, res, next) => {
  req.knex = knex
  next()
})
app.use(bodyParser.json())
app.use(cors())

app.get('/student/:id', async (req, res) => {
  try{ //แจ้งเตือนเวลา error

    console.log(req.params.id)  // http://localhost:7001/?id=6139010007  // query
  if(req.params.id){
   //   let rows = await knex('teacher_teach').where("std_code","=",req.params.id)
    let rows = await knex.raw(`SELECT  std_code,std_name,cou_code,cou_thai,cou_unit,grade  FROM teacher_teach WHERE std_code=${req.params.id}`)
    let rows1 = await knex.raw(`SELECT ROUND(sum(cou_unit*grade)/sum(cou_unit),2) as total  FROM teacher_teach WHERE std_code=${req.params.id}`)
          console.log('hello')
          res.send({
            ok: 1,
            student: rows[0],
            avg_grade: rows1[0],
          })
  }
  console.log('std')

  } catch(error){
    
    res.send({
      ok: 0 ,
      error: error.message //แจ้งเตือน ใน network
    })

  }
   
          
})
app.post('/student/update/:code_up',async (req, res) => {
  console.log('update=',req.body)
  if (!req.body.cou_code) {
    res.send({ ok: 0, error: 'cou_code missing' })
    return  // จบการทำงาน
  } 
  await req.knex('teacher_teach')
      .where('cou_code', '=', req.body.cou_code)
      .where('std_code', '=', req.body.std_code)
      .update({
        grade: req.body.grade,
      })
      res.send({ok: 1, update: 'success'})

})


app.post('/student/insert/:code',async  (req, res) => {
  // 1. ตรวจสอบความถูกต้อง
  // req.params req.query req.body

  console.log(req.body)

  if (!req.body.std_code) {
    res.send({ ok: 0, error: 'fisrt name missing' })
    return //จบการทำงาน
  }
 // console.log(req.body.std_name) ส่งค่า
 // res.send(req.body.std_name) โชว์ค่า

  // 2. หาข้อมูลนักเรียน
  let rows = await req.knex('teacher_teach')
  .where('std_code', '=', req.body.std_code)
  console.log('row=',rows.length)
    if (rows.length > 0) {
       
      await req.knex('teacher_teach').insert({
        std_code: req.body.std_code,
        std_name: req.body.std_name,
        cou_code: req.body.cou_code,
        cou_thai: req.body.cou_thai,
        cou_unit: req.body.cou_unit,
        grade: req.body.grade,
      })
    }
    res.send({ok:1})
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`)) */
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const knex = require('knex')

const db = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'check_db'
  }
})
const app = express()

app.use(express.static('./public'))
app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json())// ใช้ได้ทุก url
// app.use('/api', bodyParser.json())

app.post('/member',async (req, res) => {
  try {
    let id= await db('member').insert({
      username: req.body.username,
      password: req.body.pass,
      status: req.body.status,
    })   
  } catch (error) {
    res.send({
      status: 'error',
      error:e
    })
  }
  res.send({
    insert:"ok",
  })
  
  console.log(req.body.username)
  console.log(req.body.pass)
  
  
  console.log('id=',id)
  res.send({
    insert:"ok",
 })
})
app.get('/', (req, res) => {
  res.send({ ok: 1,status: req.query })
   if(req.query.fname == "oak"){
     console.log("alongkorn")
   }
})
// localhost:7001/std/6139010005
app.get('/std/:code?', (req, res) => {
  res.send({ ok: 1,status: req.params })
})
app.post('/teacher',(req, res) => {
   console.log(req.body)
  res.send({ ok: 1,status: req.body })
})

app.post('/api/login', bodyParser.json(), async (req, res) => {
  try {
    let row = await db('teacher')
      .where({ user: req.body.user, pass: req.body.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user/pass incorrect')
    }
    res.send({ ok: 1, user: row })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.get('/api/student', async (req, res) => {
  try {
    let rows = await db('student')
      .where({ tid: req.query.tid || 0 })
      .orderBy('code', 'asc')
    res.send({
      ok: 1,
      students: rows,
    })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.get('/api/student/:id', async (req, res) => {
  try {
    let row = await db('student')
      .where({ id: req.params.id || 0})
      .then(rows => rows[0])
    if (!row) {
      throw new Error('student not found')
    }
    res.send({
      ok: 1,
      student: row,
    })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})


app.post('/api/student', async (req, res) => {
  // TODO:
  try {
    if (!req.body.code || !req.body.name || !req.body.tid) {
      throw new Error('code, name, tid is required')
    }
    let row = await db('student').where({code: req.body.code}).then(rows => rows[0])
    if (!row) {
      let ids = await db('student').insert({
        code: req.body.code,
        name: req.body.name,
        tid: req.body.tid,
        birth: req.body.birth,
      })
      res.send({ ok: 1, id: ids[0] })
    } else {
      await db('student')
        .where({code: req.body.code})
        .update({
          name: req.body.name,
          tid: req.body.tid,
          birth: req.body.birth,
        })
      res.send({ ok: 1, id: row.id })
    }
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})


app.listen(7001, () => {
  console.log('ready on 7001')
})