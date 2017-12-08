

var fs = require('fs');

var DOMP = require('xmldom');
var DOMParser = DOMP.DOMParser;


var filename = process.argv[2];

var outFile = filename.replace('.svg','1.svg');


var appIdentifier = filename.split('/');
appIdentifier = appIdentifier[appIdentifier.length-1];
appIdentifier = appIdentifier.replace("-back.svg","")


function getAllElementsIds(svgStr) {

    // First find all non-conventional ids
    var idAll = svgStr.split(' id=');
    var elementIds = [];

    idAll.forEach( (nextStr) => {
                      var idDef = nextStr.substr(0,nextStr.indexOf("\"",5)).substr(1);
                      if ( !((/[a-z]+[0-9]+$/).test(idDef)) ) {
                          elementIds.push(idDef);
                      }
                  } );

    return(elementIds);
}




var ctagCollections = {};


function groupTagNameReset(key,node,index) {

    var child = node.firstChild;
    var ci = 1;
    var saveTSpan = false;
    while (child) {
        if ( child.nodeName !== "#text" ) {
            //
            var cctag = child.tagName;

            var newId = key + "-" + index + '-' + cctag;
            var oldId = child.getAttribute("id");

            var setChildID = true;
            if ( typeof oldId === "string" ) {
                if ( oldId.indexOf("Box") > 0 ) {
                    setChildID = false;
                }
            }

            if ( setChildID ) {
                child.setAttribute('id',newId);
            }

            if ( child.hasChildNodes() ) {
                groupTagNameReset(key,child,index);
            }
            ci++;
        }
        child = child.nextSibling;
    }

}



