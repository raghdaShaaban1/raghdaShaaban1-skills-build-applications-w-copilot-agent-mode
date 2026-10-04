import { Router } from 'express';
import mongoose, { Model } from 'mongoose';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

function createResourceRouter<T>(
  resource: Model<T>,
  sort?: Record<string, 1 | -1>,
): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    response.json(await resource.find().sort(sort ?? {}).lean());
  });

  router.get('/:id', async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }

    const record = await resource.findById(id).lean();
    if (!record) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }

    response.json(record);
  });

  router.post('/', async (request, response) => {
    if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
      response.status(400).json({ error: 'A JSON object is required' });
      return;
    }

    const record = await resource.create(request.body);
    response.status(201).json(record);
  });

  router.patch('/:id', async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }

    if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
      response.status(400).json({ error: 'A JSON object is required' });
      return;
    }

    const record = await resource
      .findByIdAndUpdate(id, request.body, {
        new: true,
        runValidators: true,
      })
      .lean();
    if (!record) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }

    response.json(record);
  });

  router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }

    const record = await resource.findByIdAndDelete(id).lean();
    if (!record) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }

    response.status(204).end();
  });

  return router;
}

const router = Router();

router.get('/', (_request, response) => {
  response.json({
    users: '/api/users/',
    teams: '/api/teams/',
    activities: '/api/activities/',
    leaderboard: '/api/leaderboard/',
    workouts: '/api/workouts/',
  });
});

router.use('/users', createResourceRouter(User));
router.use('/teams', createResourceRouter(Team));
router.use('/activities', createResourceRouter(Activity));
router.use('/leaderboard', createResourceRouter(Leaderboard, { points: -1 }));
router.use('/workouts', createResourceRouter(Workout));

export default router;
