const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rwqozng.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('civicPhotography').collection('services');

        app.get('/', async (req, res) => {
            const query = {}
            // const size = parseInt(req.query.size);
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
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