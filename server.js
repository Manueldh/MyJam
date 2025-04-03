const dotenv = require('dotenv').config() 
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const xss = require('xss')
const bcrypt = require('bcryptjs')
const validator = require('validator')

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
  .use("/static", express.static('static'))  // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .set('view engine', 'ejs')                 // Set EJS to be our templating engine
  .set('views', 'view')                      // And tell it the views can be found in the directory named view

  
  .get('/logout', onLogout)
  .get('/login', onLogin)
  .get('/register', onRegister)
  .get('/genre', onGenre)
  .get('/instrument', onInstrument)
  .get('/difficulty', onDifficulty)
  .get('/filter-sorteer', tracksToFrontend)
  .get('/api/tracks', tracksToFrontend)
  .get('/account',  onAccount)
  .get('/favorites', onFavorites)
  .get('/home', onHome)
  .get('/forgot', onForgot)
  .get('/friends', onFriends)
  .get('/profile/:username', onProfile)
  .get('/nofavorite', onNofavorites)

  .post('/submitInlog', onSubmitInlog)
  .post('/registerAccount', onRegisterAccount)
  .post('/editInfo', onEditInfo)
  .post('/editPassword', onEditPassword)
  .post('/forgotAuth', onForgotAuth)
  .post('/resetPassword', onResetPassword)
  .post('/addToFavorites', addToFavorites)
  .post('/removeFromFavorites', removeFromFavorites)
  .post('/addFriend', onAddFriend)
  .post('/removeFriend', onRemoveFriend)

  // .post('/genre', onGenre)
  // .post('/instrument', onInstrument)
  // .post('/difficulty', onDifficulty)
  // .post('/filterResultaat', onFilterSorteer)

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
const { error } = require('console')
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
  res.render('home.ejs', {title: 'MyJam', user: req.session.user})
})


app.get('/reset/:token', async (req, res) => {
  const token = req.params.token
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const user = await collection.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.render('reset.ejs', { title: 'Reset Password', user: req.session.user })
  }

  res.render('reset.ejs', { title: 'Reset Password', token: token, user: req.session.user })
});




// Middleware to handle not found errors - error 404
app.use((req, res) => {
  // log error to console
  console.error('404 error at URL: ' + req.url)
  // send back a HTTP response with status code 404
  res.status(404).render('404.ejs', {title: '404', user: req.session.user, error: '404: page not found at URL: ' + req.url})
})

// Middleware to handle server errors - error 500
app.use((err, req, res) => {
  // log error to console
  console.error(err.stack)
  // send back a HTTP response with status code 500
  res.status(500).send('500: server error')
})


function onForgot(req, res) {
  res.render('forgot.ejs', {title: 'Forgot', user: req.session.user})
}

async function onAccount(req, res) {

  if (!req.session.user) {
    return res.redirect('/login')
  }

  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)
  const user = await collection.findOne({ username: req.session.user.username })
  
  res.render('account.ejs', {title: 'Account', user: req.session.user, friends: user.friends, error: null})
}

function onLogin(req, res) {

  if (req.session.user) {
    return res.redirect('/')
  }

  res.render('login.ejs', {title: 'Login', user: req.session.user, error: null})
}

function onLogout(req, res) {
  req.session.destroy(() => {
    res.redirect('/') 
  })

}

function onNofavorites(req, res) {
  res.render('nofav.ejs', {title: 'Empty favorites ', user: req.session.user, error: null})
}

function onGenre(req, res) {
  res.render('genre.ejs', {title: 'Genre', user: req.session.user})
}

function onInstrument(req, res) {
  res.render('instrument.ejs', {title: 'Instrument', user: req.session.user})
}

function onGenre(req, res) {
  res.render('genre.ejs', {title: 'Genre', user: req.session.user})
}

async function onDifficulty(req, res) {
  res.render('difficulty.ejs', {title: 'Difficulty', user: req.session.user})
}

