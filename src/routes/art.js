const express = require("express");
const pool = require("../db");
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *     Art:
 *      type: object
 *      properties:
 *         id:
 *          type: integer
 *          description: The Art id
 *         imbd_id:
 *          type: string
 *          description: The Imbd id
 *         title:
 *          type: string
 *          description: The Art title
 *         slug:
 *          type: string
 *          description: The Art slug
 *         type:
 *          type: string
 *          description: The Art type
 *         year:
 *          type: integer
 *          description: The Art year of release
 *         releaseDate:
 *          type: date
 *          description: The Art release date
 *         duration:
 *          type: integer
 *          description: The Art duration
 *         plot:
 *          type: string
 *          description: The Art plot
 *         userRating:
 *          type: integer
 *          description: The Art user rating
 *         imdbRating:
 *          type: integer
 *          description: The Art imdb rating
 *         director:
 *          type: string
 *          description: The Art director
 *         videoLink:
 *          type: string
 *          description: The Art video link
 *      required:
 *        - id
 *        - title
 *        - slug
 *        - type
 *        - year
 *        - releaseDate
 *        - duration
 *        - plot
 *        - director
 *      example:
 *         id: 1
 *         imbd_id: tt0111161
 *         title: The Shawshank Redemption
 *         slug: the-shawshank-redemption
 *         type: movie
 *         year: 1994
 *         releaseDate: 1994-10-14
 *         duration: 142
 *         plot: Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.
 *         userRating: 9.3
 *         imdbRating: 9.3
 *         director: Frank Darabont
 *         videoLink: https://www.youtube.com/watch?v=6hB3S9bIaco
 */

/**
  * @swagger
  * tags:
  *   name: Arts
  *   description: 'Trailerama API'
  */

/**
 * @swagger
 * /api/arts:
 *  get:
 *    summary: Get all arts
 *    tags: [Arts]
 *    responses:
 *     '200':
 *      description: An array of Arts
 *      content:
 *       application/json:
 *          schema:
 *           type: array
 *           items:
 *           $ref: '#/components/schemas/Art'
 *    '400':
 *       description: Error
 *    '500':
 *       description: Internal server error
 */
