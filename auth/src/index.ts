import mongoose from "mongoose";
import { app } from "./app";
(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT key must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI key must be defined");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(3001, () => {
    console.log("port: => 3000!!!");
  });
})();