async function tracksToFrontend(req, res) {
  try {
    const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection('music-data') // Zorg dat dit de juiste collectie is
    const usersCollection = dataBase.collection(process.env.DB_COLLECTION)

    let user = null
    let favorites = []

    const tracks = await collection.find().toArray() // Haal alle tracks op)
    const totalTracks = await collection.countDocuments()

    if (req.session.user) {
      user = await usersCollection.findOne({ username: req.session.user.username });
      favorites = user.favorites || []
      tracks.forEach(track => {
        track.isFavorite = favorites.includes(track.spotifyId);
      });
    } else {
      tracks.forEach(track => {
        track.isFavorite = false;
      });
    }

    res.render('filter-sorteer.ejs', {  // Stuur de tracks als JSON naar de frontend
      title: 'Filter & Sorteer', 
      user: req.session.user, 
      tracks: tracks,
      totalTracks: totalTracks
    })
  } catch (err) {
    console.error('❌ Failed to fetch tracks:', err)
    res.status(500).json({ error: 'Failed to fetch tracks' })
  }
}

async function onFavorites(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection('music-data') // Zorg dat dit de juiste collectie is
  
  const usersCollection = dataBase.collection(process.env.DB_COLLECTION)
  let user = null
  let favorites = []

  if (req.session.user) {
    user = await usersCollection.findOne({ username: req.session.user.username });
    favorites = user.favorites
  }
  
  // Kijk in user database naar de favorites en store die in een variabele
  // Laat alleen de tracks zien die hetzelfde spotifyId hebben als de favorites.

  const tracks = await collection.find({ spotifyId: { $in: favorites } }).toArray();
  if (req.session.user) {
    tracks.forEach(track => {
      track.isFavorite = favorites.includes(track.spotifyId);
    });
  }

  res.render('favorites.ejs', {title: 'Favorites', user: req.session.user, tracks: tracks})
}

function onHome(req, res) {
  res.render('home.ejs', {title: 'Home', user: req.session.user})
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
      res.render('login.ejs', { title: 'Login', error: 'Invalid username or password', user: req.session.user})
    }
}

function onRegister(req, res) {

  if (req.session.user) {
    return res.redirect('/')
  }

  res.render('register.ejs', {title: 'Register', user: req.session.user, error: null})
}

async function onRegisterAccount(req, res) {
      const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection(process.env.DB_COLLECTION)

    const email = xss(req.body.email)
    const username = xss(req.body.username)
    const password = xss(req.body.password)

    if (!validator.isEmail(email)) {
      return res.render('register.ejs', { title: "Register", error: 'Invalid email address', user: null })
    }

    const duplicateUser = await collection.findOne({ username: username })
    if (duplicateUser) {
      return res.render('register.ejs', { title: "Register", error: 'Username already taken', user: null })
    }

    const duplicateEmail = await collection.findOne({ email: email })
    if (duplicateEmail) {
      return res.render('register.ejs', { title: "Register", error: 'Email already taken', user: null })
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
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const email = xss(req.body.email)
  const username = xss(req.body.username)
  const currentUsername = req.session.user.username

  const duplicateUser = await collection.findOne({ username: username })
  if (duplicateUser) {
    return res.render('account.ejs', { title: "Your account", error: 'Username already taken', user: req.session.user })
  }

  const duplicateEmail = await collection.findOne({ email: email })
  if (duplicateEmail) {
    return res.render('account.ejs', { title: "Your account", error: 'Email already taken', user: req.session.user })
  }

  await collection.updateOne(
    { username: currentUsername },
    {
      $set: {
        email: email,
        username: username,
      },
    }
  )

  req.session.user = { 
    username: username,
    email: email,
  }

  res.render('account.ejs', { title: 'Account', user: req.session.user, error: null })
}

async function onEditPassword(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const password = xss(req.body.password)
  const currentUsername = req.session.user.username

  const hashedPassword = await bcrypt.hash(password, 10)

  await collection.updateOne(
    { username: currentUsername },
    {
      $set: {
        password: hashedPassword,
      },
    }
  )
  
  res.render('account.ejs', { title: 'Account', user: req.session.user, error: null })
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
 
})