router.get("/arts", (request, response) => {
    pool.query('SELECT * FROM arts ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

/**
 * @swagger
 * /api/arts/{slug}:
 *  get:
 *    summary: Get an art by Slug
 *    tags: [Arts]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the art
 *    responses:
 *      200:
 *        description: The art description by slug
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Art'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The art was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/arts/:slug", (request, response) => {
    const slug = request.params.slug
    if (typeof slug === 'string' || slug instanceof String) {
        pool.query('SELECT * FROM arts WHERE slug = $1', [slug], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    error: 404,
                    message: "No such art was found"
                })
            else {
                response.status(200).json(results.rows)
            }
        })
    }
    else
        response.status(400).json({
            code: 400,
            message: 'Slug must be a string'
        })
});

/**
 * @swagger
 * /api/last:
 *  get:
 *    summary: Get last ten arts
 *    tags: [Arts]
 *    responses:
 *     '200':
 *      description: An array of Arts
 *      content:
 *       application/json:
 *          schema:
 *           type: array
 *           items:
 *           $ref: '#/components/schemas/Art'
 *    '400':
 *       description: Error
 *    '500':
 *       description: Internal server error
 */
router.get("/last", (request, response) => {
    pool.query('SELECT * FROM arts ORDER BY id DESC LIMIT 10', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});



/**
 * @swagger
 * components:
 *  schemas:
 *     Critic:
 *      type: object
 *      properties:
 *         id:
 *          type: integer
 *          description: The Critic id
 *         from:
 *          type: string
 *          description: The critic name
 *         art_id:
 *          type: string
 *          description: The Art ID
 *         comment:
 *          type: string
 *          description: The Critic comment
 *         rating:
 *          type: integer
 *          description: The Critic rating for the art
 *      required:
 *        - id
 *        - from
 *        - art_id
 *        - comment
 *        - rating
 *      example:
 *         id: 1
 *         from: John Doe
 *         art_id: 1
 *         comment: "This is a great movie"
 *         rating: 5
 */



/**
 * @swagger
 * /api/arts/{slug}/critics:
 *  get:
 *    summary: Get critics of an art by Slug
 *    tags: [Arts]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the art
 *    responses:
 *      200:
 *        description: The critics of the art by slug
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Art'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The art was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/arts/:slug/critics", (request, response) => {
    const slug = request.params.slug
    if (typeof slug === 'string' || slug instanceof String) {
        pool.query('SELECT * FROM arts WHERE slug = $1', [slug], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    error: 404,
                    message: "No such art was found"
                })
            else {
                pool.query('SELECT * FROM critics WHERE art_id = $1', [results.rows[0].id], (error, results) => {
                    if (error) {
                        throw error
                    }
                    response.status(200).json(results.rows)
                })
            }
        })
    }
    else
        response.status(400).json({
            code: 400,
            message: 'Slug must be a string'
        })
});


/**
 * @swagger
 * /api/arts/{slug}/image:
 *  get:
 *    summary: Get an image of art by Slug
 *    tags: [Arts]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the art
 *    responses:
 *      200:
 *        description: The image of the art by slug
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Art'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The art was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/arts/:slug/image", (request, response) => {
    const slug = request.params.slug
    if (typeof slug === 'string' || slug instanceof String) {
        pool.query('SELECT * FROM arts WHERE slug = $1', [slug], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    code: 404,
                    message: "No such art found"
                })
            else {
                const image_type = 'App\\Models\\Art'
                pool.query('SELECT * FROM images WHERE imageable_id = $1 and imageable_type = $2',
                    [results.rows[0].id, image_type], async (error2, results2) => {
                        if (error2)
                            throw error2
                        if (results2.rows.length == 0) {

                            let url = 'http://trailerama.herokuapp.com/images/art_placeholder.jpg';
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
            message: 'Slug must be a string'
        })
});



/**
 * @swagger
 * /api/arts/{slug}/artists:
 *  get:
 *    summary: Get artists of an art by Slug
 *    tags: [Arts]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the art
 *    responses:
 *      200:
 *        description: The artists of the art by slug
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Art'
 *      400:
 *        description: Invalid param formats
 *      404:
 *        description: The art was not found
 *      500:
 *        description: Some server error     
 * */
router.get("/arts/:slug/artists", (request, response) => {
    const slug = request.params.slug
    if (typeof slug === 'string' || slug instanceof String) {
        pool.query('SELECT * FROM arts WHERE slug = $1', [slug], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows.length == 0)
                response.status(404).json({
                    error: 404,
                    message: "No such art was found"
                })
            else {
                pool.query('SELECT * FROM actor_actress_art WHERE art_id = $1', [results.rows[0].id], (error, results) => {
                    if (error) {
                        throw error
                    }
                    response.status(200).json(results.rows)
                })
            }
        })
    }
    else
        response.status(400).json({
            code: 400,
            message: 'Slug must be a string'
        })
});


/**
 * @swagger
 * /api/arts-tag/{tag}:
 *  get:
 *     summary: Get arts by tag
 *     tags: [Arts]
 *     parameters:
 *      - in: path
 *        name: tag
 *        schema:
 *          type: integer
 *        required: true
 *        description: id of the tag
 *     responses:
 *      '200':
 *          description: An array of Arts
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                      $ref: '#/components/schemas/Art'
 *      '400':
 *          description: Error
 *      '500':
 *          description: Internal server error
 */
router.get("/arts-tag/:tag", (request, response) => {
    if (isNaN(request.params.tag))
        response.status(400).json({
            code: 400,
            message: 'tag of id must be an Integer'
        })
    else
        pool.query('SELECT * FROM arts WHERE id IN (SELECT art_id FROM art_tag WHERE tag_id = $1)', [request.params.tag], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })

})

module.exports = router;