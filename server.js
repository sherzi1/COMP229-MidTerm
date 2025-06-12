const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base movie array (5 originals + 2 personalized for Student ID ending in 7)
let movies = [
  { title: 'The Matrix', genre: 'Sci-Fi', year: 1999, director: 'Wachowski Brothers' },
  { title: 'Titanic', genre: 'Romance', year: 1997, director: 'James Cameron' },
  { title: 'The Godfather', genre: 'Crime', year: 1972, director: 'Francis Ford Coppola' },
  { title: 'Toy Story', genre: 'Animation', year: 1995, director: 'John Lasseter' },
  { title: 'Inception', genre: 'Sci-Fi', year: 2010, director: 'Christopher Nolan' },
  // Personalized additions (ID ends in 7 = 2020–2024)
  { title: 'Oppenheimer', genre: 'Drama', year: 2023, director: 'Christopher Nolan' },
  { title: 'Dune: Part Two', genre: 'Sci-Fi', year: 2024, director: 'Denis Villeneuve' }
];

// GET all movies
app.get('/api/movies', (req, res) => {
  res.status(200).json(movies);
});

// GET movies by genre
app.get('/api/movies/filter', (req, res) => {
  const genre = req.query.genre?.toLowerCase();
  if (!genre) return res.status(400).json({ error: 'Genre is required' });

  const filtered = movies.filter(m => m.genre.toLowerCase() === genre);
  res.status(200).json(filtered);
});

// GET movie by ID
app.get('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0 || id >= movies.length)
    return res.status(404).json({ error: 'Movie not found' });

  res.status(200).json(movies[id]);
});

// POST new movie
app.post('/api/movies', (req, res) => {
  const { title, genre, year, director } = req.body;
  if (!title || !genre || !year || !director)
    return res.status(400).json({ error: 'Missing movie information' });

  const newMovie = { title, genre, year, director };
  movies.push(newMovie);
  res.status(201).json({ message: 'Movie added', movie: newMovie });
});

// PUT update movie
app.put('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0 || id >= movies.length)
    return res.status(404).json({ error: 'Movie not found' });

  const { title, genre, year, director } = req.body;
  if (!title || !genre || !year || !director)
    return res.status(400).json({ error: 'Missing movie information' });

  movies[id] = { title, genre, year, director };
  res.status(200).json({ message: 'Movie updated', movie: movies[id] });
});

// DELETE movie
app.delete('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0 || id >= movies.length)
    return res.status(404).json({ error: 'Movie not found' });

  const deleted = movies.splice(id, 1);
  res.status(200).json({ message: 'Movie deleted', movie: deleted[0] });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
