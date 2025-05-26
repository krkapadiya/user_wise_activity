const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const session = require("express-session");
require("./DB/config");
const router = require("./api/route/R_user_activity");
require("socket.io");
const { updateActivityOrder } = require("./api/controller/C_user_activity");

const http = require("http").createServer(app);
const io = require("socket.io")(http);
app.set("io", io);

const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "khushiiiiiiiiii",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
  }),
);

app.use("/", router);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room for user ${userId}`);
  });

  socket.on("reorderActivities", async ({ userId, newOrder }) => {
    const updatedList = await updateActivityOrder(userId, newOrder);
    if (updatedList) {
      io.to(userId).emit("updateActivityOrder", updatedList);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
