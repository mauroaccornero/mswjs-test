import fetch from 'node-fetch'
import express from 'express'
import { createServer } from '@open-draft/test-server'
import { createMiddleware } from '@mswjs/http-middleware'
import db from "./db.js";
import {jest} from '@jest/globals'

const mockDb = db
let server;

describe("server unit test", () => {
    beforeAll(async () => {
       server = await createServer((app) => {
           const handlers = [...mockDb.author.toHandlers("rest"),...mockDb.book.toHandlers("rest")]
            app.use(createMiddleware(...handlers))
            app.use(express.json())
        })

    })

    afterAll(async () => {
        await server.close()
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when creating a book with an author', async () => {
        const authors = mockDb.author.getAll()
        const author = {id: authors[0].id, name: authors[0].name}
        const mockBookPayload = {
            title: 'something',
            year: 2019,
            author
        }

        const res = await fetch(server.http.makeUrl('/books'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockBookPayload),
        })

        const json = await res.json()

        expect(json.message).toBeDefined()
        expect(json.message).toContain("Failed to resolve a \"ONE_OF\" relationship to \"author\" at \"book.author\" (id:")
    })

    it('should create a book without relation items', async () => {
        const mockBookPayload = {
            title: 'something',
            year: 2019
        }

        const res = await fetch(server.http.makeUrl('/books'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockBookPayload),
        })

        const json = await res.json()

        expect(json.title).toEqual(mockBookPayload.title)
        expect(json.year).toEqual(mockBookPayload.year)
        expect(json.id).toBeDefined()
    })

    it('should call db.book.create with the correct payload', async () => {
            const authors = mockDb.author.getAll()
            const author = {id: authors[0].id, name: authors[0].name}
            const mockBookPayload = {
                title: 'something',
                year: 2019,
                author: author
            }

            const mockBookCreate = jest.fn()
            const mockAuthorCreate = jest.fn()
            mockDb.book.create = mockBookCreate
            mockDb.author.create = mockAuthorCreate

            await fetch(server.http.makeUrl('/books'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockBookPayload),
            })

            expect(mockBookCreate).toBeCalledTimes(1)
            expect(mockBookCreate).toBeCalledWith(mockBookPayload)
            expect(mockAuthorCreate).toBeCalledTimes(0)
        })

    it('should call db.book.create with the correct json payload', async () => {
        const mockBookPayload = {
            title: 'something',
            year: 2019,
        }

        const mockBookCreate = jest.fn()
        const mockAuthorCreate = jest.fn()
        mockDb.book.create = mockBookCreate
        mockDb.author.create = mockAuthorCreate

        await fetch(server.http.makeUrl('/books'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockBookPayload),
        })

        expect(mockBookCreate).toBeCalledTimes(1)
        expect(mockBookCreate).toBeCalledWith(mockBookPayload)
        expect(mockAuthorCreate).toBeCalledTimes(0)
    })

})