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

      app.get('/tools', async(req,res) => {
        const query = {};
        const cursor = toolsCollection.find(query);
        const tools = await cursor.toArray();
        res.send(tools) 
      });


      app.get('/tools/:id', async(req, res) => {
        const id = req.params.id; 
        const query = {_id: ObjectId(id)};
        const tools = await toolsCollection.findOne(query);
        res.send(tools) 
      })

  
    } finally { 
    //   await client.close(); 
    }
  
  }
  
  run().catch(console.dir);

app.listen(port, () => {
    console.log('successfully connected', port)
})

 