const Review = require("../models/ReviewModal");
const path = require("path");
const fs = require("fs");


exports.createReview = async (req, res) => {
  try {
    const { name, ratings, review,type, role, company,institution, lastModifiedBy } = req.body;
    let profileImage;
    let videoFile;

    if (req.files && req.files.profile) {
      const imageFile = req.files.profile;
      if (imageFile.size > 3 * 1024 * 1024) {
        return res.status(400).json({
          message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
        });
      }
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(__dirname, "../uploads/review/profiles", uniqueFileName);
      await imageFile.mv(uploadPath);
      profileImage = uniqueFileName;
    } else {
      const defaultImagePath = path.join(__dirname, "../uploads/review/default-profile.png");
      const defaultFileName = `default_profile_${Date.now()}.png`;
      const newDefaultPath = path.join(__dirname, "../uploads/review/profiles", defaultFileName);
      try {
        fs.copyFileSync(defaultImagePath, newDefaultPath);
        profileImage = defaultFileName;
      } catch (copyError) {
        console.error("Error copying default profile:", copyError);
        return res.status(500).json({
          message: [{ key: "error", value: "Error setting up default profile" }],
        });
      }
    }

    if (req.files && req.files.video) {
      const video = req.files.video;
      if (video.size > 40 * 1024 * 1024) {
        return res.status(400).json({
          message: [{ key: "error", value: "Video size exceeds the 5MB limit" }],
        });
      }
      const uniqueVideoName = `${Date.now()}_${video.name}`;
      const videoPath = path.join(__dirname, "../uploads/review/videos", uniqueVideoName);
      await video.mv(videoPath);
      videoFile = uniqueVideoName;
    }

    // Create a new review
    const newReview = new Review({
      name,
      ratings,
      review,
      type,
      role,
      company,
      institution,
      profile: profileImage,
      video: videoFile,
      createdBy: req?.user?.email || "roobankr5@gmail.com",
      createdOn: Date.now(),
      lastModifiedBy: req?.user?.email || "roobankr5@gmail.com",
      lastModifiedOn: Date.now(),
    });

    await newReview.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Review Added Successfully" }],
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllReview = async (req, res) => {
  try {
    const allReview = await Review.find();

    if (!allReview || allReview.length === 0) {
      return res.status(404).json({
        message: [{ key: "error", value: "No reviews found" }],
      });
    }

    const reviews = allReview.map((view) => {
      const serviceObj = view.toObject();
      return {
        ...serviceObj,
        profile: process.env.BACKEND_URL + "/uploads/review/profiles/" + serviceObj.profile,
        video: serviceObj.video
          ? process.env.BACKEND_URL + "/uploads/review/videos/" + serviceObj.video
          : null,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Reviews retrieved successfully" }],
      getAllReview: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: [{ key: "error", value: "Review not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Review retrieved successfully" }],
      reviewById: {
        ...review.toObject(),
        profile: process.env.BACKEND_URL + "/uploads/review/profiles/" + review.profile,
        video: review.video
          ? process.env.BACKEND_URL + "/uploads/review/videos/" + review.video
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { name, ratings, review,type,institution, role, company, lastModifiedBy } = req.body;
    const profileFile = req.files?.profile;
    const videoFile = req.files?.video;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({
        message: [{ key: "error", value: "Review not found" }],
      });
    }

    // Handle profile image update
    if (profileFile) {
      const oldProfilePath = path.join(__dirname, "../uploads/review/profiles", existingReview.profile);
      if (fs.existsSync(oldProfilePath)) fs.unlinkSync(oldProfilePath);

      const uniqueProfileName = `${Date.now()}_${profileFile.name}`;
      const profileUploadPath = path.join(__dirname, "../uploads/review/profiles", uniqueProfileName);
      await profileFile.mv(profileUploadPath);

      existingReview.profile = uniqueProfileName;
    }

    // Handle video update
    if (videoFile) {
      const oldVideoPath = path.join(__dirname, "../uploads/review/videos", existingReview.video);
      if (fs.existsSync(oldVideoPath)) fs.unlinkSync(oldVideoPath);

      const uniqueVideoName = `${Date.now()}_${videoFile.name}`;
      const videoUploadPath = path.join(__dirname, "../uploads/review/videos", uniqueVideoName);
      await videoFile.mv(videoUploadPath);

      existingReview.video = uniqueVideoName;
    }

    // Update other fields
    existingReview.name = name || existingReview.name;
    existingReview.ratings = ratings || existingReview.ratings;
    existingReview.review = review || existingReview.review;
    existingReview.type = type || existingReview.type;
    existingReview.institution = institution || existingReview.institution;
    existingReview.role = role || existingReview.role;
    existingReview.company = company || existingReview.company;
    existingReview.lastModifiedBy = lastModifiedBy || existingReview.lastModifiedBy;
    existingReview.lastModifiedOn = new Date();

    await existingReview.save();

   return res.status(200).json({
       message: [{ key: "success", value: "Review updated successfully" }],
   });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({
        message: [{ key: "error", value: "Review not found" }],
      });
    }

    // Delete profile image if exists
    if (existingReview.profile) {
      const imagePath = path.join(__dirname, "../uploads/review/profiles", existingReview.profile);
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete video file if exists
    if (existingReview.video) {
      const videoPath = path.join(__dirname, "../uploads/review/videos", existingReview.video);
      if (fs.existsSync(videoPath) && fs.lstatSync(videoPath).isFile()) {
        fs.unlinkSync(videoPath);
      }
    }

    // Delete review from database
    await Review.deleteOne({ _id: reviewId });

    return res.status(200).json({
      message: [{ key: "success", value: "Review deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
