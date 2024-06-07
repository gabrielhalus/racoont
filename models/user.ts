import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  },
);

export type TUser = InferSchemaType<typeof UserSchema> & {
  _id: Types.ObjectId;
};

const User = models.User || model('User', UserSchema);
export default User;
