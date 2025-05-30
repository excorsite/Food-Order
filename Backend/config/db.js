import mongoose from "mongoose";

export const connectDB = async () => {
  (
    await mongoose.connect(
      "mongodb+srv://BossSuyog:9867979323@cluster0.hdhvnyf.mongodb.net/food order/backend"
    )
  ).then(() => console.log("DB Connected"));
};
