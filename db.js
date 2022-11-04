import { faker } from '@faker-js/faker'
import { factory, primaryKey, oneOf } from '@mswjs/data'

faker.seed(123)

function createItem(db) {
    return db.book.create({
        author: db.author.create(),
    })
}

const db = factory({
    book: {
        id: primaryKey(() => faker.datatype.uuid()),
        title: faker.lorem.text,
        year: faker.date.past().getFullYear(),
        author: oneOf('author')
    },
    author: {
        id: primaryKey(() => faker.datatype.uuid()),
        name: faker.name.fullName,
    },
})

for(let k = 0; k < 100; k++){
    createItem(db)
}

export default db