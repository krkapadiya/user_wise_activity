require("express");
require("mongoose");
const { users, activities } = require("./../model/index");

const register = async (req, res) => {
  res.render("register");
};

const registeruser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = await users.create({ email, password });

    req.session.userId = newUser._id;

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Registration failed");
  }
};

const login = async (req, res) => {
  res.render("login");
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).send("Invalid email or password");
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Login failed");
  }
};

const dashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    const userData = await users.findById(userId).populate("activity_order");
    res.render("dashboard", {
      user: userData,
      activities: userData.activity_order,
    });
  } catch {
    res.status(500).send("Dashboard failed");
  }
};

const activity = async (req, res) => {
  res.render("addactivity");
};

const addactivity = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { activity_name } = req.body;

    const newActivity = await activities.create({
      user_id: userId,
      activity_name,
    });

    await users.findByIdAndUpdate(userId, {
      $push: {
        activity_order: {
          $each: [newActivity._id],
          $position: 0,
        },
      },
    });

    const updateuser = await users.findById(userId).populate({
      path: "activity_order",
      options: { sort: { createdAt: -1 } },
    });

    const io = req.app.get("io");
    io.to(userId.toString()).emit(
      "updateActivityOrder",
      updateuser.activity_order,
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add activity");
  }
};

const updateActivityOrder = async (userId, newOrder) => {
  try {
    await users.findByIdAndUpdate(userId, {
      activity_order: newOrder,
    });

    const userwithactivities = await users
      .findById(userId)
      .populate("activity_order");
    return userwithactivities.activity_order;
  } catch (error) {
    console.log("Failed to update activity order:", error);
    return null;
  }
};

const oldactivity = async (req, res) => {
  try {
    const activity = await activities.findById(req.params.id);
    const user = await users.findById(activity.user_id);
    res.render("update", { activity, user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching activity");
  }
};
const updateactivity = async (req, res) => {
  try {
    const { activity_id, activity_name } = req.body;
    const updatedActivity = await activities.findByIdAndUpdate(
      activity_id,
      { activity_name },
      { new: true },
    );
    const user_id = req.session.userId.toString();
    const io = req.app.get("io");
    io.to(user_id).emit("updateactivity", updatedActivity);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating activity");
  }
};

const deleteactivity = async (req, res) => {
  try {
    const { activity_id, user_id } = req.body;
    await activities.deleteOne({ _id: activity_id });
    const io = req.app.get("io");
    io.to(user_id).emit("deleteactivity", activity_id);
    res.status(200).json({
      success: true,
      message: "activity deleted successfully",
      activity_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
};

module.exports = {
  register,
  registeruser,
  login,
  loginuser,
  dashboard,
  activity,
  addactivity,
  updateActivityOrder,
  updateactivity,
  deleteactivity,
  oldactivity,
};
