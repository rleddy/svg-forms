


var fs = require('fs');   // for reading and writing files.

var DOMP = require('xmldom');  // for parsing an xml file.

var DOMParser = DOMP.DOMParser;  // This is the actual parser object provided by xmldom


var filename = process.argv[2];   // get the file name from the command line.


// planning to output a description of the file
// the description can be stored as a json object.

var outFile = filename.split('.');
var suffix = outFile[outFile.length - 1];
outFile = outFile.join('.') + "-revised."
outFile += suffix;



function getAllElementsIds(svgStr) {

    // First find all non-conventional ids
    // This makes is so that the start of each
    // array elment is the beginning of an id definition.

    var idAll = svgStr.split(' id=');
    var elementIds = [];  // Initialize an array variable

    idAll.forEach( (nextStr) => {
                      // processes each array element.
                      // Take them out as substrings.
                      var idDef = nextStr.substr(0,nextStr.indexOf("\"",5)).substr(1);
                      // Now use a regular expression to use onl id's that are
                      // fairly much like variable.s
                      if ( !((/[a-z]+[0-9]+$/).test(idDef)) ) {
                          elementIds.push(idDef);  // put those into our array.
                      }
                  } );

    // All the Id's we need.
    return(elementIds);
}



fs.readFile(filename,(err,data) => {

                if ( err ) {  // always check for error, there might have been a typo on the command line
                    console.log(err);
                    return;
                }

                var svgStr = data.toString(); // the data is in a buffer at the moment. So, turn it into a string.

                // This method is about to be defined.
                // The plan is that it will find the elements that our application will need
                // to manipulate in the end result, the working web page.
                var elementIds = getAllElementsIds(svgStr);

                // Let the parser do its work. It will return a detailed data structure representing the document.
                var doc = new DOMParser().parseFromString(svgStr,'text/xml');

                // create a set of regular expressions to capture our naming scheme.
                var circInputRegEx = new RegExp(/circle-input-\w+/)
                var circOutputRegEx = new RegExp(/circle-output-\w+/)
                var circStateRegEx = new RegExp(/circle-state-\w+/)
                var circTokenRegEx = new RegExp(/circle-token-\w+/)
                var rectTransitionRegEx = new RegExp(/rect-transition-(\w+|\:)+-\w+/)

                var petriElementType = (elId) => {
                    if ( circInputRegEx.test(elId) ) return("input");
                    if ( circOutputRegEx.test(elId) ) return("output");
                    if ( circStateRegEx.test(elId) ) return("state");
                    if ( circTokenRegEx.test(elId) ) return("token");
                    if ( rectTransitionRegEx.test(elId) ) return("transition");
                    return(undefined)
                }

                // walk throught the list of ids that we scraped from the SVG text.
                elementIds.forEach( elId => {

                                       var peType = petriElementType(elId)
                                       if ( peType ) {
                                           //
                                           var fObj = doc.getElementById(elId);

                                           if ( fObj ) {

                                               switch ( peType ) {
                                                   case "input" : {
                                                       fObj.setAttribute("class","svgPetriNodeInput");
                                                       fObj.setAttribute("onhover","svgPetriNodeHover(this,event,'input')");
                                                       fObj.setAttribute("onmouseenter","svgPetriNodeEnter(this,event,'input')");
                                                       fObj.setAttribute("onmouseleave","svgPetriNodeLeave(this,event,'input')");
                                                       fObj.setAttribute("onlcick","svgPetriNodeClick(this,event,'input')");
                                                       break;
                                                   }
                                                   case "output" : {
                                                       fObj.setAttribute("class","svgPetriNodeOutput");
                                                       fObj.setAttribute("onhover","svgPetriNodeHover(this,event,'output')");
                                                       fObj.setAttribute("onmouseenter","svgPetriNodeEnter(this,event,'output')");
                                                       fObj.setAttribute("onmouseleave","svgPetriNodeLeave(this,event,'output')");
                                                       fObj.setAttribute("onlcick","svgPetriNodeClick(this,event,'output')");
                                                       break;
                                                   }
                                                   case "state" : {
                                                       fObj.setAttribute("class","svgPetriNodeState");
                                                       fObj.setAttribute("onhover","svgPetriNodeHover(this,event,'state')");
                                                       fObj.setAttribute("onmouseenter","svgPetriNodeEnter(this,event,'state')");
                                                       fObj.setAttribute("onmouseleave","svgPetriNodeLeave(this,event,'state')");
                                                       fObj.setAttribute("onlcick","svgPetriNodeClick(this,event,'state')");
                                                       break;
                                                   }
                                                   case "token" : {
                                                       fObj.setAttribute("class","svgPetriNodeToken");
                                                       fObj.setAttribute("onhover","svgPetriNodeHover(this,event,'token')");
                                                       fObj.setAttribute("onmouseenter","svgPetriNodeEnter(this,event,'token')");
                                                       fObj.setAttribute("onmouseleave","svgPetriNodeLeave(this,event,'token')");
                                                       fObj.setAttribute("onlcick","svgPetriNodeClick(this,event,'token')");
                                                       break;
                                                   }
                                                   case "transition" : {
                                                       fObj.setAttribute("class","svgPetriTransition");
                                                       fObj.setAttribute("onhover","svgPetriNodeHover(this,event,'transition')");
                                                       fObj.setAttribute("onmouseenter","svgPetriNodeEnter(this,event,'transition')");
                                                       fObj.setAttribute("onmouseleave","svgPetriNodeLeave(this,event,'transition')");
                                                       fObj.setAttribute("onlcick","svgPetriNodeClick(this,event,'transition')");
                                                       break;
                                                   }
                                                   default : {
                                                       break;
                                                   }
                                               }

                                           }

                                       }

                                   });


                // The last thing we need to do is write out the new SVG file.
                // Fortunately, xmldom has a serializer.  It outputs SVG that
                // will load into the browser without a problem. Its detailed format
                // is something I am not going to worry about.

                var s = new DOMP.XMLSerializer();
                var str = s.serializeToString(doc);

                fs.writeFileSync(outfilename,str);

            });

