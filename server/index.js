const express = require('express');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://nmhnmh123:minhhai3817@mern-learnit.3kkwpyf.mongodb.net/mern-learnit?retryWrites=true&w=majority`,{
            //useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false
        })

        console.log('Connected to Mongo');
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

connectDB()

const app = express();

app.get('/', (req, res) => res.send('hello world'));

const PORT = 5000

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));