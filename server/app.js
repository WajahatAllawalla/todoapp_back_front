import express from "express"
import mongoose from "mongoose"
import TodoModel from "./models/todoSchema.js"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 5000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const URI = `mongodb+srv://admin:admin@cluster0.o0voqnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(URI)
    .then(res => console.log("MONGODB SUCCESSFULLY CONNECTED!"))
    .catch(err => console.log("MONGODB ERROR", err))



// Create API
app.post("/createTodo", async (req, res) => {
    try {

        const body = req.body
        const data = await TodoModel.create(body)
        res.json({
            message: "Successfully created!",
            data: data,
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})


// READ API
app.get("/getTodos", async (req, res) => {
    try {
        const data = await TodoModel.find().sort({ "createAt": -1 })
        res.json({
            message: "Successfully Get!",
            data: data,
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})


// update API
app.put("/updateTodo/:id", async (req, res) => {
    try {
        const TodoId = req.params.id
        const body = req.body
        const updateData = await TodoModel.findByIdAndUpdate(TodoId, body, { new: true })
        res.json({
            message: "Successfully UPdated!",
            data: updateData,
            status: true
        })
    }
    catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})


// Delete API
app.delete("/deleteTodo", async (req, res) => {
    console.log(req.query, "query")
    await TodoModel.findByIdAndDelete(req.query.id)
    res.json({
        message: "Successfully deleted!",
        data: null,
        status: true
    })
})

app.post("/deleteAll", async (req, res) => {
    try {

        const body = req.body
        console.log(body.ids, "body")
        const response = await TodoModel.deleteMany({ _id: body.ids })
        console.log("response", response)
        res.json({
            message: "ALL DELETED",
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})



app.get("/", (req, res) => {
    res.send("HELLO SERVER!")
}
)



app.listen(PORT, () => console.log(`server running on localhost:${PORT}`))