const router = require("express").Router()
const fs = require("fs")
//http://localhost:3001/api/notes/
router.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json","utf8", (err, data) => {
        const newData = JSON.parse(data)
        res.json(newData)
    })
})

router.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        const newData = JSON.parse(data)
        res.json(newData)
    })
})

module.exports=router