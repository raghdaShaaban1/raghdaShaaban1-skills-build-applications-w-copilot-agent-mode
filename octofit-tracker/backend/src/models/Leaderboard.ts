import { model, Schema, Types } from 'mongoose';

export interface LeaderboardEntry {
  user: Types.ObjectId;
  points: number;
}

const leaderboardSchema = new Schema<LeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export default model<LeaderboardEntry>('Leaderboard', leaderboardSchema);
