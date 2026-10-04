import app from './app';
import { connectToDatabase } from './config/database';

const port = Number(process.env.PORT || 8000);

export const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

async function startServer(): Promise<void> {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`OctoFit API listening on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit API:', error);
    process.exitCode = 1;
  }
}

void startServer();