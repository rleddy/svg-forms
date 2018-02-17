


var fs = require('fs');   // for reading and writing files.

var DOMP = require('xmldom');  // for parsing an xml file.

var DOMParser = DOMP.DOMParser;  // This is the actual parser object provided by xmldom


var filename = process.argv[2];   // get the file name from the command line.


// planning to output a description of the file
// the description can be stored as a json object.

var outFile = filename.replace('.json');



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


                // create a place to store descriptive information
                var tagMap = {
                    'inputs' : [],
                    'outpus' : [],
                    'states' : [],
                    'tokens' : {},
                    'transitions' : {}
                };

                // create a set of regular expressions to capture our naming scheme.
                var circInputRegEx = new RegExp(/circle-input-\w+/)
                var circOutputRegEx = new RegExp(/circle-output-\w+/)
                var circStateRegEx = new RegExp(/circle-state-\w+/)
                var circTokenRegEx = new RegExp(/circle-token-\w+/)
                var rectTransitionRegEx = new RegExp(/rect-transition-(\w+|\:)+-\w+/)

                var isPetriElement = (elId) => {
                    return( circInputRegEx.test(elId)
                               || circOutputRegEx.test(elId)
                               || circStateRegEx.test(elId)
                               || rectTransitionRegEx.test(elId)
                               || circTokenRegEx.test(elId)
                           );
                }


                var findPetriStateOfType = (ptype,suffix) => {
                    var target = `circle-${ptype}-` + suffix;
                    if ( doc.getElementById(target) !== null ) {
                        return(target)
                    }
                    return(undefined)
                }

                var findTransitionInput = (suffix) => {
                    var target = findPetriStateOfType("input",suffix);
                    if ( target ) return(target);
                    target = findPetriStateOfType("state",suffix);
                    return(target);
                }

                var findTransitionOutput = (suffix) => {
                    var target = findPetriStateOfType("output",suffix);
                    if ( target ) return(target);
                    target = findPetriStateOfType("state",suffix);
                    return(target);
                }

                var findPetriState = (suffix) => {
                    var target = findPetriStateOfType("input",suffix);
                    if ( target ) return(target);

                    target = findPetriStateOfType("output",suffix);
                    if ( target ) return(target);

                    target = findPetriStateOfType("state",suffix);
                    return(target);
                }

                // walk throught eh list of ids that we scraped from the SVG text.
                elementIds.forEach( elId => {

                                       // run the test function
                                       if ( isPetriElement(elId) ) {
                                           //
                                           var fObj = doc.getElementById(elId);

                                           if ( fObj ) {

                                               // First split the pattern apart

                                               var idPieces = elId.split('-');

                                               if ( idPieces.length > 2 ) {
                                                   if ( idPieces[0] === 'circle' ) {
                                                       // this will be four types of cirlces
                                                       var circType = idPieces[1];
                                                       switch ( circType ) {
                                                           case "input" : {
                                                               tagMap.inputs.push(elId);
                                                               break;
                                                           }
                                                           case "output" : {
                                                               tagMap.outpus.push(elId);
                                                               break;
                                                           }
                                                           case "state" : {
                                                               tagMap.states.push(elId);
                                                               break;
                                                           }
                                                           case "token" : {
                                                               var target = idPieces[2];
                                                               target = findPetriState(target);
                                                               if ( target !== undefined ) {
                                                                   tagMap.tokens[elId] = {
                                                                       'target' : target
                                                                   };
                                                               }
                                                               break;
                                                           }
                                                       }
                                                   } else if ( idPieces[0] === 'rect' ) {
                                                       // this will be the transitions.
                                                       var rectType = idPieces[1];

                                                       if ( rectType == "transition" ) {

                                                           if ( idPieces.length > 3 ) {

                                                               // findTransitionInput
                                                               // findTransitionOutput
                                                               var inputs = idPieces[2];
                                                               var outputs = idPieces[3];

                                                               // For transitions, the pieces are node name hints
                                                               // separated by colons ':'
                                                               // So, we want to break these apart.

                                                               // Using JavaScript type indifference to overwrite a source variable.
                                                               // Sometimes coding requirements don't allow this. But, it's OK here.
                                                               inputs = inputs.split(':');
                                                               outputs = outputs.split(':');

                                                               // now we can transform the hints into id's.

                                                               inputs = inputs.map((nodeId) => {
                                                                                        var input = findTransitionInput(nodeId);
                                                                                        if ( input == undefined ) return("");
                                                                                        return(input);
                                                                                    })

                                                               outputs = outputs.map((nodeId) => {
                                                                                        var output = findTransitionOutput(nodeId);
                                                                                        if ( output == undefined ) return("");
                                                                                        return(output);
                                                                                    })

                                                               // before releasing this to the following processes.
                                                               // make sure that we filter out the absent node.

                                                               inputs = inputs.filter((nodeId) => {  return(nodeId.length > 0); })
                                                               outputs = outputs.filter((nodeId) => {  return(nodeId.length > 0); })

                                                               // now include the names with the transitions
                                                               tagMap.transitions[elId] = {
                                                                   "inputs" : inputs,
                                                                   "outputs" : outputs
                                                               }
                                                           }
                                                       }
                                                   }
                                               }

                                           }

                                       }

                                   });


                console.log(JSON.stringify(tagMap,null,2))

            });

