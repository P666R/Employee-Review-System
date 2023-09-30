// Exporting a function named "setFlash" as a module
module.exports.setFlash = function (req, res, next) {
  // Creating a local variable named "flash" in the response object
  res.locals.flash = {
    // Assigning the value of the "success" flash message to the "success" property
    success: req.flash('success'),
    // Assigning the value of the "error" flash message to the "error" property
    error: req.flash('error'),
  };

  // Calling the "next" middleware function
  next();
};
