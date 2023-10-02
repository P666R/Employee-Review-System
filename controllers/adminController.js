const User = require('../models/userModel');
const Review = require('../models/reviewModel');

exports.adminDashboard = async (req, res) => {
  try {
    const employees = await User.find();

    return res.render('adminDashboard', {
      title: 'Nexter - Admin page',
      employees,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

exports.makeAdmin = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('back');
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    req.flash(
      'success',
      `Employee is now ${user.isAdmin ? 'an admin' : 'not an admin'}`
    );

    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error occurred while changing role of user');
    res.redirect('back');
  }
};

exports.getReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ isAdmin: false });

    res.render('assignReviewPage', {
      title: 'Nexter - Assign Review',
      reviewers,
      selectedReviewer: null,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error while fetching reviewers');
    res.redirect('back');
  }
};

exports.getReviewees = async (req, res) => {
  try {
    const { reviewerId } = req.body;

    // Find the selected reviewer
    const selectedReviewer = await User.findById(reviewerId);

    // Find users who are not admins
    let reviewees = await User.find({
      isAdmin: false,
      _id: { $ne: reviewerId }, // Exclude the selected reviewer
    });

    // If usersToReview is not empty for the selected reviewer, exclude them
    if (selectedReviewer.usersToReview.length > 0) {
      reviewees = reviewees.filter((reviewee) => {
        return !selectedReviewer.usersToReview.includes(
          reviewee._id.toString()
        );
      });
    }

    // Find existing reviews where the selected reviewer is the reviewer
    const existingReviews = await Review.find({
      reviewer: reviewerId,
    });

    // Exclude users who have already received a review from the selected reviewer
    const eligibleReviewees = reviewees.filter((reviewee) => {
      return !existingReviews.some((review) =>
        review.reviewee.equals(reviewee._id)
      );
    });

    res.render('assignReviewPage', {
      title: 'Nexter - Assign Review',
      selectedReviewer,
      reviewees: eligibleReviewees,
      reviewers: [],
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error while fetching reviewees');
    res.redirect('back');
  }
};

exports.assignReview = async (req, res) => {
  try {
    const { reviewerId, revieweeId } = req.body;

    // Find the selected reviewer
    const selectedReviewer = await User.findById(reviewerId);

    // Find the selected reviewee
    const selectedReviewee = await User.findById(revieweeId);

    // Update the selected reviewer's usersToReview array to include the selected reviewee
    selectedReviewer.usersToReview.push(selectedReviewee._id);

    // Save the changes to the database
    await selectedReviewer.save();

    // Optionally, you can create a new Review document to store this assignment in your database.

    req.flash('success', 'Review assigned successfully');
    res.redirect('/admin/assignReview'); // Redirect to the page with the list of reviewers
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error occurred while assigning review');
    res.redirect('/admin/assignReview'); // Redirect back to the page with the list of reviewers
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the employee by ID
    const employee = await User.findById(id);
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('back');
    }

    // Remove the employee ID from other users' usersToReview arrays
    await User.updateMany(
      { _id: { $ne: employee._id } }, // Exclude the current employee
      { $pull: { usersToReview: employee._id } }
    );

    // Delete all reviews where the employee is the reviewer or the reviewee
    await Review.deleteMany({
      $or: [{ reviewer: employee._id }, { reviewee: employee._id }],
    });

    // Delete the employee
    await User.findByIdAndDelete(id);

    req.flash(
      'success',
      'Employee and associated reviews successfully deleted'
    );
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash(
      'error',
      'Error occurred while deleting the employee and associated reviews'
    );
    res.redirect('back');
  }
};
