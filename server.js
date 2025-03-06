require('dotenv').config() 

const express = require('express')
const session = require('express-session')
const app = express()

app
  .use(express.urlencoded({extended: true})) // middleware to parse form data from incoming HTTP request and add form fields to req.body
  .use("/", express.static('static'))        // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .set('view engine', 'ejs')                 // Set EJS to be our templating engine
  .set('views', 'view')                      // And tell it the views can be found in the directory named view

  .get('/login', onLogin)
  .get('/register', onRegister)

  .post('/submitInlog', onSubmitInlog)
  .post('/registerAccount', onRegisterAccount)

  .listen(8000)

app
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
})

// Try to open a database connection
client.connect()
  .then(() => {
    console.log('Database connection established')
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`)
    console.log(`For uri - ${uri}`)
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Middleware to handle not found errors - error 404
app.use((req, res) => {
  // log error to console
  console.error('404 error at URL: ' + req.url)
  // send back a HTTP response with status code 404
  res.status(404).send('404 error at URL: ' + req.url)
})

// Middleware to handle server errors - error 500
app.use((err, req, res) => {
  // log error to console
  console.error(err.stack)
  // send back a HTTP response with status code 500
  res.status(500).send('500: server error')
})


function onLogin(req, res) {
  res.render('login.ejs', 
    { title: 'Login' }
  )
}

async function onSubmitInlog(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const user = await collection.findOne({
    username: req.body.username,
    password: req.body.password
  })

  if (user) {
    req.session.user = user
    res.render('test.ejs', { username: user.username })
  } else {
    res.render('inlogfout.ejs')
  }
}

function onRegister(req, res) {
  res.render('register.ejs', { title: 'Register' })
}

async function onRegisterAccount(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  result = await collection.insertOne({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
  })
  
  
  res.render('succes.ejs', { data: req.body })
}