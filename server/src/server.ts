import express from 'express';

// import db from './config/connection.js';
import routes from './routes/index.js';

// await db();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));

   app.get('*', (_req, res) => {
    res.sendFile('../client/dist/index.html');
  });
}

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
