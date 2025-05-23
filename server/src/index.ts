import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import ProductPS3Routes from "./routes/productPS3.route";

// configures dotenv to work in your application
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Enable CORS
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => { 
  res.status(200).send("Hello World");
}); 

app.use("/api/productsPS3", ProductPS3Routes);

app.listen(PORT, () => { 
  connectDB();
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});