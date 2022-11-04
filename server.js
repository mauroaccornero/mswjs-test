import express from 'express'
import cors from 'cors'
import { createMiddleware } from '@mswjs/http-middleware'
import db from "./db.js";

const app = express()

app.use(cors())

app.use(express.json())

app.use(createMiddleware(...db.author.toHandlers('rest'), ...db.book.toHandlers('rest')))

app.use((_req, res) => {
    res.status(404).send({ error: 'Mock not found' })
})

export default app

