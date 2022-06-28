const express = require('express');
require('dotenv').config();
const artsroutes = require('./routes/art');
const favoritesroutes = require('./routes/favorite');
const artistsroutes = require('./routes/artists');
const tagsroutes = require('./routes/tag');

const path = require("path");
const cors = require('cors');

//swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Art API',
            version: '1.0.0',
            description: 'API for Art',
            contact: {
                name: "SaintRoguer"
            },
            servers: [process.env.SERVERS],
        },
    },
    apis: [`${path.join(__dirname, './routes/*.js')}`],
}



//settings
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(express.json());
app.use(cors());
app.use('/api', artsroutes, favoritesroutes, artistsroutes, tagsroutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

//routes
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.listen(port, () => console.log('Server started on port 9000', port));