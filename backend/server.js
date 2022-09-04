const cors = require("cors");
const express = require("express");

const apiRouter = require("./src/routes/api.route");


const PORT = process.env.PORT || 5000;
const app = express();


// middleware
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

// routes
app.use("/api", apiRouter);


// init
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
});