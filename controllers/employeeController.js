const User = require('../models/userModel');
const Review = require('../models/reviewModel');

exports.employeeDashboard = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const [reviewsGiven, reviewsReceived] = await Promise.all([
      Review.find({ reviewer: loggedInUserId }).populate('reviewee'),
      Review.find({ reviewee: loggedInUserId }).populate('reviewer'),
    ]);

    const user = await User.findById(loggedInUserId).populate('usersToReview');

    res.render('employeeDashboard', {
      title: 'Nexter - Employee page',
      user,
      reviewsGiven,
      reviewsReceived,
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

exports.showFeedbackForm = async (req, res) => {
  try {
    // Fetch the list of reviewees from the logged-in user's usersToReview field
    const loggedInUser = await User.findById(req.user._id).populate(
      'usersToReview',
    );
    const reviewees = loggedInUser.usersToReview;

    // Render the feedback form with the list of reviewees
    res.render('feedbackFormPage', {
      title: 'Nexter - Feedback form',
      reviewees,
      user: loggedInUser,
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

exports.submitFeedback = async (req, res) => {
  const { revieweeId, review } = req.body;
  const reviewerId = req.user._id;

  try {
    const reviewee = await User.findById(revieweeId);

    if (!reviewee) {
      req.flash('error', 'Invalid reviewee');
      return res.redirect('back');
    }

    const newReview = {
      review: review,
      reviewer: reviewerId,
      reviewee: revieweeId,
    };

    // Create the review document and add it to the Review collection
    await Review.create(newReview);

    // Update reviewer's usersToReview array to remove revieweeId
    await User.findByIdAndUpdate(reviewerId, {
      $pull: { usersToReview: revieweeId },
    });

    // Update reviewee's reviewsRecievedFrom array to add reviewerId
    await User.findByIdAndUpdate(revieweeId, {
      $push: { reviewsRecievedFrom: reviewerId },
    });

    req.flash('success', 'Feedback submitted successfully');
    res.redirect('back');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error occurred while submitting feedback');
    res.redirect('back');
  }
};
