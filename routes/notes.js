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
      const newnote = {
        title: title,
        note: note,
        note_id: uuidv4(),
      };
  
      readAndAppend(newnote, './db/db.json');
  
      const response = {
        status: 'success',
        body: newnote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  }).get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => {res.json(JSON.parse(data));})
  }).delete('/:note_id', (req, res) => {

    readFromFile('./db/db.json').then((data) => { 
        const noteid = req.params.note_id;
        console.log(`from delete call ${req.params.note_id}`);
        const newJson = JSON.parse(data).filter(({note_id}) => note_id !== noteid);
        console.info(newJson);
        return newJson;

    }).then((newjson) => {writeToFile('./db/db.json', newjson);
      res.json({status: "success", body: newjson});
    });

    //console.info(`deleted note with id ${req.params.note_id}`);

  });


  module.exports = router;