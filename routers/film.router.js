const { Router } = require('express');
const Film = require('../models/film.model');
const Director = require('../models/director.model');
const { filmSchema } = require('../validetion/film.validetion');
const cheakDirector = require('../midelwear/cheakDirector.midelwear');

const filmRouter = Router();
filmRouter.get('/', async (req, res) => {
    const { genre, year, page = 1, take = 30 } = req.query;
    const filter = {};
    const limit = Math.min(take, 30);

    if (genre) {
        filter.genre = genre;
    }

    if (year) {
        filter.year = year;
    }

    const skip = (Number(page) - 1) * limit;

    const films = await Film.find(filter)
        .skip(skip) 
        .limit(limit)
        .select('_id title genre year desc')
        .populate('director', '_id fullName');

    const response = films.map(film => {
        const { _id, title, genre, year, desc, director } = film.toObject();
        const result = { _id, title, genre, year, director };

        if (desc && desc.trim() !== '') {
            result.desc = desc;
        }

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


filmRouter.post('/', cheakDirector, async (req, res) => {
    const { error } = filmSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const directorId = req.header('director-id');
    const { title, genre, year, desc } = req.body;

    const film = await Film.create({ title, genre, year, desc, director: directorId });
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
