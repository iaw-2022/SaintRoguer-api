const express = require("express");
const pool = require("../db");
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *     Tag:
 *      type: object
 *      properties:
 *         id:
 *          type: integer
 *          description: The Tag id
 *         name:
 *          type: string
 *          description: The tag name
 *         slug:
 *          type: string
 *          description: The Tag slug
 *      required:
 *          - id
 *          - name
 *          - slug
 *      example:
 *          id: 1
 *          name: "Action"
 *          slug: "action"
 * */
/**
  * @swagger
  * tags:
  *   name: Tags
  *   description: 'Trailerama API'
  */

/**
 * @swagger
 * /api/tags:
 *  get:
 *   summary: Get all tags
 *   tags: [Tags]
 *   responses:
 *     '200':
 *      description: A list of tags
 *      content:
 *        application/json:
 *           schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Tag'
 *     '400':
 *      description: Error
 *     '500':
 *       description: Server error  
*/
router.get("/tags", (request, response) => {
    pool.query('SELECT * FROM tags ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});





module.exports = router;