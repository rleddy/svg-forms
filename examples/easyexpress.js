const express = require('express');
const app = express();
const fs = require('fs');

const appPort = 3000;

// Use on generic function to load file stuff and send it to the client
function loadPage(filename, res) {
    fs.readFile(filename,'utf8', (err,data) => {
                    if ( err ) {
                        res.send(JSON.stringify(err));
                    } else {
                        var page = data.toString();
                        res.send(page);
                    }
                })
}

// The paths (routes) to the files we want to send.
app.get('/', (req, res) => {
            loadPage('example.html',res);
        });

app.get('/:file', (req, res) => {
            loadPage(req.params.file,res);
        });

app.get('/svg/:svFile',(req,res) => {  // look in a particular directory
            loadPage('./svg/' + req.params.svFile,res);
        });

// Run it.  Really, you have to or else this app will terminate and the bowser
// will put up error messages.
app.listen(appPort, () => console.log(`Example app listening on port ${appPor}!`))
