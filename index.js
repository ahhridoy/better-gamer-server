const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1xse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected better-gamer");
    const database = client.db("better_gamer");
    const coachesCollection = database.collection("coaches");

    // get all coaches
    app.get("/coaches", async (req, res) => {
      const cursor = coachesCollection.find({});
      const coaches = await cursor.toArray();
      res.send(coaches);
    });

    // get one coach
    app.get("/coachDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const coach = await coachesCollection.findOne(query);
      res.send(coach);
    });

  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
