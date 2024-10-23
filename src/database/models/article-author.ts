import { Schema, Types } from 'mongoose';


export const ArticleAuthorSchema = new Schema(
  {
    id: Types.ObjectId,
    name: String,
  },
  { timestamps: false, versionKey: false, _id: false },
);