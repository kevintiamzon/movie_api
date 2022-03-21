const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

// Requests
app.get('/movies', (req, res) => {
    res.send('JSON with a list of all movies');
});

app.get('/', (req, res) => {
    res.send('Check out these movies!');
});

app.get('/movies/:title', (req, res) => {
    res.send('JSON with description about a specific movie');
});

app.get('/movies/genres/:genre', (req, res) => {
    res.send('JSON object holding data about a specific genre');
});

app.get('/movies/directors/:directorName', (req, res) => {
    res.send('JSON Object holding data about a specific director (e.g. Bio, birth year, death year)');
});

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    } else {
        const message = ('Please enter a username');
        res.status(400).send(message);
    }
});

app.put('/users/:username', (req, res) => {
    const newUsername = req.body;
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        user.username = newUsername.username;
        res.status(201).json(user)
    } else {
        res.status(400).send('Unable to update username.');
    }
});

app.post('/users/:username/favorites/:movie', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        user.favorites.push(req.params.movie);
        res.status(200).send(req.params.movie + ' was added to your favorites list.');
    } else {
        res.status(400).send('Unable to add to favorites.')
    };
});

app.delete('users/:username/favorites/:movie', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        user.favorites = user.favorites.filter((mov) => { return mov !== req.params.movie });
        res.status(200).send(req.params.movie + ' was removed from your favorites list');
      } else {
        res.status(400).send('Unable to remove from favorites.')
      };
});

app.delete('/users/:username', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        users = users.filter((user) => { return user.username !== req.params.username });
        res.status(201).send(req.params.username + ' was deleted.');
    } else {
        res.status(404).send('User not found.');
  }
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