require('dotenv').config() 
const xss = require('xss')
const bcrypt = require('bcryptjs')

const express = require('express')
const session = require('express-session')
const app = express()

app
  .use(express.urlencoded({ extended: true })) // middleware to parse form data from incoming HTTP request and add form fields to req.body

  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .use(express.urlencoded({extended: true})) // middleware to parse form data from incoming HTTP request and add form fields to req.body
  .use("/", express.static('static'))        // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .set('view engine', 'ejs')                 // Set EJS to be our templating engine
  .set('views', 'view')                      // And tell it the views can be found in the directory named view


  .get('/logout', onLogout)
  .get('/login', onLogin)
  .get('/register', onRegister)


    res.render('succes.ejs', { data: req.body })
  })

  .listen(4497)


// ********************************************************************************************************
// ******************************************************************************************************** 
// *******************************************SPOTIFY API**************************************************
// ********************************************************************************************************
// ********************************************************************************************************

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const accessToken = data.body['access_token'];

    spotifyApi.setAccessToken(accessToken);
    console.log('✅ Access token verkregen:', accessToken);

    // Stel een timer in om het token te vernieuwen vóórdat het verloopt
    setTimeout(getAccessToken, (data.body['expires_in'] - 60) * 1000);
  } catch (err) {
    console.error('❌ Fout bij verkrijgen access token:', err);
  }
}

// Haal het eerste token op bij het starten van de server
getAccessToken();


app.get('/search/:query', async (req, res) => {
  const searchQuery = req.params.query;

  try {
    const data = await spotifyApi.searchTracks(searchQuery);
    res.json(data.body.tracks.items);
  } catch (err) {
    console.error('❌ Fout bij zoeken:', err);
    res.status(500).send('Fout bij zoeken');
  }
});

app.get('/track/:id', async (req, res) => {
  try {
    const data = await spotifyApi.getTrack(req.params.id);
    res.json(data.body);
  } catch (err) {
    console.error('❌ Fout bij ophalen trackgegevens:', err);
    res.status(500).send('Fout bij ophalen trackgegevens');
  }
});

// ********************************************************************************************************
// ******************************************************************************************************** 
// **********************************************DATABASE**************************************************
// ********************************************************************************************************
// ********************************************************************************************************


  
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
  res.render('register.ejs', {title: 'Login', username: req.session.user ? req.session.user.username : null, error: null})
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


onLogin(req, res) {

  res.render('login.ejs', {title: 'Login', username: req.session.user ? req.session.user.username : null})
}

function onLogout(req, res) {
  req.session.destroy((err) => {
    res.redirect('/') 
  })

}


async function onSubmitInlog(req, res) {
    const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection(process.env.DB_COLLECTION)

    const username = xss(req.body.username)
    const password = xss(req.body.password)


    const user = await collection.findOne({
      username: username
    })

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { username: user.username}
      res.redirect('/') 
    } else {
      res.render('inlogfout.ejs')
    }
}

function onRegister(req, res) {

  res.render('register.ejs', {
    username: req.session.user ? req.session.user.username : null,
    error: null,
    title: 'Register' 
  })

}

async function onRegisterAccount(req, res) {
      const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection(process.env.DB_COLLECTION)

    const email = xss(req.body.email)
    const username = xss(req.body.username)
    const password = xss(req.body.password)

    const duplicateUser = await collection.findOne({ username: username })
    if (duplicateUser) {
      return res.render('register.ejs', { error: 'Username already taken', username: null })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await collection.insertOne({
      email: email,
      username: username,
      password: hashedPassword,
    })

    req.session.user = { username: req.body.username }
    res.redirect('/')
  }
