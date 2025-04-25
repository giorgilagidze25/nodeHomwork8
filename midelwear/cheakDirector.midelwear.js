const { isValidObjectId } = require('mongoose');
const Director = require('../models/director.model');

const cheakDirector = async (req, res, next) => {
    const directorId = req.header('director-id');

    if (!directorId) {
        return res.status(400).json({ message: 'director-id header is required' });
    }

    if (!isValidObjectId(directorId)) {
        return res.status(400).json({ message: 'Invalid director-id format' });
    }

    try {
        const director = await Director.findById(directorId);

        if (!director) {
            return res.status(404).json({ message: 'Director not found' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error while checking director' });
    }
};

module.exports = cheakDirector;
