import { compare, genSalt, hash } from 'bcryptjs';
import { InferSchemaType, Schema, model, models } from 'mongoose';

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

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

export type TUser = InferSchemaType<typeof UserSchema> & {
  _id: any;
  id: any;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
};

UserSchema.pre('save', async function () {
  const salt = await genSalt(16);
  this.password = await hash(this.password, salt);
});

const User = models.User || model('User', UserSchema);
export default User;
