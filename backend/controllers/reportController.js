const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const { reportedUser, listing, reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({
        message: "Please provide a report reason with at least 5 characters",
      });
    }

    if (!reportedUser && !listing) {
      return res.status(400).json({
        message: "Report must target a user or listing",
      });
    }

    if (reportedUser === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot report yourself",
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser,
      listing,
      reason: reason.trim(),
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
};
