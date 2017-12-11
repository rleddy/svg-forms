# svg-forms

These brief scripts transform svg files, into forms, given that some of the tags in the forms have been assigned 'id's that indicate how they will be used.

The SVG that has been used so far has been ceated by drawing forms in **InkScape**. 
<i>Eventually, more SVG drawing programs will be included.</i>

This is the start of a repository. Hopefully, it will grow. 

## Why SVG

SVG, which is fine for creating web pages has been ignored until recently. The SVG drawing programs have been around for a long time. But, SVG was a second class citizen on web pages until HTML5.  So, not as many people use it as CSS.  But, SVG is actually much simpler to use. And, there is a lot of Media, done in SVG, that loads faster on a page. So, SVG is included in AMP, while some other things are not. 

I decided that instead of being stressed and distressed over the creation of forms and other interface widgets, that I could use SVG. But, not all SVG drawing programs are immediately equipped with tools for form creation. SVG is great for making pictures. But, you can make boring things with it, too. And, these will be made faster by drawing. They will be more easily managed. And, they will not take more space than HTML element that do the same thing. In some case, there will be a little bit more, but in other cases there may be a lot less. 

There are also a lot of stacks for animating SVG. So, all those CSS effects that people work hours for, can be had with SVG in much less time. 

SVG is a good thing to use.  Getting fancier, with 3D pacakges that expose OpenGL, makes wonderful interfaces. However, the web page user has to wait considerably longer to see the page. It can be well worth the wait, if the thing being delivered is something like a game or data visualization. But, SVG, like HTML can deliver less exciting things faster. SVG can also be used for data visualization, and there are complete packages for it. HTML can as well, and with large amounts of wizardy and many hours and days of getting it right, and after selecting and creating images stored in jpg or png, the HTML result will be available.  Of course, the same result can be gotten out of an SVG drawing package in some minutes, without lots of fancy picture work or those large files that go with it.

That SVG is good for getting things on the screen fast can be seen in the numerous symbol libraries that have been created in the marketplace. But, why stop with symbols? This is like making wheels for toys and never thinking of wagons.

## About what is here at the moment

At the moment, thre are two files that may be run as node.js scripts. 

There is no magic here. 
The programs read in the xml dom of an svg file, check the names of objects and then inserts properties and children elements. The children are often Foreign object tags. These then have children that are standard HTML form elements. 

The programs also generate some JavaScript. Right now, it is enough to get a client start, but not enough to do the whole job. So, some programming follows, even for general cases. 

Some JavaScript for the client is provided. An HTML page can load an SVG file and start using it, as long as the javascript is there to handle the form. 

There forms are not treated as pure HTML forms. It is expected that the web pages scripts will gather up the form data and send it as JSON to the waiting server. 

# Mechanics

>Draw an SVG diagram using an SVG editor, like InkScape. 

>But, name some of the fields in special ways:

     Ellipse  - turns the ellipse into a radio button
     CheckBox - turns a rect element into a checkbox form element
     Box - turns a rect into a field of type text.
     Area  - turns the element, assumed to be a rect into a textArea form element
     Combo or DropDown  - Turns a rect into one of these form elements.
     BtnStyle - Turns the element into a button with a handler. 

>Look in the examples at the -back.svg file to see how this is done. 

>Now, the files can be run through two scripts. 

>The first script that is useful to run is scrapesvg.js. This reads the original svg file and generates some data objects for use in the web application.

```
node scrapesvg.js examples/runners-back.svg 
```

>the second script has to be run. The script, svgform.js, transforms the original SVG into a file that can be loaded and used in the web application as a form, to be loaded by 'secondFetch'.

```
node svgform.js examples/ runners-back.svg test.svg
```
### call parameters
the first parameter 'examples/'  is directory from where the file will be read, and to where an output file will be deposited. The second parameter is the name of a file that should be in the directry. The third parameter will be the name of the output file.

## dependecies:  Get them by npm -install ...
### node dependecies

* xmldom

### web page dependencies

* svg.js
* jquery

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

Note: the client code includes, "secondFetch" which uses jquery ajax to fetch the SVG file. This was done because my HTML used Marko for generating some of the HTML in a 'Bootstrap' context.  Marko rejects the SVG tags. 
