


var DOMP = require('xmldom');
var DOMParser = DOMP.DOMParser;

var fs = require('fs')

var inDir = process.argv[2];
var fileName = inDir + process.argv[3];
var outfilename = inDir + process.argv[4];



function getTargetedElements(idContainer) {

    var buttons = [];   // Button
    var displayTexts = [];   // Text
    var displayTextsAreas = [];   // Text
    var displayEllipses = []; // Ellipse
    var displayFields = [];   // Field
    var displayCheckBox = [];   // Box
    var displayCombos = [];   // Combo
    var displayDropDown = [];   // DropDown
    var likeButtons = [];

    idContainer = idContainer.replace(/\s+/g,' ');

    var idstarts = idContainer.split(' id=');
    idstarts.shift();
    idstarts.forEach((nextStr) => {
                         var idDef = nextStr.substr(0,nextStr.indexOf("\"",5)).substr(1);
 console.log(idDef)
                         if ( !((/[a-z]+[0-9]+$/).test(idDef)) ) {
                             if (   idDef.indexOf("Button") > 0 ) {
                                 buttons.push(idDef);
                             } else  if (   idDef.indexOf("Text") > 0 ) {
                                  displayTexts.push(idDef);
                             } else if (   idDef.indexOf("Ellipse") > 0 ) {
                                  displayEllipses.push(idDef);
                             } else if (   idDef.indexOf("CheckBox") > 0 ) {
                                 displayCheckBox.push(idDef);
                             } else if (   idDef.indexOf("Box") > 0 ) {
                                 displayFields.push(idDef);
                             } else if (   idDef.indexOf("Area") > 0 ) {
                                 displayTextsAreas.push(idDef);
                             } else if (   idDef.indexOf("Combo") > 0 || idDef.indexOf("DropDown") > 0  ) {
                                 displayCombos.push(idDef);
                             } else if (  idDef.indexOf("BtnStyle") > 0 ) {
                                 likeButtons.push(idDef)
                             }
                         }
                     })


    var returnArrays = {
        "buttons" :  buttons,
        "buttonStyle" : likeButtons,
        "texts" : displayTexts,
        "ellipses" : displayEllipses,
        "fields" : displayFields,
        "checkBox" : displayCheckBox,
        "areas" : displayTextsAreas,
        "combos" : displayCombos
    }

    return(returnArrays);
}



