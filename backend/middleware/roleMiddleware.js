module.exports = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. '${req.user.role}' role cannot perform this action.` 
      });
    }
    next();
  };
};