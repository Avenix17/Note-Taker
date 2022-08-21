const express = require('express');
const router = express.Router();
const db = require('../db/db.json');
const uuid = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// Grabs all notes within database
router.get('/', (req, res) => {
    readFromFile('./db/db.json')
        .then((data) => res.json(JSON.parse(data)));
});

// Posts new note to database
router.post('/', (req, res) => {
    const newEntry = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text
    };

    if (newEntry) {
        readAndAppend(newEntry, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding Note');
    }
});

// Deletes note from database
router.delete("/:id", (req, res) => {
    const selectNote = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
          const result = json.filter((note) => note.id != req.params.id);
          writeToFile('./db/db.json', result);
          res.json(`Note ${selectNote} has been deleted 🗑️`);
        });
});


module.exports = router;