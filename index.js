const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.odnbhoe.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("Assignment-11").collection("services");
        const reviewerCollection = client.db("Assignment-11").collection("reviews");

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // for taking one service data from db
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(query);
            res.send(services);
        })
        // review api
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewerCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewerCollection.insertOne(review);
            res.send(result);
        })
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewerCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewerCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await serviceCollection.insertOne(user)
            res.send(result);
        });


    } finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Genius car server is running');
})

app.listen(port, () => {
    console.log(`Genius Car server Running on ${port}`);
})