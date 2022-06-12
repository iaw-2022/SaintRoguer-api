const express = require('express');
require('dotenv').config();
const artsroutes = require('./routes/art');
const favoritesroutes = require('./routes/favorite');
const artistsroutes = require('./routes/artists');

const path = require("path");
const cors = require('cors');

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var guard = require('express-jwt-permissions')();

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

// Auth0
/*var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-v0kfz1dk.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://trailerama-api.herokuapp.com/',
    issuer: 'https://dev-v0kfz1dk.us.auth0.com/',
    algorithms: ['RS256']
});*/


//settings
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(express.json());
app.use(cors());
//app.use(jwtCheck);
app.use('/api', artsroutes, favoritesroutes, artistsroutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

//routes
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.listen(port, () => console.log('Server started on port 9000', port));