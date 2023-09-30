const User = require('../models/userModel');
const Review = require('../models/reviewModel');

exports.adminDashboard = async (req, res) => {
  try {
    const employees = await User.find();

    return res.render('employeePage', {
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

    user.isAdmin = true;
    await user.save();

    req.flash('success', 'Employee is now an admin');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error occurred while making the employee an admin');
    res.redirect('back');
  }
};

exports.assignReview = async (req, res) => {
  const { reviewerId, revieweeId } = req.body;

  try {
    if (reviewerId === revieweeId) {
      req.flash('error', 'Reviewer and reviewee cannot be the same user');
      return res.redirect('back');
    }

    const [reviewer, reviewee] = await Promise.all([
      User.findById(reviewerId),
      User.findById(revieweeId),
    ]);

    if (!reviewer || !reviewee) {
      req.flash('error', 'Invalid reviewer or reviewee');
      return res.redirect('back');
    }

    reviewer.usersToReview.push(revieweeId);

    await reviewer.save();

    req.flash('success', 'Review assigned successfully');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error occurred while assigning the review');
    res.redirect('back');
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

    // Delete all reviews where the employee is the reviewer or the reviewee
    await Promise.all([
      Review.deleteMany({ reviewer: employee._id }),
      Review.deleteMany({ reviewee: employee._id }),
    ]);

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
