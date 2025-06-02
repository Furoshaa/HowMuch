import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testConnection } from "./config/db";
import UsersRoutes from "./routes/users.route";
import WorkScheduleRoutes from "./routes/work_schedule.route";
import WorkExceptionRoutes from "./routes/work_exception.route";
import WorkSessionRoutes from "./routes/work_session.route";

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

app.use("/api/users", UsersRoutes);
app.use("/api/schedules", WorkScheduleRoutes);
app.use("/api/exceptions", WorkExceptionRoutes);
app.use("/api/sessions", WorkSessionRoutes);

app.listen(PORT, () => { 
  testConnection();
  console.log("Server running at PORT:", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});