# svg-forms

These brief scripts transform svg files, into forms, given that some of the tags in the forms have been assigned 'id's that indicate how they will be used.

The SVG that has been used so far has been ceated by drawing forms in **InkScape**. 
<i>Eventually, more SVG drawing programs will be included.</i>

This is the start of a repository. Hopefully, it will grow. 

At the moment, thre are two files that may be run as node.js scripts. 

There is no magic here. 
The programs read in the xml dom of an svg file, check the names of objects and then inserts properties and children elements. The children are often Foreign object tags. These then have children that are standard HTML form elements. 

The programs also generate some JavaScript. Right now, it is enough to get a client start, but not enough to do the whole job. So, some programming follows, even for general cases. 

Some JavaScript for the client is provided. An HTML page can load an SVG file and start using it, as long as the javascript is there to handle the form. 

There forms are not treated as pure HTML forms. It is expected that the web pages scripts will gather up the form data and send it as JSON to the waiting server. 


## dependecies:  Get them by npm -install ...
### node dependecies

*xmldom

### web page dependencies

*svg.js

------------------

Here is a code snippet for use with an Express node.js app.

```
app.get('/plain/svg/:svFile',(req,res) => {
            var file = req.params.svFile;

            fs.readFile(`${applicationDir}/svg/${file}`, (err,data) => {
                            if ( err ) {
                                res.send(JSON.stringify(err));
                            } else {
                                var sData = data.toString();
                                res.send(sData)   // send a file that is the output of the utilities
                            }
                        });


});

```
