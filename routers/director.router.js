const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const Director = require("../models/director.model");
const Film = require("../models/film.model");

const directorRouter = Router();

directorRouter.get('/', async (req, res) => {
    const directors = await Director.find().populate({
        path: 'movies',
        select: 'title genre -_id' 
    });
    res.json(directors);
});

directorRouter.post('/', async (req, res) => {
    const { fullName, birthYear } = req.body;

    if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
    }

    const director = await Director.create({ fullName, birthYear });
    res.status(201).json(director);
});

directorRouter.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await Director.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
});

directorRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    await Film.deleteMany({ director: id });

    const deleted = await Director.findByIdAndDelete(id);

    res.json({ message: "Director and related films deleted", deleted });
});

module.exports = directorRouter;
