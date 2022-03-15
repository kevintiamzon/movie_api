const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

// GET Requests
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Check out these movies!');
});

// Serves all files within the public folder 
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something Broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});