async function onForgotAuth(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const username = xss(req.body.username)
  const email = xss(req.body.email)

  const user = await collection.findOne({
    username: username,
    email: email
  })

  if (user) {
    const token = crypto.randomBytes(20).toString('hex')
    const expires = Date.now() + 3600000 // 1 hour
    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: expires
        }
      }
    )
    const mailTemplate = {
      from: '"MyJam Support" <myjam.help@gmail.com>',
      to: email,
      subject: 'Password reset',
      html: `
        <p>Hi ${username},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="http://localhost:4497/reset/${token}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br/>The MyJam Team</p>
        <br/>
        <img src="https://lukaspelberg.github.io/FED/images/myjam.svg" alt="MyJam logo" width="50" height="50">
        `
    }

    transporter.sendMail(mailTemplate)
    
    res.render('confirm.ejs', { title: 'Confirm', email : user.email, user: req.session.user }) 
  } else {
    res.render('reset.ejs', { title: 'Reset Password', error: 'Invalid username or password', user: req.session.user })
  }
}

async function onResetPassword(req, res) {
    const token = req.body.token
    const newPassword = xss(req.body.password)

    const dataBase = client.db(process.env.DB_NAME)
    const collection = dataBase.collection(process.env.DB_COLLECTION)

    const user = await collection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.render('reset.ejs', { title: 'Reset Password', error: 'Password reset token is invalid or has expired', user: req.session.user })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      }
    )

    req.session.user = { 
      username: user.username,
      email: user.email,
      password: hashedPassword
    }

    res.render('login.ejs', { title: 'Login', user: req.session.user })
  }


async function addToFavorites(req, res) {
  console.log("hij laadt")
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  try {
    await collection.updateOne(
      { username: req.session.user.username },
      {
        $addToSet: {
          favorites: req.body.spotifyId
        }
      }
    )
    console.log("Updaten gaat goed")
    res.redirect(req.get('Referer') || '/');
  } catch {
    console.log('Updaten gaat niet goed')
    res.redirect(req.get('Referer') || '/');
  }
}

async function removeFromFavorites(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  try {
    await collection.updateOne(
      { username: req.session.user.username },
      {
        $pull: {
          favorites: req.body.spotifyId
        }
      }
    )
    res.redirect(req.get('Referer') || '/');
  } catch {
    res.redirect(req.get('Referer') || '/');
  }
}

async function onFriends(req, res) {

  if (!req.session.user) {
    return res.redirect('/login')
  }

  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)
  const users = await collection.find().toArray()
  const user = await collection.findOne({ username: req.session.user.username })
  const friends = user.friends || []

  const message = req.session.message
  delete req.session.message
  

  res.render('friends.ejs', { title: 'friends', users: users, user: req.session.user, friends: friends, message: message})
}

async function onAddFriend(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const friend = req.body.friend
  const user = req.session.user.username

 await collection.updateOne(
   { username: user },
    { $addToSet: { friends: friend } }
  )

  req.session.message = `You have added ${friend} as a friend.`

  res.redirect('/friends',)
}

async function onRemoveFriend(req, res) {
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection(process.env.DB_COLLECTION)

  const friend = req.body.friend
  const user = req.session.user.username

  await collection.updateOne(
    { username: user },
    { $pull: { friends: friend } }
  )

  req.session.message = `You have removed ${friend} as a friend.`

  res.redirect('/friends')
}  

async function onProfile(req, res){
  const dataBase = client.db(process.env.DB_NAME)
  const collection = dataBase.collection('music-data') // Zorg dat dit de juiste collectie is
  
  const usersCollection = dataBase.collection(process.env.DB_COLLECTION)
  let user = null
  let favorites = []

  user = await usersCollection.findOne({ username: req.params.username })
  favorites = user.favorites

  favorites = user.favorites || []

  if (favorites.length === 0) {
    // Render profile2.ejs if the user has no favorites
    return res.render('noFavorites.ejs', { title: 'Profile', user: req.session.user, profile: user, })
  }
  
  // Kijk in user database naar de favorites en store die in een variabele 
  // Laat alleen de tracks zien die hetzelfde spotifyId hebben als de favorites.

  const tracks = await collection.find({ spotifyId: { $in: favorites } }).toArray();
    tracks.forEach(track => {
      track.isFavorite = favorites.includes(track.spotifyId);
    })

  res.render('profile.ejs', { title: 'Profile', user: req.session.user, profile: user, tracks: tracks })

}
