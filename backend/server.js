const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { connectDatabase } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const applicationRoutes = require('./routes/application.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase(env.mongoUri);
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
