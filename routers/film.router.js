const { Router } = require('express');
const Film = require('../models/film.model');
const Director = require('../models/director.model');

const filmRouter = Router();

filmRouter.get('/', async (req, res) => {
    const films = await Film.find()
        .select('_id title genre')
        .populate('director', '_id fullName'); 

    res.json(films);
});


filmRouter.post('/', async (req, res) => {
    const directorId = req.header('director-id');
    const { title, genre } = req.body;

    if (!directorId || !title || !genre) {
        return res.status(400).json({ message: "Director ID, title, and genre are required" });
    }

    const film = await Film.create({ title, genre, director: directorId });
    await Director.findByIdAndUpdate(directorId, { $push: { movies: film._id } });

    res.status(201).json(film);
});

filmRouter.get('/:id', async (req, res) => {
    const film = await Film.findById(req.params.id).populate('director');
    res.json(film);
});

filmRouter.put('/:id', async (req, res) => {
    const updated = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

filmRouter.delete('/:id', async (req, res) => {
    const deleted = await Film.findByIdAndDelete(req.params.id);
    res.json(deleted);
});

module.exports = filmRouter;
