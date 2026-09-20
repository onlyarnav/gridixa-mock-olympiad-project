import mongoose, { Document, Schema } from "mongoose";

export interface IOlympiadCooldown extends Document {
  userId: mongoose.Types.ObjectId;
  submittedAt: Date;
  cooldownUntil: Date;
}

const olympiadCooldownSchema = new Schema<IOlympiadCooldown>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    cooldownUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.OlympiadCooldown ||
  mongoose.model<IOlympiadCooldown>("OlympiadCooldown", olympiadCooldownSchema);