fs.readFile(filename,(err,data) => {

                var idContainer = data.toString();

                if ( err ) {
                    console.log(err);
                    return;
                }

                var svgStr = data.toString();
                var elementIds = getAllElementsIds(svgStr);
                var doc = new DOMParser().parseFromString(svgStr,'text/xml');


                var tagMap = {
                    'g' : [],
                    'rect' : [],
                    'text' : [],
                    'ellipse' : [],
                    'path' : []
                };

                elementIds.forEach( elId => {
                                       //
                                       var fObj = doc.getElementById(elId);

                                       if ( fObj ) {

                                           var idS = fObj.getAttribute('id');
                                           var action = fObj.getAttribute('onclick');
                                           var tagName = fObj.tagName;

                                           if ( action ) {
                                               var accessAction = `${appIdentifier}Reactors.${tagName}.` + action
                                               fObj.setAttribute('onclick',accessAction);
                                           }

                                           if ( !action ) {
                                               action = fObj.getAttribute('onmousedown');
                                           }

                                           var tagDescriptor = {
                                               'id' : idS
                                           }

                                           if ( action ) {
                                               tagDescriptor.action = action
                                           }

                                           if ( tagMap[tagName] ) {
                                               tagMap[tagName].push(tagDescriptor)
                                           } else {
                                               // console.log(tagName)
                                           }


                                       }

                                   } )


                //console.log(JSON.stringify(tagMap,null,2))



                // process objects with identifiers  (.+)List

                var listKeys = tagMap.g.filter((key) => {
                                                              if ( ((/[a-z]+List$/).test(key.id))  ) {
                                                                  return(true);
                                                              }
                                                              return(false);
                                                          });

                /// special processing for lists --
                listKeys.forEach((keyEl) => {

                                      var key = keyEl.id;
                                      var fObj = doc.getElementById(key);

                                      if ( fObj ) {
                                          // object
                                          if (fObj.hasChildNodes()) {
                                             var child = fObj.firstChild;
                                             var ci = 1;
                                             while (child) {
                                                 if ( child.nodeName !== "#text" ) {
                                                     var cId = key + "-" + ci;
                                                     child.setAttribute('id',cId)
                                                     child.setAttribute('class',"rowElement")
                                                     child.setAttribute('onclick',`listElementClick(event,'${cId}')`)
                                                     if ( child.hasChildNodes() ) {
                                                         groupTagNameReset(key,child,ci);
                                                     }
                                                     ci++;
                                                 }
                                                 child = child.nextSibling;
                                             }

                                             ctagCollections[key] = ci;

                                          }
                                      }
                                  })

                // ---------------------- ------------------------

                var s = new DOMP.XMLSerializer();
                var updatedSVG = s.serializeToString(doc);

                fs.writeFileSync(outFile,updatedSVG);

                for ( var k in ctagCollections ) {
                    ctagCollections[k]--;
                }


                console.log(`var ${appIdentifier}ListGroups = ` + JSON.stringify(ctagCollections,null,2) + ";");

                //
                //
                //
                // output actions that are requiring function definitions...

                var coalesceAction = {}
                for ( var k in tagMap ) {
                    var elList = tagMap[k];
                    var actionOwners = elList.filter( (el) => {
                                                         if ( el.action ) {
                                                             return(true);
                                                         }
                                                         return(false);
                                                     });

                    if ( actionOwners.length ) {

                        coalesceAction[k] = {};

                        actionOwners.forEach((ao) =>{
                                                 var fname = ao.action.replace('()','');
                                                 fname = fname.replace('(event)','')
                                                 fname = fname.replace(/\(event,\"[a-zA-Z0-9]+\"\)/,'')
                                                 fname = fname.replace(/\(evt,\"[a-zA-Z0-9]+\"\)/,'')
                                                 if ( ( k !== 'ellipse' ) &&  ( k !== 'path' ) ) {
                                                    coalesceAction[k][fname] = "null_function_def"
                                                 } else {
                                                     coalesceAction[k][fname] = "null_two_par_def"
                                                 }
                                             })
                    }

                }

                var output = "";
                var nearOutput = JSON.stringify(coalesceAction,null,2);

                while ( output !== nearOutput ) {
                    output = nearOutput;
                    nearOutput = nearOutput.replace('"null_function_def"',"(e) => {}")
                    nearOutput = nearOutput.replace('"null_two_par_def"',"(e,p2) => {}")
                }


                console.log(`var ${appIdentifier}Reactors = ` + nearOutput);



               // process.exit(0);

                var buttons = [];   // Button
                var displayTexts = [];   // Text
                var displayEllipses = []; // ellipse
                var displayFields = [];   // Box
                var displayCheckBox = [];   // Box
                var displayOthers = {};   // Others

                var tspanSet = {};

                idContainer = updatedSVG.replace(/\s+/g,' ');

                var idstarts = idContainer.split(' id=');
                idstarts.shift();
                idstarts.forEach((nextStr) => {
                                     var idDef = nextStr.substr(0,nextStr.indexOf("\"",5)).substr(1);
                                     if ( !((/[a-z]+[0-9]+$/).test(idDef)) ) {
                                         if (   idDef.indexOf("Button") > 0 ) {
                                             buttons.push(idDef);
                                         } else  if (   idDef.indexOf("Text") > 0 ) {
                                              displayTexts.push(idDef);
                                         } else if (   idDef.indexOf("ellipse") > 0 ) {
                                              displayEllipses.push(idDef);
                                         } else if (   idDef.indexOf("CheckBox") > 0 ) {
                                             displayCheckBox.push(idDef);
                                         } else if (   idDef.indexOf("Box") > 0 ) {
                                             displayFields.push(idDef);
                                         } else {
                                             var fObj = doc.getElementById(idDef);
                                             displayOthers[idDef] = fObj.tagName;

                                             var gKey = null;

                                             if ( fObj.tagName == "tspan" ) {
                                                 var idx = idDef.split('-');
                                                 if ( idx.length > 1 ) {
                                                     var gKey = idx[0];
                                                     idx = parseInt(idx[1]);
                                                     if ( tspanSet[gKey] == undefined ) {
                                                         tspanSet[gKey] = {};
                                                     }
                                                     tspanSet[gKey][idDef] = idx;
                                                 } else {
                                                     idx = idx[0];
                                                     tspanSet[idDef] = idx;
                                                 }
                                             }
                                         }
                                     }
                                 })


                /// ===========   file output


                console.log('window.appVars.buttons = [');
                buttons.forEach((button) => {
                                    console.log(`\t"${button}",`);
                                })
                console.log('];\n')

                console.log('window.appVars.displayTexts = [');
                displayTexts.forEach((dt) => {
                                    console.log(`\t"${dt}",`);
                                })
                console.log('];\n')


                console.log('window.appVars.displayFields = [');
                displayFields.forEach((field) => {
                                    console.log(`\t"${field}",`);
                                })
                console.log('];\n')


                console.log('window.appVars.displayCheckBox = [');
                displayCheckBox.forEach((cBox) => {
                                    console.log(`\t"${cBox}",`);
                                })
                console.log('];\n')

                console.log('window.appVars.displayEllipses = [');
                displayEllipses.forEach((ee) => {
                                    console.log(`\t"${ee}",`);
                                })
                console.log('];\n')


                console.log('window.appVars.tspanList = ' + JSON.stringify(tspanSet,null,2) + ';\n');


                console.log('$(document).ready( () => {');

                var script = `\
    appVars.buttons.forEach( (elem) => {\n\
                    initializeButton(elem);\n\
                })\n\
                     `;
                console.log(script)
                console.log("")


                script = `\
    appVars.displayTexts.forEach( (elem) => {\n\
                    initializeText(elem);\n\
                })\n\
                    `;
               console.log(script)
               console.log("")

               script = `\
    appVars.displayFields.forEach( (elem) => {\n\
                     initializeField(elem);\n\
                 })\n\
                     `;
              console.log(script)
              console.log("")

              script = `\
    appVars.displayCheckBox.forEach( (elem) => {\n\
                   initializeCheckBox(elem);\n\
               })\n\
                   `;
              console.log(script)
              console.log("")

              script = `\
    appVars.displayEllipses.forEach( (elem) => {\n\
                   initializeEllipses(elem);\n\
               })\n\
                   `;
              console.log(script)
              console.log("")



    buttons.forEach((button) => {

                        script = `\
        if ( typeof appVars !== 'undefined' ) {\n\
            appVars.${button} = {\n\
                                click : (ev) => {},\n\
                                hover : (ev) => {}\n\
                            }\n\
        }\n\
                        `;
                        console.log(script)
                    })



console.log('\n});')

            });

