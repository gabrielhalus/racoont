import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const SessionSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    token: { type: String, required: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  },
);

export type TSession = InferSchemaType<typeof SessionSchema> & {
  _id: Types.ObjectId;
  id: string;
};

SessionSchema.pre('save', async function (next) {
  try {
    await Session.deleteMany({ userId: this.userId });
    next();
  } catch (error: any) {
    next(error);
  }
});

const Session = models.Session || model('Session', SessionSchema);
export default Session;
