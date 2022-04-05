const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(morgan('common'));

// Requests
// Get a list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/', (req, res) => {
    res.send('Check out these movies!');
});

// Get a movie by Title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get information about a genre
app.get('/genres/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name' : req.params.Name })
     .then((movie) => {
         res.json(movie.Genre.Description);
     })
     .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
     });
});

// Get information about a director
app.get('/directors/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
     .then((movie) => {
         res.json(movie.Director);
     })
     .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
     });
});

//Add A User
/* Expects a JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthdate: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Update a user's info, by username
/* Expects a JSON in this format
{
    Username: String, (required)
    Password: String, (required)
    Email: String, (required)
    Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
 },
 { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
 });
});

// Add a movie to a user's favorites list
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Removes a movie from a user's favorite list
app.delete('/users/:Username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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