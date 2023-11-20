import express from 'express';
import bodyParser from 'body-parser';


import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI;


const app = express();
const port = process.env.PORT || 3000 ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const collectionName = "Snacks_and_calories";
const client = new MongoClient(uri, { 
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    console.log("Attempting to connect to MongoDB");
    await client.connect();
    console.log("Connected to MongoDB")
    return client.db("SnacksDB"); //Change this to the name of your db that you keyed in on MongoDB
  } catch (err) {
    console.error("Error:", err);
  } 
}

app.use(async (req, res, next) => {
  req.db = await connect();
  next();
});


app.get("/", (req, res) => {
    res.render("index.ejs");
});


const calories_per_km = 60;

app.post('/submit', async (req, res) => {
    const snack = req.body.SnackSelection;
    let distance = 3; 
    console.log(snack);

    try {
      const collection = req.db.collection("Snacks_and_calories"); 
      const document =  await collection.findOne({"name":snack});  
      console.log(document);
      if (document){
        distance = Math.round(document.calories/calories_per_km);
        res.render("index.ejs", {snack: snack, distance: distance});
      } else{
        res.status(500).send("Item not found");
      }
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching data.");
    } 
});

app.post('/submitvote', async (req, res) => {
  const vote = req.body.vote;
  const snack = req.body.snack;
  let distance; 
  console.log(vote, snack);

  try {
    const collection = req.db.collection("Snacks_and_calories"); 
    let document
    if (vote ==="eat"){
       document =  await collection.updateOne({"name":snack}, {$inc: {eat:1}}); 
    } else{
       document =  await collection.updateOne({"name":snack}, {$inc: {avoid:1}}); 
    }
    document = await collection.findOne({"name":snack}); 
    console.log(document);
    if (document){
      const eat = document.eat;
      const avoid = document.avoid;
      distance = Math.round(document.calories/calories_per_km);
      let similar;
      if (vote ==="eat"){similar = eat/(eat+avoid)} else {similar = avoid / (eat+avoid)}
      similar = Math.round(similar*100);
      console.log(similar);
      res.render("index.ejs", {similar: similar, snack: snack, distance: distance});
    } else{
      res.status(500).send("Item not found");
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching data.");
  } 
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
