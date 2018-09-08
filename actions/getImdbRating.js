server.post('/get-imdb-rating', (req, res) => {

    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
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
});