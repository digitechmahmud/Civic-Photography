const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// DB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rwqozng.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// CRUD Operations
async function run() {
    try {
        const serviceCollection = client.db('civicPhotography').collection('services');
        const reviewCollection = client.db('civicPhotography').collection('reviews');

        // Get data from database operation

        app.get('/', async (req, res) => {
            const query = {}
            const sort = { length: -1 };
            // const size = parseInt(req.query.size);
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).sort(sort).toArray();
            res.send(services);
        })
        app.get('/services', async (req, res) => {
            const query = {}
            // const size = parseInt(req.query.size);
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
    

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {id};
            const cursor = reviewCollection.find(query).sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        // POST data from client site to database operation

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

       

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const updateReview = {
                $set: {
                    message: review.message,
                }
            }
            const result = await reviewCollection.updateOne(query, option, updateReview);
            res.send(result);
        })

        // Delete data from client site to database operation
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        
    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log(`Server listening from port ${port}`);
})