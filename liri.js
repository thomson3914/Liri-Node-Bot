require("dotenv").config();

var request = require("request");

var fs = require("fs");

var keys = require("./keys.js");

var figlet = require('figlet');

var columnify = require('columnify')

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var addedToLogFile = "Results added to log.txt file."

function logData(logResults) {

    fs.appendFile("log.txt", logResults + "\r\n", function (err) {

        if (err) {
            console.log(err);
        }
    });

}

var getArtistNames = function (artist) {
    return artist.name;
};

var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "The Sign";
    }

    figlet(songName, function (err, data) {
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

                var defaultSong =
                    "=======================================================================================================" + "\r\n" +
                    "liri command: spotify-this-song " + song[5].name + "\r\n" +
                    "=======================================================================================================" + "\r\n" +
                    "Song #" + (i + 1) + "\r\n" +
                    //Output the artist
                    "Artist: " + song[5].artists[0].name + "\r\n" +
                    //Output the song's name.
                    "Song title: " + song[5].name + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "Preview song: " + song[5].preview_url + "\r\n" +
                    //Output the album that the song is from.
                    "Album: " + song[5].album.name + "\r\n" +
                    "=======================================================================================================";

                //Output default song info to terminal
                console.log(defaultSong);
                console.log(addedToLogFile);

            }
            //Output default song info to log.txt file.
            logData(defaultSong);
        }



    );
};

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
    });

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(url, function (error, response, body) {

        var movieInfo = JSON.parse(body);

        // Create variable to hold Rotten Tomatoes Rating.
        var tomatoRating = movieInfo.Ratings[1].Value;

        var movieResult =
            //Line break
            "=======================================================================================================" + "\r\n" +
            //Output the liri command plus movieName
            "liri command: movie-this " + movieName + "\r\n" +
            //Line break
            "=======================================================================================================" + "\r\n" +
            //Title of the movie.
            "Title: " + movieInfo.Title + "\r\n" +
            //Year the movie came out.
            "Year movie was released: " + movieInfo.Year + "\r\n" +
            //IMDB Rating of the movie.
            "IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +
            //Rotten Tomatoes rating of the movie.
            "Rotten Tomatoes rating (out of 100%): " + tomatoRating + "\r\n" +
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
        //Output the movie information to the log.txt file.
        logData(movieResult);
    });
};


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