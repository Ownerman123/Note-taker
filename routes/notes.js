const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { readAndAppend, readFromFile , writeToFile} = require('../helpers/fsUtils');


//test object to pass as body {title: 'yolo', note: 'oof'}


router.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, note  } = req.body;
  
    // If all the required properties are present
    if (title && note) {
      // Variable for the object we will save
      const newFeedback = {
        title,
        note,
        note_id: uuidv4(),
      };
  
      readAndAppend(newFeedback, './db/db.json');
  
      const response = {
        status: 'success',
        body: newFeedback,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  }).get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
  }).delete('/:id', (req, res) => {

    readFromFile('../db/db.json').then((data) => { 
        const noteid = req.params.id;
        console.log(`from delete call ${req.params.id}`);
        const newJson = JSON.parse(data).filter(({id}) => id !== noteid);
        console.info(newJson);
        return newJson;

    }).then((newjson) => writeToFile('./db/db.json', newjson));

    console.info(`deleted note with id ${req.params.id}`);

  });


  module.exports = router;