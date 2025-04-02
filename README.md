# MyJam <img src="myjam.svg" alt="MyJam Logo" width="30" height="30" style="vertical-align: middle;">

Do you ever feel lost in the countless amounts of songs you can learn? Are you not sure which songs are too difficult for your instrument? 

Look no further! MyJam is an new program made just for you, that innovates on existing song finders on the market. With countless instruments supported, you are bound to find new songs in seconds! 

The process is easy, add your instruments, set your music level and choose a genre. In seconds, the MyJam database will deliver with countless of new songs you can learn. Below is a in depth guide how to install it on your device. 

## Installation guide 

### Creating your database

Before starting the installation we need to create a database via mongodb. We recommend using compass, for easier user interface. you'll need to initialize a database with the following collections:

"users"
"music-data"

### Initializing your .env file

After you've made your very own database you can paste the key data in your personal .env file. Your env file needs to be formatted like this in order to work.

DB_HOST= Your host \
DB_NAME= Your database name \
DB_USERNAME= Your username for the database \
DB_PASSWORD= Your database password \
DB_COLLECTION= Collection for users \
SESSION_SECRET= Your session key (You can think of a key yourself) \
SPOTIFY_CLIENT_ID= Your spotify client id \
SPOTIFY_CLIENT_SECRET= Your sportify secret \
SPOTIFY_REDIRECT_URI= The spotify callback url. \
EMAIL_USERNAME= An email adress to send email forgot functions. \
EMAIL_PASSWORD= Your email adress app password (its important that its an app password, most mail services provide these passwords. We used gmail for testing) 

You can learn more about the spotify api on here: https://developer.spotify.com/documentation/web-api 

### Filling up the database 

Now that the .env is complete the basic functionalities of Myjam are in working order. You may be wondering: "but where are the songs?" That is the next step in the guide.

To add songs in the database you'll need to our very own Spotify Scraper <br> This is the link to the repo: https://github.com/Manueldh/spotify-scraper 
The spotify scraper can search for almost any genre you can think off, so the limit is the sky. Once you've filled up your database MyJam is ready to work!

## Credits
MyJam has been a passion project by 4 talented people: <br>
Manuel den Hartog <br>
Marieke Derks <br>
Vincent de Jager <br>
Luka Spelberg <br>

Please read the License in this repository to see how you can use our program
