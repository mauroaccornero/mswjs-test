# mswjs test

Install dependencies

```
npm ci
```

Start mock server on localhost:9999

```
npm start
```

 Run jest test

```
npm test
```

How to replicate:

run 

```
npm start
```

using postman send a post call to 

```
localhost:9999/books
```

with a payload

```
{
    "title": "asdasdas",
    "year": 2013,
    "author": {
    "id": "e6cebf88-7991-4457-aade-4177f3869c17",
    "name": "Israel Mitchell"
    }
}
```

this is the response

```
{
"message": "Failed to resolve a \"ONE_OF\" relationship to \"author\" at \"book.author\" (id: \"a10dc77a-f147-41ed-8865-563f70e853cd\"): expected a referenced entity to be \"author\" but got {\"id\":\"e6cebf88-7991-4457-aade-4177f3869c17\",\"name\":\"Israel Mitchell\"}"
}
```