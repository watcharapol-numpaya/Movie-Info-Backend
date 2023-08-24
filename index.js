const express = require("express"); //
const app = express();
const router = require("./src/routers/movieRouter");
const port = 5000;
const cors = require("cors");
const movieRoutes = require("./src/routers/movieRouter");

app.use(cors({}));

app.use(express.json()); //body parser ทำให้เห็น Json ตอน post
app.use(express.urlencoded({ extended: false })); //อาจจะไม่ต้องใส่
// app.use(router)

//{ origin: 'http://localhost:3000' }

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.use("/api/v1/movies", movieRoutes);




app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});
