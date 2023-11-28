// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const router = require('./routes/router.js');
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));