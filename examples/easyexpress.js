
const express = require('express');
const app = express();

const fs = require('fs');

function loadMainPage(res) {
    fs.readFile('example.html','utf8', (err,data) => {
                    if ( err ) {
                        res.send("OOPS!")
                    } else {
                        var page = data.toString();
                        res.send(page);
                    }
                })
}




app.get('/', (req, res) => {

            loadMainPage(res);

        })


app.get('/:file', (req, res) => {

console.log(req.params.file)

            fs.readFile(req.params.file,'utf8', (err,data) => {
                            if ( err ) {
                                res.send(JSON.stringify(err));
                            } else {
                                var page = data.toString();
                                res.send(page);
                            }
                        })

        })

app.get('/svg/:svFile',(req,res) => {
            var file = req.params.svFile;

            fs.readFile(file, (err,data) => {
                            if ( err ) {
                                res.send(JSON.stringify(err));
                            } else {
                                var sData = data.toString();
                                res.send(sData)   // send a file that is the output of the utilities
                            }
                        });


});


app.listen(3000, () => console.log('Example app listening on port 3000!'))


