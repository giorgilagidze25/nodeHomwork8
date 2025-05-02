const { Router } = require('express');
const Film = require('../models/film.model');
const Director = require('../models/director.model');
const { filmSchema } = require('../validetion/film.validetion');
const isAuth = require('../midelwear/isAuth.midelwear');
const { isValidObjectId } = require('mongoose');

const filmRouter = Router();

filmRouter.get('/', async (req, res) => {
    const { genre, year, page = 1, take = 30 } = req.query;
    const filter = {};
    const limit = Math.min(take, 30);

    if (genre) filter.genre = genre;
    if (year) filter.year = year;

    const skip = (Number(page) - 1) * limit;

    const films = await Film.find(filter)
        .skip(skip)
        .limit(limit)
        .select('_id title genre year desc')
        .populate('director', '_id fullName');

    const response = films.map(film => {
        const { _id, title, genre, year, desc, director } = film.toObject();
        const result = { _id, title, genre, year, director };
        if (desc && desc.trim() !== '') result.desc = desc;
        return result;
    });

    const totalFilms = await Film.countDocuments(filter);

    res.json({
        total: totalFilms,
        films: response,
        page: Number(page),
        limit: limit,
    });
});

filmRouter.post('/', isAuth, async (req, res) => {
    const { error } = filmSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const directorId = req.userId;
    const { title, genre, year, desc } = req.body;

    const film = await Film.create({ title, genre, year, desc, director: directorId });
    await Director.findByIdAndUpdate(directorId, { $push: { movies: film._id } });

    res.status(201).json(film);
});

filmRouter.get('/:id', async (req, res) => {
    const film = await Film.findById(req.params.id).populate('director');
    res.json(film);
});

filmRouter.put('/:id', isAuth, async (req, res) => {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });

    if (film.director.toString() !== req.userId) {
        return res.status(403).json({ message: 'You can only update your own film' });
    }

    const updated = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

filmRouter.delete('/:id', isAuth, async (req, res) => {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });

    if (film.director.toString() !== req.userId) {
        return res.status(403).json({ message: 'You can only delete your own film' });
    }

    await Film.findByIdAndDelete(req.params.id);
    await Director.findByIdAndUpdate(req.userId, { $pull: { movies: req.params.id } });

    res.json({ message: 'Film deleted successfully' });
});

module.exports = filmRouter;
