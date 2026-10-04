import { model, Schema, Types } from 'mongoose';

export interface Workout {
  user: Types.ObjectId;
  title: string;
  description: string;
  activityType: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const workoutSchema = new Schema<Workout>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    activityType: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
  },
  { timestamps: true },
);

export default model<Workout>('Workout', workoutSchema);
