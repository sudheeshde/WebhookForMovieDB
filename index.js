'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

server.post('/get-movie-details', (req, res) => {

    const agentAction = req.body.queryResult.action;
    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);

    if (agentAction === "getMovieDetails") {

        http.get(reqUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const movie = JSON.parse(completeResponse);
                let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
                dataToSend += `${movie.Title} is a ${movie.Actors} starrer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;

                return res.json({
                    fulfillmentText: dataToSend,
                    source: 'get-movie-details'
                });
            });
        }, (error) => {
            return res.json({
                fulfillmentText: 'Something went wrong!',
                source: 'get-movie-details'
            });
        });
    } else if (agentAction === "getImdbRating") {

        http.get(reqUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const movie = JSON.parse(completeResponse);
                let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
                dataToSend += `IMDB rating of ${movie.Title} is ${movie.imdbRating}`;

                return res.json({
                    fulfillmentText: dataToSend,
                    source: 'get-imdb-rating'
                });
            });
        }, (error) => {
            return res.json({
                fulfillmentText: 'Something went wrong!',
                source: 'get-imdb-rating'
            });
        });

    } else if (agentAction === "known-movie-imdb-rating") {

        http.get(reqUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const movie = JSON.parse(completeResponse);
                let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
                dataToSend += `IMDB rating of ${movie.Title} is ${movie.imdbRating}`;

                return res.json({
                    fulfillmentText: dataToSend,
                    source: 'get-imdb-rating'
                });
            });
        }, (error) => {
            return res.json({
                fulfillmentText: 'Something went wrong!',
                source: 'get-imdb-rating'
            });
        });

    }

});

//let action = req.body.queryResult.action;

//if (action === 'get-imdb-rating') {

// server.post('/get-imdb-rating', (req, res) => {
//
//     const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
//     const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
//     http.get(reqUrl, (responseFromAPI) => {
//         let completeResponse = '';
//         responseFromAPI.on('data', (chunk) => {
//             completeResponse += chunk;
//         });
//         responseFromAPI.on('end', () => {
//             const movie = JSON.parse(completeResponse);
//             let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
//             dataToSend += `IMDB rating of ${movie.Title} is ${movie.imdbRating}`;
//
//             return res.json({
//                 fulfillmentText: dataToSend,
//                 source: 'get-imdb-rating'
//             });
//         });
//     }, (error) => {
//         return res.json({
//             fulfillmentText: 'Something went wrong!',
//             source: 'get-imdb-rating'
//         });
//     });
// });

//}


server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});