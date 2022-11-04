import app from "./server.js";

app.listen(process.argv[2],() => {
    console.log(`Mock server started on port ${process.argv[2]}`)
})