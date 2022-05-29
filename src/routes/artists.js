const express = require("express");
const pool = require("../db");
const router = express.Router();
const { body } = require('express-validator');



/**
 * @swagger 
 * components:
 *  schemas:
 *      Artist:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The Artist id
 *              name:
 *                  type: string
 *                  description: Name of the artist
 *          required:
 *              - id
 *              - name
 *          example:
 *              id: 1
 *              name: Harrison Ford
 */

/**
  * @swagger
  * tags:
  *   name: Artists
  *   description: 'Trailerama API'
  */
/**
 * @swagger
 * /api/artists/{id}:
 *  get:
 *    summary: Get an artist by ID
 *    tags: [Artists]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID of the artist
 *    responses:
 *      200:
 *        description: The artist by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Artist'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The artist was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/artists/:id", (request, response) => {
    const id = request.params.id

    if (isNaN(id))
        response.status(400).json({
            code: 400,
            message: 'ID must be an Integer'
        })
    else {
        pool.query('SELECT * FROM actor_actresses WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    code: 404,
                    message: "Artist not found"
                })
            else
                response.status(200).json(results.rows)
        })
    }
});

/**
 * @swagger
 * /api/artists/{id}/image:
 *  get:
 *    summary: Get an image of artist by ID
 *    tags: [Artists]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID of the art
 *    responses:
 *      200:
 *        description: The image of the artist by ID
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Artist'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The artist was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/artists/:id/image", (request, response) => {
    const id = request.params.id

    if (!isNaN(id)) {
        pool.query('SELECT * FROM actor_actresses WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    code: 404,
                    message: "No such art found"
                })
            else {
                const image_type = 'App\\Models\\ActorActress'
                pool.query('SELECT * FROM images WHERE imageable_id = $1 and imageable_type = $2',
                    [results.rows[0].id, image_type], async (error2, results2) => {
                        if (error2)
                            throw error2
                        if (results2.rows.length == 0) {
                            let url = 'http://trailerama.herokuapp.com/images/actor_actress_placeholder.jpg';
                            geting({ url, encoding: null }, (err, resp, buffer) => {
                                response.writeHead(200, { 'Content-Type': 'image/jpg' })
                                response.write(buffer)
                                response.end()
                            });

                        }
                        else {
                            const content = results2.rows[0].image_content
                            const extension = results2.rows[0].extension
                            const extensionR1 = extension.replace('data:', '')
                            const mimeType = extensionR1.replace(';base64,', '')
                            let buff = Buffer.from(content, 'base64')
                            response.writeHead(200, { 'Content-Type': mimeType })
                            response.write(buff)
                            response.end()
                        }

                    })
            }
        })
    }
    else
        response.status(400).json({
            code: 400,
            message: 'ID must be an integer'
        })
});

module.exports = router;