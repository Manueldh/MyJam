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
  .use(express.urlencoded({ extended: true })) // middleware to parse form data from incoming HTTP request and add form fields to req.body
  .use("/", express.static('static'))        // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .set('view engine', 'ejs')                 // Set EJS to be our templating engine
  .set('views', 'view')                      // And tell it the views can be found in the directory named view


  .get('/logout', onLogout)
  .get('/login', onLogin)
  .get('/register', onRegister)
  .get('/genre', onGenre)
  .get('/instrument', onInstrument)
  .get('/difficulty', onDifficulty)
  .get('/account', loginCheck, onAccount)
  .get('/results', onResults)
  
  .post('/favorites/add', addFavorite)
  .post('/submitInlog', onSubmitInlog)
  .post('/registerAccount', onRegisterAccount)
  .post('/editInfo', onEditInfo)



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
  res.render('register.ejs', { title: 'Login', user: req.session.user })
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

function loginCheck(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}


function onAccount(req, res) {
  res.render('account.ejs', { title: 'Account', user: req.session.user })
}

function onLogin(req, res) {
  res.render('login.ejs', { title: 'Login', user: req.session.user })
}

function onLogout(req, res) {
  req.session.destroy((err) => {
    res.redirect('/')
  })

}

function onGenre(req, res) {
  res.render('genre.ejs', { title: 'Genre', username: req.session.user ? req.session.user.username : null })
}

function onInstrument(req, res) {
  res.render('instrument.ejs', { title: 'Instrument', username: req.session.user ? req.session.user.username : null })
}

function onDifficulty(req, res) {
  res.render('difficulty.ejs', { title: 'Difficulty', username: req.session.user ? req.session.user.username : null })
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
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
    }
    res.redirect('/')
  } else {
    res.render('login.ejs', { title: 'Login', error: 'Invalid username or password', user: req.session.user })
  }
}

function onRegister(req, res) {

  res.render('register.ejs', { title: 'Register', user: req.session.user })

}

async function onRegisterAccount(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const email = xss(req.body.email)
  const username = xss(req.body.username)
  const password = xss(req.body.password)

  const duplicateUser = await collection.findOne({ username: username })
  if (duplicateUser) {
    return res.render('register.ejs', { title: "register", error: 'Username already taken', username: null })
  }

  const duplicateEmail = await collection.findOne({ username: username });
  if (duplicateEmail) {
    return res.render('account.ejs', { title: "Your account", error: 'Email already taken', email: null });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await collection.insertOne({
    email: email,
    username: username,
    password: hashedPassword,
  })

  req.session.user = {
    _id: result.insertedId,
    username: username,
    email: email,
    password: hashedPassword
  }
  res.redirect('/')
}


async function onEditInfo(req, res) {
  const dataBase = client.db(process.env.DB_NAME);
  const collection = dataBase.collection(process.env.DB_COLLECTION);

  const email = xss(req.body.email);
  const username = xss(req.body.username);
  const password = xss(req.body.password);
  const currentUsername = req.session.user.username;

  const duplicateUser = await collection.findOne({ username: username });
  if (duplicateUser) {
    return res.render('account.ejs', { title: "Your account", error: 'Username already taken', user: req.session.user });
  }

  const duplicateEmail = await collection.findOne({ email: email });
  if (duplicateEmail) {
    return res.render('account.ejs', { title: "Your account", error: 'Email already taken', user: req.session.user });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await collection.updateOne(
    { username: currentUsername },
    {
      $set: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    }
  );

  req.session.user = {
    username: username,
    email: email,
    password: hashedPassword
  };

  res.render('account', { title: 'Account', user: req.session.user });
}


function onResults(req, res) {
  res.render('results.ejs', { title: 'Results', user: req.session.user })
}

async function addFavorite(req, res) {
  if (!req.session.user) {
    return res.status(401).send('You must be logged in to add a favorite')
  }

  const userId = req.session.user._id
  const { spotifyId } = req.body

  try {
    const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection(process.env.DB_COLLECTION)

    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: spotifyId } }
    )

    if (result.modifiedCount > 0) {
      res.json({ success: true })
    } else {
      res.status(400).json({ success: false, message: 'Failed to add to favorites' })
    }
  } catch (err) {
    console.error('❌ Failed to add favorite:', err)
    res.status(500).send('Failed to add favorite')
  } finally {
    await client.close()
  }
}