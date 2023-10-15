import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/router'
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api', router);

const connectDB = (url) => {
    return mongoose.connect(url, {
      useNewUrlParser: true,
 useUnifiedTopology: true
    })
  }

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
  });



  const start = async () => {
    try {
      // connectDB
      await connectDB(process.env.MONGO_DB_URI);
      app.listen(3000, () => console.log(`Server is listening port ${3000}...`));
    } catch (error) {
      console.log(error);
    }
  };
  
  start();