const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
//
// DB_USER=mamun
// DB_PASS=pntYJKP8qG2ilJDs

// middleware
app.use(cors());
app.use(express.json());

// getting

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fis18.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const ProductCollection = client.db("electronics").collection("products");
    console.log("db is connected");
    // Adding a new data
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await ProductCollection.insertOne(data);
      res.send(result);
    });
    // Getting data
    app.get("/products", async (req, res) => {
      const q = req.query;
      const cursor = ProductCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
