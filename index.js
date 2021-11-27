
// -------------------All require---------------------------------------------->

// $ npm install express mongodb cors dotenv
const port = process.env.PORT|| 5000;

var express = require('express')
var cors = require('cors')
var app = express()
require('dotenv').config()
const ObjectId=require("mongodb").ObjectId;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient } = require('mongodb');
// ----------------------------------------------------------------->





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.saehn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)



async function run() {
  try {
    await client.connect();
    console.log("got")
    const database = client.db("food_delivery");
    const orderCollection = database.collection("items");
    const SingleorderCollection = database.collection("Singleitem");

// ------------------GET Api----------------------
    app.get('/item', async(req, res) => {
      // res.send('Hello hhhhhWorld!')
      const cursor =orderCollection.find({});
      const users=await cursor.toArray();
      res.send(users);


    })


    // ---------------------------GET single service----------------
    app.get('/item/:id', async(req, res) => {
     const id=req.params.id;
     console.log("Gettind service",id);

     const query={_id:ObjectId(id)};
    //  const service=await orderCollection.findone(query);
     const service = await orderCollection.findOne(query);
     res.json(service);



    })























// ---------------------------post Api---------------------
  // const result = await orderCollection.insertOne(doc);

  app.post('/manage',async(req, res)=>{
    const service=req.body;
    const result = await orderCollection.insertOne(service);
    console.log("hit the api",service);
    console.log("hit the api",result);


    res.json(result);
  })



  // ----------------add cart post----------
  app.post('/addorder',async(req, res)=>{
    const service=req.body;
    const result = await SingleorderCollection.insertOne(service);
    console.log("hit the api",service);
    console.log("hit the api",result);


    res.json(result);
  })


  // ------------------ cart all order Api----------------------
  app.get('/singleuser', async(req, res) => {
    // res.send('Hello hhhhhWorld!')
    const cursor =SingleorderCollection.find({});
    const users=await cursor.toArray();
    res.send(users);


  })

// ----------------------load cart single order-----------------
  app.get("/singleuser/:id",async(req,res)=>{
   const id=req.params.id;
   console.log("getting specific service",id);
   const query={_id:id};

   const service=await SingleorderCollection.findOne(query);
   res.json(service);
  })


// ---------------------Delete

app.delete("/singleuser/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:(id)};
  const result = await SingleorderCollection.deleteOne(query);
  res.json(result)
})





// --------------------------Delete API--------------------------


app.delete("/item/:id",async(req,res)=>{
  const id=req.params.id;

  const query={_id:ObjectId(id)};
  const result =await orderCollection.deleteOne(query);
  console.log("deleting user with id",result);
  // res.json(1);
  res.json(result);
})












  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   // client.close();
// });



app.use(express.json())
app.get('/', (req, res) => {
    res.send('HelloG World!')
  })
  
  app.listen(port, () => {
    console.log("Server running")
  })