//create functions for reading file, grabbing twitter info, spotify info,  ombdbgo, 
//(bonus) logging info into log.txt file
require("dotenv").config();

var keys = require('./keys');

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var fs = require("fs");
var request = require("request");

/* Make it so liri.js can take in one of the following commands:
* `my-tweets`
* `spotify-this-song`
* `movie-this`
* `do-what-it-says` 
*/

//parameter arguments for node
var command = process.argv[2];
var requestItem = process.argv[3];

console.log(process.argv);

//user inputs
if (command === "my-tweets") {
    getTweets();
}
else if (command === "spotify-this-song") {
    getSpotify();
}
else if (command === "movie-this") {
    getOMDB(requestItem);
}
else if (command === "undefined") {
    console.log("Type one: tweets, spotify, or omdb");
}

//gets last 20 
function getTweets() {
    var params = { screen_name: 'MattB98760655' };

    //parameters for users twitter info
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            // console.log(JSON.stringify(tweets));
            var count = Math.min(20, tweets.length);

            for (var i = 0; i < count; i++) {
                console.log("Your sweet history of tweets: " + tweets[i].text);
            }
        }
    });
}

//fetches spotify song/artist information
function getSpotify() {
    var spotify = new Spotify({
        id: '8826a51fab644f9abc31f1a49a163983',
        secret: 'e600590c2c7a492a9b1890603ee8b8e3'
    });

    //search function
    spotify.search({
        type: 'track',
        query: requestItem
    }, function (error, data) {
        if (error) {
            return console.log('Error ocurred: ' + error);
        }
        console.log("Song name: " + data.tracks.items[0].name);

        //pathway into JSON package set to variable
        var songArtists = data.tracks.items[0].artists;

        //stores in empty string
        var artistString = "";

        for (var i = 0; i < songArtists.length; i++) {
            artistString += songArtists[i].name + " ";
        }
        console.log("Artist: " + artistString);
        console.log("Song name: ");
        console.log("Link: ");
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

//connects to random.txt
var readRandom = function () {

    // Running the readFile module that's inside of fs. this connects to random.txt
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        output = data.split(",");
    });
}

function getOMDB (movieName) {
    if (movieName === "undefined") {
        movieName === "Mr. Nobody";
    }

    var url = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var jsonData = JSON.parse(body);
            //console.log(jsonData);
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[0]);
        }
    });
}
