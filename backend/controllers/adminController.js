const User = require('../models/user');
const Task = require('../models/tasks');

// GET /api/v1/admin/users — Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/admin/users/:id — Get single user with their tasks
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const tasks = await Task.find({ user: req.params.id });
        res.json({ success: true, data: { user, tasks } });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/v1/admin/users/:id/role — Change user role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be user or admin' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Role updated successfully', data: user });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/v1/admin/users/:id — Delete a user and all their tasks
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete all tasks belonging to this user first
        await Task.deleteMany({ user: req.params.id });

        // Then delete the user
        await user.deleteOne();

        res.json({ success: true, message: 'User and all associated tasks deleted' });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/admin/tasks — Get all tasks from all users
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/v1/admin/tasks/:id — Delete any task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
};