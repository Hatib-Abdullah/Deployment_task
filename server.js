const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Use environment variables for MongoDB connection details
const mongoUser = process.env.MONGO_USER || 'defaultUser';
const mongoPass = process.env.MONGO_PASS || 'defaultPass';
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017'
// const mongoDb = process.env.MONGO_DB || 'myDatabase';

const uri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/?authSource=admin`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db(); // This line should be inside the try block to ensure db is assigned after a successful connection
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
  }
}

connectToDatabase();

function ensureDbConnection(req, res, next) {
  if (!db) {
    console.error('Database connection not established');
    return res.status(500).json({ error: 'Database connection not established' });
  }
  next();
}

// Serve static files
app.use(express.static('public'));

// Route for serving the add.html page
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

// API endpoint
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await db.collection('data').find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    next(error);
  }
});

// API endpoint for adding data
app.post('/api/data', async (req, res, next) => {
  try {
    const { name, age } = req.body;

    // Validate that the name and age are present
    if (!name || !age) {
      res.status(400).json({ error: 'Please provide both name and age' });
      return;
    }

    // Validate that the age is a number
    if (isNaN(age)) {
      res.status(400).json({ error: 'Age must be a number' });
      return;
    }

    // Insert the data into MongoDB
    const result = await db.collection('data').insertOne({ name, age });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
