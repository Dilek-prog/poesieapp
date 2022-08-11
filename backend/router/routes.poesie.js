const express = require('express');
const router = express.Router();
const Poesie = require('./models/poesie');


// GET all posts
router.get('/', async(req, res) => {
    const allPoesie = await Poesie.find();
    console.log(allPoesie);
    res.send(allPoesie);
});

// post one poesie
router.post('/', upload.single('file'), async(req, res) => {
    if(req.file === undefines){
        return res.send({
            "message": "no file selected"
        });
    } else {
    console.log('req.body', req.body);
    const newPoesie = new Poesie({
        title: req.body.title,
        bild: req.body.bild,
        text: req.body.text,
        kategorie: req.body.kategorie,
        datum: req.body.datum
    })
    await newPoesie.save();
    res.send(newPoesie);
    }
})
 
// get one poesie via id
router.get('/:id', async(req, res) => {
    try {
        const poesie = await Poesie.findOne({ _id: req.params.id });
        console.log(req.params);
        res.send(poesie);
    } catch {
        res.status(404);
        res.send({
            error: "Poesie does not exist!"
        });
    }
});

// Aktualiserie den Datensatz mit folgender id
router.patch('/:id', async(req, res) => {
    try {
        const poesie = await Poesie.findOne({ _id: req.params.id })

        
        if (req.body.title) {
            poesie.title = req.body.title
        }

        if (req.body.datum) {
            poesie.datum = req.body.datum
        }

        if (req.body.kategorie) {
            poesie.kategorie = req.body.kategorie
        }

        if (req.body.bild) {
           poesie.bild = req.body.bild
        }

        if (req.body.text) {
            poesie.text = req.body.text
        }

        await Poesie.updateOne({ _id: req.params.id }, poesie);
        res.send(poesie)
    } catch {
        res.status(404)
        res.send({ error: "Poesie does not exist!" })
    }
});

// Lösche einen Datensatz der jeweiligen id
router.delete('/:id', async(req, res) => {
    try {
        await Poesie.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Poesie does not exist!" })
    }
});

module.exports = router;