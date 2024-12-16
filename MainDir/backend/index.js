const express = require('express')
const user = require("./routes/user.route.js");
const form = require("./routes/form.route.js");
const response = require("./routes/response.route.js");
const db = require("./config/db.js");
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

// dot env config
dotenv.config()
const port = process.env.PORT
const app = express()
db()
app.use(cors('*'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/auth", user);
app.use("/", form);  // CRUD to create dynamic forms through admin
app.use("/", response); //CRUD to perform responses to created forms 

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})