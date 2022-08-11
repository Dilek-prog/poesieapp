router.get('/send/:filename', async(req, res) => {

    let fileName = req.params.filename;

    MongoClient.connect(process.env.DB_CONNECTION, (err, client) => {

        const db = client.db(dbName);
        const collection = db.collection('posts.files');
        const collectionChunks = db.collection('posts.chunks');

        collection.find({filename: fileName}).toArray( (err, docs) => {

                collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray( (err, chunks) => {

                    let fileData = [];
                    for(let chunk of chunks){
                        fileData.push(chunk.data.toString('base64'));
                    }

                    let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    res.send({title: 'Image File', message: 'Image loaded from MongoDB GridFS', imgurl: finalFile});
                }) // toArray
        }) // toArray
    }) // connect
}) // get