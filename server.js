import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true }
  });

  app.use(vite.middlewares);

  app.listen(process.env.PORT || 5173, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}

startServer();
