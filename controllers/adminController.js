const User = require('../models/userModel');
const Review = require('../models/reviewModel');

// Fetch all employees and render the admin dashboard page
exports.adminDashboard = async (req, res) => {
  try {
    const employees = await User.find();
    return res.render('adminDashboard', {
      title: 'Nexter - Admin page',
      employees,
    });
  } catch (error) {
    req.flash('error', 'Error occurred while fetching data');
    res.redirect('back');
  }
};

// Toggle admin status of a user
exports.makeAdmin = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      // Handle case where user is not found
      req.flash('error', 'User not found');
      return res.redirect('back');
    }

    // Toggle user's admin status
    user.isAdmin = !user.isAdmin;
    await user.save();

    // Flash success message based on updated admin status
    req.flash(
      'success',
      `Employee is now ${user.isAdmin ? 'an admin' : 'not an admin'}`,
    );

    res.redirect('back');
  } catch (error) {
    req.flash('error', 'Error occurred while changing role of user');
    res.redirect('back');
  }
};

// Fetch non-admin users to be potential reviewers
exports.getReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ isAdmin: false });

    res.render('assignReviewPage', {
      title: 'Nexter - Assign Review',
      reviewers,
      selectedReviewer: null,
    });
  } catch (error) {
    req.flash('error', 'Error while fetching reviewers');
    res.redirect('back');
  }
};

// Fetch non-admin users to be potential reviewees for a selected reviewer
exports.getReviewees = async (req, res) => {
  try {
    const { reviewerId } = req.body;

    // Find the selected reviewer
    const selectedReviewer = await User.findById(reviewerId);

    // Find non-admin users excluding selected reviewer
    let reviewees = await User.find({
      isAdmin: false,
      _id: { $ne: reviewerId }, // Exclude the selected reviewer
    });

    // Exclude users already assigned for review by selected reviewer
    if (selectedReviewer.usersToReview.length > 0) {
      reviewees = reviewees.filter(
        (reviewee) =>
          !selectedReviewer.usersToReview.includes(reviewee._id.toString()),
      );
    }

    // Find existing reviews where the selected reviewer is the reviewer
    const existingReviews = await Review.find({
      reviewer: reviewerId,
    });

    // Exclude users who have already received a review from the selected reviewer
    const eligibleReviewees = reviewees.filter(
      (reviewee) =>
        !existingReviews.some((review) => review.reviewee.equals(reviewee._id)),
    );

    res.render('assignReviewPage', {
      title: 'Nexter - Assign Review',
      selectedReviewer,
      reviewees: eligibleReviewees,
      reviewers: [],
    });
  } catch (error) {
    req.flash('error', 'Error while fetching reviewees');
    res.redirect('back');
  }
};

// Assign a review for selected reviewer and reviewee
exports.assignReview = async (req, res) => {
  try {
    const { reviewerId, revieweeId } = req.body;

    // Find the selected reviewer and reviewee
    const selectedReviewer = await User.findById(reviewerId);
    const selectedReviewee = await User.findById(revieweeId);

    // Update the selected reviewer's usersToReview array to include the selected reviewee
    selectedReviewer.usersToReview.push(selectedReviewee._id);

    // Save the changes to the database
    await selectedReviewer.save();

    // Flash success message for successful review assignment
    req.flash('success', 'Review assigned successfully');
    res.redirect('/admin/assignReview');
  } catch (error) {
    req.flash('error', 'Error occurred while assigning review');
    res.redirect('/admin/assignReview');
  }
};

// Delete an employee, remove them from other users' usersToReview arrays and delete associated reviews
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
      { $pull: { usersToReview: employee._id } },
    );

    // Delete all reviews where the employee is the reviewer or the reviewee
    await Review.deleteMany({
      $or: [{ reviewer: employee._id }, { reviewee: employee._id }],
    });

    // Delete the employee
    await User.findByIdAndDelete(id);

    // Flash success message for successful deletion
    req.flash(
      'success',
      'Employee and associated reviews successfully deleted',
    );
    res.redirect('back');
  } catch (error) {
    req.flash(
      'error',
      'Error occurred while deleting the employee and associated reviews',
    );
    res.redirect('back');
  }
};
