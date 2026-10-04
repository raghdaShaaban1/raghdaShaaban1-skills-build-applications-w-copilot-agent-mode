import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with demo users, teams, activities, leaderboard entries, and workouts.
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const users = await Promise.all([
      User.findOneAndUpdate(
        { email: 'alex.morgan@example.test' },
        { $set: { name: 'Alex Morgan', username: 'alexm' } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      User.findOneAndUpdate(
        { email: 'jordan.lee@example.test' },
        { $set: { name: 'Jordan Lee', username: 'jordanlee' } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      User.findOneAndUpdate(
        { email: 'taylor.kim@example.test' },
        { $set: { name: 'Taylor Kim', username: 'taylork' } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
    ]);

    const [alex, jordan, taylor] = users;
    if (!alex || !jordan || !taylor) {
      throw new Error('Unable to create or retrieve the demo users');
    }

    await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Trailblazers' },
        { $set: { description: 'A team focused on outdoor activity.', members: [alex._id, jordan._id] } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Team.findOneAndUpdate(
        { name: 'Fit Falcons' },
        { $set: { description: 'A team building consistent fitness habits.', members: [taylor._id] } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Activity.findOneAndUpdate(
        { user: alex._id, activityType: 'Running', date: new Date('2026-10-01T08:00:00.000Z') },
        {
          $set: {
            durationMinutes: 30,
            caloriesBurned: 280,
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Activity.findOneAndUpdate(
        { user: jordan._id, activityType: 'Cycling', date: new Date('2026-10-02T09:00:00.000Z') },
        {
          $set: {
            durationMinutes: 45,
            caloriesBurned: 390,
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Activity.findOneAndUpdate(
        { user: taylor._id, activityType: 'Swimming', date: new Date('2026-10-03T07:30:00.000Z') },
        {
          $set: {
            durationMinutes: 35,
            caloriesBurned: 310,
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Leaderboard.findOneAndUpdate(
        { user: alex._id },
        { $set: { points: 280 } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Leaderboard.findOneAndUpdate(
        { user: jordan._id },
        { $set: { points: 390 } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Leaderboard.findOneAndUpdate(
        { user: taylor._id },
        { $set: { points: 310 } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Workout.findOneAndUpdate(
        { user: alex._id, title: 'Steady Run' },
        {
          $set: {
            description: 'A comfortable paced run to build aerobic endurance.',
            activityType: 'Running',
            durationMinutes: 30,
            difficulty: 'beginner',
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Workout.findOneAndUpdate(
        { user: jordan._id, title: 'Tempo Ride' },
        {
          $set: {
            description: 'A sustained cycling session with a moderate tempo.',
            activityType: 'Cycling',
            durationMinutes: 45,
            difficulty: 'intermediate',
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      Workout.findOneAndUpdate(
        { user: taylor._id, title: 'Endurance Swim' },
        {
          $set: {
            description: 'A relaxed swim focused on steady laps and technique.',
            activityType: 'Swimming',
            durationMinutes: 35,
            difficulty: 'beginner',
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      ),
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
