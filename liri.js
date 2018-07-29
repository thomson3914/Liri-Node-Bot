require("dotenv").config();

var request = require("request");

var fs = require("fs");

var keys = require("./keys.js");

var figlet = require('figlet');

var columnify = require('columnify')

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);


// Log input into log.txt
var addToLog = "node liri.js ";

for (var i = 2; i < process.argv.length; i++) {
    addToLog += process.argv[i] + " ";
}
addToLog = addToLog.substring(0, addToLog.length - 1);
fs.appendFile("log.txt", addToLog + '\n', function (err) {
    if (err) {
        console.log('Error in user logging: ' + err);
    }
});


var getArtistNames = function (artist) {
    return artist.name;
};

var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "The Sign";
    }

    figlet(songName, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data);
	});

    spotify.search({
        type: "track",
        query: songName
    },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            var song = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                console.log("");
                console.log(i);
                console.log("//=================== Song Details ======================//");
                console.log("artist(s): " + song[i].artists.map(getArtistNames));
                console.log("song name: " + song[i].name);
                console.log("preview song: " + song[i].preview_url);
                console.log("album: " + song[i].album.name);
                console.log("//=======================================================//");
            }
        }
    );
};

var getMeMovie = function (movieName) {

    if (movieName === undefined) {
        movieName = "Mr. Nobody";
        log += "If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/> - It's on Netflix!";
    }

	figlet(movieName, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data)
	});

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);
            console.log("");
            console.log("//================== Movie Details ======================//");
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            console.log("//=======================================================//");
        }
    });
};

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log("");
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};


// Function for determining which command is executed
var pick = function (caseData, functionData) {
    switch (caseData) {
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMeMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("\n "+"Type any of the following commands after - 'node liri.js': " + "\n" +
            " - spotify-this-song 'any song title' " + "\n" + 
            " - movie-this 'any movie title' " + "\n" + 
            " - do-what-it-says " + "\n" +
            " Please use quotes for multiword titles!");
    }
};

var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);