import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    if(!req.session.user){
      return res.status(401).json("User is not logged in")
    }
    else{
      switch(req.method) {
        // TODO: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
        case "POST":
          try {
            const book = await db.book.add(req.session.user.id, JSON.parse(req.body))
            if (book === null){
              req.session.destroy()
              return res.status(401)
            }
            return res.status(200).json(book)
          }
          catch (error) {
            return res.status(400).json({error: error.message})
          }
        // TODO: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
        case "DELETE":
          try {
            const deleted = await db.book.remove(req.session.user.id, JSON.parse(req.body).id)
            if (!deleted){
              req.session.destroy()
              return res.status(401)
            }
            return res.status(200)
          }
          catch (error) {
            return res.status(400).json({error: error.message})
          }
        // TODO: Respond with 404 for all other requests
        default:
          return res.status(404)
              
      }
    }
      // User info can be accessed with req.session
      // No user info on the session means the user is not logged in

  },
  sessionOptions
)