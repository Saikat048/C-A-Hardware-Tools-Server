const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_ASSIGNMENT}:${process.env.DB_PASSWORD}@cluster0.a6obg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.use(cors());
app.use(express.json());


async function run() {

    try {
  
      await client.connect(); 
      const toolsCollection = client.db("assignment-tools").collection("tools");
      const orderCollection = client.db("assignment-tools").collection("order");
      const infoCollection = client.db("assignment-tools").collection("info");
      const reviewCollection = client.db("assignment-product").collection("review");

      // get tools
      app.get('/tools', async(req,res) => {
        const query = {};
        const cursor = toolsCollection.find(query);
        const tools = await cursor.toArray();
        res.send(tools) 
      });

      // get tools one
      app.get('/tools/:id', async(req, res) => {
        const id = req.params.id; 
        const query = {_id: ObjectId(id)};
        const tools = await toolsCollection.findOne(query);
        res.send(tools) 
      })

      // get review
      app.get('/review', async(req,res) => {
        const query = {};
        const cursor = reviewCollection.find(query).sort({$natural: -1}).limit(3);
        const review = await cursor.toArray();
        res.send(review) 
      });


      // post review
      app.post('/review', async(req, res) => {  
        const order = req.body;  
        console.log(order)
        const result = await reviewCollection.insertOne(order);
        res.send(result)
      }) 


      // post order 
      app.post('/order', async(req, res) => {  
        const order = req.body;  
        // console.log(order)
        const result = await orderCollection.insertOne(order);
        res.send(result)
      }) 


      // get order 
      app.get('/order', async(req,res) => {
        const query = {};
        const cursor = orderCollection.find(query);
        const order = await cursor.toArray();
        res.send(order) 
      });
 
      

      // order delete 
      app.delete('/order/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}; 
        const result = await orderCollection.deleteOne(query);
        res.send(result)
      })



      
      // post info 
      app.post('/info', async(req, res) => {  
        const info = req.body;  
        const result = await infoCollection.insertOne(info);
        res.send(result)
      }) 


      // get info ?
      app.get('/info', async(req,res) => {
        const query = {};
        const cursor = infoCollection.find(query);
        const info = await cursor.toArray();
        res.send(info) 
      });



      // put info email 
      app.put('/info/:email', async(req, res) => {
          const email = req.params.email;
          const update = req.body;
          const filter = {email: email};
          const options = { upsert: true };
          const updateDoc = {

            $set:  update
          };
          const result = await infoCollection.updateOne(filter, updateDoc, options);
          res.send(result)
      })


  
    } finally { 
    //   await client.close(); 
    }
  
  }
  
  run().catch(console.dir);

app.listen(port, () => {
    console.log('successfully connected', port)
})

 