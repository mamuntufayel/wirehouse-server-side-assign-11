const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// getting

const res = require("express/lib/response");
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
    // Getting all data
    app.get("/products", async (req, res) => {
      const q = req.query;
      const cursor = ProductCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Getting a data

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await ProductCollection.findOne(filter);
      res.send(result);
    });

    // Make change to a data object
    app.put("/product/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          price: data.price,
          description: data.description,
          img: data.img,
          quantity: data.quantity,
          supplier: data.supplier,
        },
      };
      const result = await ProductCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete an operation
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await ProductCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to port", port);
});
