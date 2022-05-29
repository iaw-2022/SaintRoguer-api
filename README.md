# SaintRoguer-api
API using Node.js

# Routes

## swagger
- **[/api-docs](https://trailerama-api.herokuapp.com/api-docs)** -> swagger interface

## Arts 
- **[/api/arts](https://trailerama-api.herokuapp.com/api/arts)** -> get type, for getting all arts.
- **[/api/arts/{slug}](https://trailerama-api.herokuapp.com/api/arts/catch-me-if-you-can-2002)** -> get type, for getting art with a certain slug.
- **[/api/arts/{slug}/critics](https://trailerama-api.herokuapp.com/api/arts/catch-me-if-you-can-2002/critics)** -> get type, for getting the critics of an art with a certain slug.
- **[/api/arts/{slug}/image](https://trailerama-api.herokuapp.com/api/arts/catch-me-if-you-can-2002/image)** -> get type, for getting the image of an art with a certain slug.
- **[/api/arts/{slug}/artists](https://trailerama-api.herokuapp.com/api/arts/catch-me-if-you-can-2002/artists)** -> get type, for getting the cast of an art with a certain slug.

## Artists
- **[/api/artists/{id}](https://trailerama-api.herokuapp.com/api/artists/169)** -> get type, for getting an artists with a certain id.
- **[/api/artists/{id}/image](https://trailerama-api.herokuapp.com/api/artists/169/image)** -> get type, for getting the image of an artists with a certain id.

## Favorites
- **[/api/favorites/{id}](https://trailerama-api.herokuapp.com/api/favorites/1)** -> get type, using user id to get all favorites associated with him/her.
- /api/favorites -> post type for creating a new favorite. json { art_id, user_id, state, rating}
- /api/favorites -> put type for updating a favorite. json { art_id, user_id, state, rating}
- /api/favorites -> delete type for deleting a favorite. json { art_id, user_id}



