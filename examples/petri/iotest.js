
const fs = require('fs');
const { spawn } = require('child_process');

// ---------
const appPort = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var petri_io = io.of('/petri');

petri_io.on('connection', function(socket){

    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('message', function(msg) {

        petri_io.emit('message', msg);

        if ( typeof msg === "string" ) {
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                // just to let random messages go through
            }
        }

        if ( msg.type !== undefined ) {
            HWProc.send({ "message" : msg.message,
                            "mtype" : msg.type,
                            "sourceNode" :  msg.sourceNode,
                            "value" : msg.value
                        });
        }

    });

});


//{ "message" : "hi", "type" : "petri", "sourceNode" :  "circle-input-A", "value" : 1 }


const HWProc = spawn('node', ['./petriState.js'],
                     {
                         stdio: [process.stdin, process.stdout, process.stderr, 'ipc']
                     });


HWProc.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
});



HWProc.dataEvents = petri_io;


// Receive message to be forwarded to socket.io clients.
HWProc.on('message', (message) => {
              HWProc.dataEvents.emit('datum', message);
          });


app.get('/', function(req, res){
    res.sendFile(__dirname + '/example.html');
})

app.get('/:file', function(req, res){
    console.log(req.params.file)
    res.sendFile(__dirname + '/' + req.params.file);
})


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

app.get('/svg/:svFile',(req,res) => {  // look in a particular directory
            loadPage('./svg/' + req.params.svFile,res);

            //res.sendFile(__dirname + '/svg/' + req.params.svFile);
        });

http.listen(appPort, function(){
  console.log('listening on *:' + appPort);
});
