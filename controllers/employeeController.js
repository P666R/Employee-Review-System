const User = require('../models/userModel');
const Review = require('../models/reviewModel');

// Display the employee dashboard with reviews given and received
exports.employeeDashboard = async (req, res) => {
  try {
    // Get the ID of the logged-in user
    const loggedInUserId = req.user._id;

    // Fetch reviews given and received by the logged-in user, populate reviewer and reviewee details
    const [reviewsGiven, reviewsReceived] = await Promise.all([
      Review.find({ reviewer: loggedInUserId }).populate('reviewee'),
      Review.find({ reviewee: loggedInUserId }).populate('reviewer'),
    ]);

    // Fetch the logged-in user's details and users they need to review, populate usersToReview field
    const user = await User.findById(loggedInUserId).populate('usersToReview');

    // Render the employee dashboard page with fetched data
    res.render('employeeDashboard', {
      title: 'Nexter - Employee page',
      user,
      reviewsGiven,
      reviewsReceived,
    });
  } catch (error) {
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

// Show the feedback form to the logged-in user with a list of reviewees
exports.showFeedbackForm = async (req, res) => {
  try {
    // Fetch the list of reviewees from the logged-in user's usersToReview field, populate usersToReview field
    const loggedInUser = await User.findById(req.user._id).populate(
      'usersToReview',
    );
    const reviewees = loggedInUser.usersToReview;

    // Render the feedback form with the list of reviewees and the logged-in user's details
    res.render('feedbackFormPage', {
      title: 'Nexter - Feedback form',
      reviewees,
      user: loggedInUser,
    });
  } catch (error) {
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

// Handle submission of feedback from the logged-in user
exports.submitFeedback = async (req, res) => {
  const { revieweeId, review } = req.body;
  const reviewerId = req.user._id;

  try {
    // Find the reviewee based on the provided revieweeId
    const reviewee = await User.findById(revieweeId);

    if (!reviewee) {
      // Handle case where reviewee is not found
      req.flash('error', 'Invalid reviewee');
      return res.redirect('back');
    }

    // Create a new review document with provided details
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

    // Update reviewee's reviewsReceivedFrom array to add reviewerId
    await User.findByIdAndUpdate(revieweeId, {
      $push: { reviewsReceivedFrom: reviewerId },
    });

    // Flash success message and redirect back to the feedback form page
    req.flash('success', 'Feedback submitted successfully');
    res.redirect('back');
  } catch (error) {
    req.flash('error', 'Error occurred while submitting feedback');
    res.redirect('back');
  }
};
