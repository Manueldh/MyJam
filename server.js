require('dotenv').config() 

const express = require('express')
const session = require('express-session')
const app = express()

app
  .use(express.urlencoded({extended: true})) // middleware to parse form data from incoming HTTP request and add form fields to req.body
  .use("/", express.static('static'))        // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .set('view engine', 'ejs')                 // Set EJS to be our templating engine
  .set('views', 'view')                      // And tell it the views can be found in the directory named view

  // .get('/login', onLogin)
  .get('/register', onRegister)

  .post('/submitInlog', onSubmitInlog)
  .post('/registerAccount', onRegisterAccount)

  .listen(4497)

app
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))

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

const scopes = ['user-read-private', 'user-read-email']; 

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.get('/track/:id', async (req, res) => {
  const trackId = req.params.id;

  // Controleer of het access token is ingesteld
  const accessToken = spotifyApi.getAccessToken();
  if (!accessToken) {
    return res.status(400).send('No access token provided');
  }

  try {
    const data = await spotifyApi.getTrack(trackId);
    res.json(data.body);
  } catch (err) {
    console.error('Error fetching track data', err);
    res.status(500).send('Error fetching track data');
  }
})

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

app.get('/track/:id', async (req, res) => {
  const trackId = req.params.id;

  try {
    const data = await spotifyApi.getTrack(trackId);
    res.json(data.body);
  } catch (err) {
    console.error('Error fetching track data', err);
    res.status(500).send('Error fetching track data');
  }
});

function onLogin(req, res) {
  res.render('login.ejs')
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
  res.render('register.ejs')
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



