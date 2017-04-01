import r from 'rethinkdb'
import secret from '../secret'
import {serialise, deserialise} from '../utils/serialise'
import {Player, Match, Round, Cut} from '../utils/tournament'
import express from 'express'
const router = express.Router()

let connect
r.connect({
  host: 'localhost',
  port: 28015,
  user: "admin",
  password: secret.adminPassword
}, (err, conn) => {
  if(err) throw err
  connect = conn
})

router.get('/', (req, res) => {
  res.render("index")
})

router.get('/:shortid', (req, res) => {
  r.db('monolith').table('tournament')
  .filter(r.row("structure")("meta")("shortid").eq(req.params.shortid))
  .run(connect, (err, cursor) => {
    if(err) throw err
    cursor.toArray((err, result) => {
      if(err) throw err
      console.log(result);
      if(result.length != 0) {
        res.render('tournament', {structure: deserialise(JSON.stringify(result[0].structure))})
      }
      else {
        res.render('error', {error: '404'})
      }
    })
  })
})

export default router
