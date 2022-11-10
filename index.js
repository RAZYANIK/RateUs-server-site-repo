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
        // const orderCollection = client.db("geniusCar").collection("orders");

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
        // orders api
        // app.get('/orders', async (req, res) => {
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })


        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result);
        // })
        // app.patch('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const status = req.body.status
        //     const query = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             status: status
        //         }
        //     }
        //     const result = await orderCollection.updateOne(query, updatedDoc);
        //     res.send(result);
        // })
        // app.delete('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await orderCollection.deleteOne(query);
        //     res.send(result);
        // })

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