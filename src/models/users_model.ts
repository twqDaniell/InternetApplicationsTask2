import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  username: string;
  email: string;
  password: string;
}

const postSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model<IUser>("Posts", postSchema);

export default userModel;
