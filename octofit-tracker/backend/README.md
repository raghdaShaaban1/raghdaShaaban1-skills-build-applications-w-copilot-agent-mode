# OctoFit logic tier

The TypeScript/Express API listens on port `8000` and connects to MongoDB
database `octofit_db`. Set `MONGODB_URI` to override the default local
connection string; `PORT` can override the API port. In Codespaces, the
reported API base URL uses `CODESPACE_NAME`.

Run `npm run dev` for development, `npm run build` to compile, and
`npm start` to run the compiled server. The server starts only after the
database connection succeeds.

All data endpoints support `GET` (list), `GET /:id`, `POST`, `PATCH /:id`,
and `DELETE /:id`:

- `/api/users/`: `name`, `email`, `username`
- `/api/teams/`: `name`, optional `description`, optional user-id `members`
- `/api/activities/`: user-id `user`, `activityType`, `durationMinutes`,
  `caloriesBurned`, optional `date`
- `/api/leaderboard/`: user-id `user`, `points`; list results sort by points
  descending
- `/api/workouts/`: user-id `user`, `title`, `description`, `activityType`,
  `durationMinutes`, and `difficulty` (`beginner`, `intermediate`, or `advanced`)

`GET /api/health/` reports API/database readiness, and `GET /api/` lists
available resources. Invalid requests return JSON errors with appropriate
HTTP status codes.
