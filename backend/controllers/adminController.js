const User = require("../models/User");
const Listing = require("../models/Listing");
const Report = require("../models/Report");
const Message = require("../models/Message");

const buildUserFilter = ({ search }) => {
  if (!search) {
    return {};
  }

  return {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };
};

const getDashboardStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalUsers, totalActiveUsers, newUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    res.status(200).json({
      totalUsers,
      totalActiveUsers,
      newUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(buildUserFilter(req.query))
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Promise.all([
      Listing.deleteMany({ owner: user._id }),
      Report.deleteMany({
        $or: [{ reporter: user._id }, { reportedUser: user._id }],
      }),
      Message.deleteMany({
        $or: [
          { sender: user._id.toString() },
          { receiver: user._id.toString() },
        ],
      }),
      user.deleteOne(),
    ]);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  deleteUser,
};