fs.readFile(fileName, (err,data) => {


                if ( err ) {
                    console.log(err);
                    return;
                }

                var svgStr = data.toString();

                var targetElems = getTargetedElements(svgStr);


                var doc = new DOMParser().parseFromString(svgStr,'text/xml');


                targetElems.fields.forEach((field) => {
                                               var fObj = doc.getElementById(field);

                                               var idS = fObj.getAttribute('id');
                                               var x = fObj.getAttribute('x');
                                               var y = fObj.getAttribute('y');
                                               var width = fObj.getAttribute('width');
                                               var height = fObj.getAttribute('height');

                                               var newFobj = null;
                                               if ( fObj.nextSibling !== null ) {
                                                   var tmpFobj = fObj.nextSibling;
                                                   var tName = tmpFobj.tagName;  //

                                                   while ( tmpFobj && typeof tName == "undefined" ) {
                                                       tmpFobj = tmpFobj.nextSibling;
                                                       tName = ( tmpFobj !== null ) ? tmpFobj.tagName : undefined;  //
                                                   }

                                                   if ( tmpFobj && (tName === "foreignObject") ) {

                                                       if ( !tmpFobj.hasAttribute('id') ) {
                                                           tmpFobj.setAttribute('id',field + "-FO");
                                                       }

                                                       newFobj = tmpFobj
                                                   }
                                               }


                                               if ( newFobj === null ) {
                                                   newFobj = doc.createElement("foreignObject");
                                                   newFobj.setAttribute('id',field + "-FO");

                                                   newFobj.setAttribute('x',x);
                                                   newFobj.setAttribute('y',y);
                                                   newFobj.setAttribute('width',width);
                                                   newFobj.setAttribute('height',height);

                                                   var adjW = Math.floor(width) - 1;
                                                   var adjH = Math.floor(height) - 1;

                                                   var styleString = `text-align:left;width:${adjW}px;height:${adjH}px`;

                                                   newFobj.setAttribute("style",styleString);

                                                   var inputChild = doc.createElement("input");
                                                   inputChild.setAttribute("type","text");
                                                   inputChild.setAttribute("id",field + "-Field");
                                                   inputChild.setAttribute("name",field);
                                                   inputChild.setAttribute("class","svgFormTextField");
                                                   inputChild.setAttribute("style","font-size:14px;margin-top:1px;margin-left:2px;width:99%;height:99%;border:none;");

                                                   newFobj.appendChild(inputChild);
                                                   fObj.parentNode.insertBefore(newFobj,fObj.nextSibling);

                                               }


                                               //createElement("foreignObject")

                                               //console.log(idS);
                                           })

                targetElems.areas.forEach((field) => {
                                               var fObj = doc.getElementById(field);

                                               var idS = fObj.getAttribute('id');
                                               var x = fObj.getAttribute('x');
                                               var y = fObj.getAttribute('y');
                                               var width = fObj.getAttribute('width');
                                               var height = fObj.getAttribute('height');


                                               var newFobj = null;
                                               if ( fObj.nextSibling !== null ) {
                                                   var tmpFobj = fObj.nextSibling;
                                                   var tName = tmpFobj.tagName;  //

                                                   while ( tmpFobj && typeof tName == "undefined" ) {
                                                       tmpFobj = tmpFobj.nextSibling;
                                                       tName = ( tmpFobj !== null ) ? tmpFobj.tagName : undefined;  //
                                                   }

                                                   if ( tmpFobj && (tName === "foreignObject") ) {

                                                       if ( !tmpFobj.hasAttribute('id') ) {
                                                           tmpFobj.setAttribute('id',field + "-FO");
                                                       }

                                                       newFobj = tmpFobj
                                                   }
                                               }


                                               if ( newFobj === null ) {
                                                   newFobj = doc.createElement("foreignObject");
                                                   newFobj.setAttribute('id',field + "-FO");

                                                   newFobj.setAttribute('x',x);
                                                   newFobj.setAttribute('y',y);
                                                   newFobj.setAttribute('width',width);
                                                   newFobj.setAttribute('height',height);

                                                   var adjW = Math.floor(width) - 1;
                                                   var adjH = Math.floor(height) - 1;

                                                   var styleString = `text-align:left;width:${adjW}px;height:${adjH}px`;

                                                   newFobj.setAttribute("style",styleString);

                                                   var inputChild = doc.createElement("textArea");
                                                   inputChild.setAttribute("id",field + "-TextArea");
                                                   inputChild.setAttribute("name",field);
                                                   inputChild.setAttribute("class","svgFormTextField");
                                                   inputChild.setAttribute('data-gramm_editor',false);
                                                   inputChild.setAttribute("style","margin-top:1px;margin-left:2px;width:99%;height:99%;border:none;");


                                                   newFobj.appendChild(inputChild);
                                                   fObj.parentNode.insertBefore(newFobj,fObj.nextSibling);

                                               }


                                               //createElement("foreignObject")

                                               //console.log(idS);
                                           })


                //
                targetElems.combos.forEach((field) => {

                                               var fObj = doc.getElementById(field);

                                               var lstBox = false;
                                               var multiSel = false;
                                               if ( field.indexOf("Combo") > 0 ) {
                                                   lstBox = true;
                                               }
                                               if ( field.indexOf("ComboMS") > 0 ) {
                                                   multiSel = true;
                                               }

                                               var idS = fObj.getAttribute('id');
                                               var x = fObj.getAttribute('x');
                                               var y = fObj.getAttribute('y');
                                               var width = fObj.getAttribute('width');
                                               var height = fObj.getAttribute('height');


                                               var newFobj = null;
                                               if ( fObj.nextSibling !== null ) {
                                                   var tmpFobj = fObj.nextSibling;
                                                   var tName = tmpFobj.tagName;  //

                                                   while ( tmpFobj && typeof tName == "undefined" ) {
                                                       tmpFobj = tmpFobj.nextSibling;
                                                       tName = ( tmpFobj !== null ) ? tmpFobj.tagName : undefined;  //
                                                   }

                                                   if ( tmpFobj && (tName === "foreignObject") ) {

                                                       if ( !tmpFobj.hasAttribute('id') ) {
                                                           tmpFobj.setAttribute('id',field + "-FO");
                                                       }

                                                       newFobj = tmpFobj
                                                   }
                                               }


                                               if ( newFobj === null ) {
                                                   newFobj = doc.createElement("foreignObject");
                                                   newFobj.setAttribute('id',field + "-FO");

                                                   newFobj.setAttribute('x',x);
                                                   newFobj.setAttribute('y',y);
                                                   newFobj.setAttribute('width',width);
                                                   newFobj.setAttribute('height',height);

                                                   var adjW = Math.floor(width) - 1;
                                                   var adjH = Math.floor(height) - 1;

                                                   var styleString = `text-align:left;width:${adjW}px;height:${adjH}px`;

                                                   newFobj.setAttribute("style",styleString);

                                                   var inputChild = doc.createElement("select");
                                                   inputChild.setAttribute("id",field + "-Select");
                                                   inputChild.setAttribute("name",field);
                                                   inputChild.setAttribute("class","svgFormTextField");
                                                   inputChild.setAttribute('data-gramm_editor',false);
                                                   inputChild.setAttribute("style","margin-top:1px;margin-left:2px;width:99%;height:99%;border:none;");

                                                   if ( lstBox ) {
                                                       inputChild.setAttribute("size","10");
                                                   }

                                                   if ( multiSel ) {
                                                       inputChild.setAttribute("multiple","");
                                                   }

                                                   newFobj.appendChild(inputChild);
                                                   fObj.parentNode.insertBefore(newFobj,fObj.nextSibling);

                                               }


                                               //createElement("foreignObject")

                                               //console.log(idS);
                                           })



                targetElems.checkBox.forEach((field) => {
                                               var fObj = doc.getElementById(field);

                                               var idS = fObj.getAttribute('id');
                                               var x = fObj.getAttribute('x');
                                               var y = fObj.getAttribute('y');
                                               var width = fObj.getAttribute('width');
                                               var height = fObj.getAttribute('height');


                                               var newFobj = null;
                                               if ( fObj.nextSibling !== null ) {
                                                   var tmpFobj = fObj.nextSibling;
                                                   var tName = tmpFobj.tagName;  //

                                                   while ( tmpFobj && typeof tName == "undefined" ) {
                                                       tmpFobj = tmpFobj.nextSibling;
                                                       tName = ( tmpFobj !== null ) ? tmpFobj.tagName : undefined;  //
                                                   }

                                                   if ( tmpFobj && (tName === "foreignObject") ) {

                                                       if ( !tmpFobj.hasAttribute('id') ) {
                                                           tmpFobj.setAttribute('id',field + "-FO");
                                                       }

                                                       newFobj = tmpFobj
                                                   }
                                               }


                                               if ( newFobj === null ) {
                                                   newFobj = doc.createElement("foreignObject");
                                                   newFobj.setAttribute('id',field + "-FO");

                                                   newFobj.setAttribute('x',x);
                                                   newFobj.setAttribute('y',y+1);
                                                   newFobj.setAttribute('width',width);
                                                   newFobj.setAttribute('height',height);

                                                   var adjW = Math.floor(width) - 1;
                                                   var adjH = Math.floor(height) - 1;

                                                   var styleString = `text-align:left;width:${adjW}px;height:${adjH}px`;

                                                   newFobj.setAttribute("style",styleString);

                                                   var inputChild = doc.createElement("input");
                                                   inputChild.setAttribute("id",field + "-CheckBox");
                                                   inputChild.setAttribute("type","checkbox");
                                                   inputChild.setAttribute("name",field);
                                                   inputChild.setAttribute("class","svgFormCheckBox");
                                                   inputChild.setAttribute("style","margin:1px;width:99%;height:98%;border:none;label:none;");

                                                   newFobj.appendChild(inputChild);
                                                   fObj.parentNode.insertBefore(newFobj,fObj.nextSibling);

                                               }


                                                 //createElement("foreignObject")

                                                 //console.log(idS);
                                             })



                targetElems.ellipses.forEach((field) => {

                                               var fObj = doc.getElementById(field);

                                               var idS = fObj.getAttribute('id');
                                               var x = fObj.getAttribute('cx');
                                               var y = fObj.getAttribute('cy');
                                               var width = fObj.getAttribute('rx');
                                               var height = fObj.getAttribute('ry');

                                               x = x - width/2;
                                               y = y - height;
                                               width = width*2;
                                               height = height*2;

                                               var newFobj = null;


                                               if ( newFobj === null ) {
                                                   newFobj = doc.createElement("foreignObject");
                                                   newFobj.setAttribute('id',field + "-FO");

                                                   newFobj.setAttribute('x',x);
                                                   newFobj.setAttribute('y',y+1);
                                                   newFobj.setAttribute('width',width);
                                                   newFobj.setAttribute('height',height);

                                                   var adjW = Math.floor(width) - 1;
                                                   var adjH = Math.floor(height) - 1;

                                                   var styleString = `text-align:left;width:${adjW}px;height:${adjH}px`;

                                                   newFobj.setAttribute("style",styleString);

                                                   var commonName = field.replace('ONEllipse','').replace('OFFEllipse','');

                                                   var inputChild = doc.createElement("input");
                                                   inputChild.setAttribute("id",field + "-Radio");
                                                   inputChild.setAttribute("type","radio");
                                                   inputChild.setAttribute("name",commonName);
                                                   inputChild.setAttribute("class","svgFormRadio");
                                                   inputChild.setAttribute("style","margin:1px;width:99%;height:98%;border:none;label:none;");

                                                   newFobj.appendChild(inputChild);
                                                   fObj.parentNode.insertBefore(newFobj,fObj.nextSibling);

                                               }


                                                 //createElement("foreignObject")

                                                 //console.log(idS);
                                             })



                targetElems.buttons.forEach((field) => {
                                                var fObj = doc.getElementById(field);
                                                fObj.setAttribute('class','svgResponsiveButton');
                                                fObj.setAttribute('style','cursor:pointer;');

                                                var  onmouseover="evt.target.setAttribute('opacity', '0.5');"
                                                var  onmouseout="evt.target.setAttribute('opacity','1)');"

                                                fObj.setAttribute('onmouseover',onmouseover);
                                                fObj.setAttribute('onmouseout',onmouseout);
                                             })


                targetElems.buttonStyle.forEach((field) => {
                                                var fObj = doc.getElementById(field);
                                                fObj.setAttribute('class','svgResponsiveButton');
                                                fObj.setAttribute('style','cursor:pointer;');

                                                var  onmouseover="evt.target.setAttribute('opacity', '0.5');"
                                                var  onmouseout="evt.target.setAttribute('opacity','1)');"

                                                fObj.setAttribute('onmouseover',onmouseover);
                                                fObj.setAttribute('onmouseout',onmouseout);

                                             })


                var s = new DOMP.XMLSerializer();
                var str = s.serializeToString(doc);
               // console.log(str);

                fs.writeFileSync(outfilename,str);


            })
