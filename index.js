const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_ASSIGNMENT}:${process.env.DB_PASSWORD}@cluster0.a6obg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


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
  
    } finally { 
    //   await client.close(); 
    }
  
  }
  
  run().catch(console.dir);

app.listen(port, () => {
    console.log('successfully connected', port)
})

 