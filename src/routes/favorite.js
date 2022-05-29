const express = require("express");
const pool = require("../db");
const router = express.Router();
const { body, validationResult } = require('express-validator');


/**
 * @swagger 
 * components:
 *  schemas:
 *      Favorite:
 *          type: object
 *          properties:
 *              art_id:
 *                  type: integer
 *                  description: The Art id
 *              user_id:
 *                  type: integer   
 *                  description: The User id that created the favorite
 *              state:
 *                  type: string
 *                  description: State of the favorite
 *              rating:
 *                  type: integer
 *                  description: Rating of the favorite 
 *          required:
 *              - art_id
 *              - user_id
 *              - state
 *              - rating
 *          example:
 *              art_id: 1
 *              user_id: 1
 *              state: to-watch
 *              rating: 0
 */

/**
  * @swagger
  * tags:
  *   name: Favorites
  *   description: 'Trailerama API'
  */


// create favorite.
/**
 * @swagger
 * /api/favorites:
 *  post:
 *    summary: Create a favorite for the user
 *    tags: [Favorites]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Favorite'
 *          example:
 *            art_id: 1
 *            user_id: 1
 *            state: to-watch
 *            rating: 55
 *    responses:
 *      201:
 *        description: The favorite has been successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Favorite'
 *      400: 
 *        description: Invalid param formats 
 *      403:
 *        description: Favorite can not be created or because one already exists with the same user id and art id
 *      500:
 *        description: Some server error
 */
router.post("/favorites",
    body('art_id').isInt().withMessage('art_id must be an integer'),
    body('user_id').isInt().withMessage('user_id must be an integer'),
    body('state').isString().withMessage('state must be a string'),
    body('rating').isInt().withMessage('rating must be an integer'),
    (request, response) => {
        const { user_id, art_id, state, rating } = request.body
        const errors = validationResult(request)

        if (!errors.isEmpty())
            response.status(400).json({
                code: 400,
                errors: errors.array()
            })
        else {
            pool.query('SELECT * FROM art_user WHERE user_id = $1 and art_id = $2', [user_id, art_id], (error2, results2) => {

                if (results2.rows.length == 0)

                    pool.query('INSERT INTO art_user (art_id, user_id, state, rating) VALUES ($1, $2, $3, $4)', [art_id, user_id, state, rating], (error, results) => {
                        if (error) {
                            throw error
                        }
                        if (results.rowCount > 0)
                            response.status(201).json(`Favorite added successfully`)
                        else
                            response.satus(404).json({
                                code: 404,
                                message: 'Favorite can not be created'
                            })

                    })
                else
                    response.status(403).json({
                        code: 403,
                        message: 'Can not create the Favorite because one already exists with the same user id and art id'
                    })
            })
        }
    }
);


// get favorites by user id.
/**
 * @swagger
 * /api/favorites/{id}:
 *  get:
 *     summary: Get all favorites by user id
 *     tags: [Favorites]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *       required: true
 *       description: The user id
 *     responses:
 *      '200':
 *        description: All favorite by user id
 *        content:
 *          application/json:
 *           schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Favorite'
 *      '404':
 *        description: User not found
 *      '500':
 *       description: Internal server error
 */
router.get("/favorites/:id", (req, res) => {
    if (isNaN(req.params.id))
        response.status(400).json({
            code: 400,
            message: 'id must be an Integer'
        })
    else {
        pool.query("SELECT * FROM art_user WHERE user_id = $1 ORDER BY id ASC", [req.params.id], (error, results) => {
            if (error) throw error;
            res.status(200).json(results.rows);
        });
    }
});

/**
 * @swagger
 * /api/favorites:
 *  put:
 *    summary: Update a favorite for the user
 *    tags: [Favorites]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Favorite'
 *          example:
 *            art_id: 1
 *            user_id: 1
 *            state: to-watch
 *            rating: 55
 *    responses:
 *      201:
 *        description: The favorite has been successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Favorite'
 *      400: 
 *        description: Invalid param formats 
 *      403:
 *        description: The Favorite could not be updated
 *      500:
 *        description: Some server error
 */
router.put("/favorites",
    body('art_id').isInt().withMessage('art_id must be an integer'),
    body('user_id').isInt().withMessage('user_id must be an integer'),
    body('state').isString().withMessage('state must be a string'),
    body('rating').isInt().withMessage('rating must be an integer'),
    (request, response) => {
        const { user_id, art_id, state, rating } = request.body
        const errors = validationResult(request)

        if (!errors.isEmpty())
            response.status(400).json({
                code: 400,
                errors: errors.array()
            })
        else {
            pool.query('UPDATE art_user SET state = $3 , rating = $4 WHERE art_id = $1 AND user_id = $2', [art_id, user_id, state, rating], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount > 0)
                    response.status(201).json(`Favorite updated successfully`)
                else
                    response.satus(403).json({
                        code: 403,
                        message: 'Favorite could not be updated'
                    })
            })
        }
    }
);

/**
 * @swagger
 * /api/favorites:
 *  delete:
 *    summary: Delete a favorite for the user
 *    tags: [Favorites]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Favorite'
 *          example:
 *            art_id: 1
 *            user_id: 1
 *    responses:
 *      201:
 *        description: The favorite has been successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Favorite'
 *      400: 
 *        description: Invalid param formats 
 *      404:
 *        description: The Favorite was not found
 *      500:
 *        description: Some server error
 */
router.delete("/favorites",
    body('art_id').isInt().withMessage('art_id must be an integer'),
    body('user_id').isInt().withMessage('user_id must be an integer'),
    (request, response) => {
        const { user_id, art_id } = request.body
        const errors = validationResult(request)
        if (!errors.isEmpty())
            response.status(400).json({
                code: 400,
                errors: errors.array()
            })
        else {
            pool.query('DELETE FROM art_user WHERE art_id = $1 AND user_id = $2', [art_id, user_id], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount > 0)
                    response.status(201).json(`Favorite deleted successfully`)
                else
                    response.status(404).json({
                        code: 404,
                        message: 'Favorite was not found'
                    })
            })
        }
    }
);


module.exports = router;