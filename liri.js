require("dotenv").config();

var request = require("request");

var fs = require("fs");

var keys = require("./keys.js");

var figlet = require('figlet');

var columnify = require('columnify')

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var addedToLogFile = "Results added to log.txt file."

// Function for logging data to the log.txt
function logData(logResults) {

    fs.appendFile("log.txt", logResults + "\r\n", function (err) {

        if (err) {
            console.log(err);
        }
    });
}

// Function for the command getMeSpotify
function getMeSpotify(search) {
    var songname = search;
    var logResults = ""
    if (!search) {
        var songname = "The Sign Ace of Base";
    }

    figlet(search, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        console.log("=======================================================================================================");
        console.log("liri command: spotify-this-song " + songname);
    });

    spotify.search({ type: "track", query: songname }, function (error, data) {

        if (!error) {
            var song = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (song[i]) {
                    var artists = "unavailable";
                    if (song[i].artists[0]) {
                        artists = "";
                        for (x = 0; x < song[i].artists.length; x++) {
                            artists += song[i].artists[x].name
                            if (x + 1 < song[i].artists.length) {
                                artists += ", ";
                            }
                        }
                    }
                    var preview = "unavailable";
                    if (song[i].preview_url) {
                        preview = song[i].preview_url;
                    }
                    var music =
                        "=======================================================================================================" + "\r\n" +
                        "Song #" + (i + 1) + "\r\n" +
                        //Output the artist
                        "Artist: " + song[i].artists[0].name + "\r\n" +
                        //Output the song's name.
                        "Song title: " + song[i].name + "\r\n" +
                        //Output a preview link of the song from Spotify.
                        "Preview song: " + song[i].preview_url + "\r\n" +
                        //Output the album that the song is from.
                        "Album: " + song[i].album.name + "\r\n" +
                        "=======================================================================================================";

                    logResults += music;
                }
            }
        } else {
            console.log("Error :" + error);
        }
        console.log(logResults);
        console.log(addedToLogFile);
        logData(logResults);
    });

}

// Function for the command getMeMovies
var getMeMovie = function (movieName) {

    if (movieName === undefined) {
        movieName = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!")
    }

    figlet(movieName, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        console.log("=======================================================================================================")
        console.log("liri command: movie-this " + movieName)
    });

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(url, function (error, response, body) {

        var movieInfo = JSON.parse(body);

        var movieResult =
            //Line break
            "=======================================================================================================" + "\r\n" +
            //Title of the movie.
            "Title: " + movieInfo.Title + "\r\n" +
            //Year the movie came out.
            "Year movie was released: " + movieInfo.Year + "\r\n" +
            //IMDB Rating of the movie.
            "IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +
            //Rotten Tomatoes rating of the movie.
            "Rotten Tomatoes rating (out of 100%): " + movieInfo.Ratings[1].Value + "\r\n" +
            //Country where the movie was produced.
            "Filmed in: " + movieInfo.Country + "\r\n" +
            //Language of the movie.
            "Language: " + movieInfo.Language + "\r\n" +
            //Plot of the movie.
            "Movie plot: " + movieInfo.Plot + "\r\n" +
            //Actors in the movie.
            "Actors: " + movieInfo.Actors + "\r\n" +
            //Line break
            "======================================================================================================="

        //Output the movie information to the terminal.
        console.log(movieResult);
        console.log(addedToLogFile);
        //Output the movie information to the log.txt file.
        logData(movieResult);
    });
};

// Function for the command doWhatItSays
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var songdataArray = data.split(",");

        getMeSpotify(songdataArray[1]);
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
            console.log("\n " + "Type any of the following commands after - 'node liri.js': " + "\n" +
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