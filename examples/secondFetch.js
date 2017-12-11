


if ( window.clonify === undefined ) {
    window.clonify = (obj) => { return(JSON.parse(JSON.stringify(obj))); };
}



function scrollHandleAction(e,target) {

    console.log(JSON.stringify(e))

}


function initSvgCallOnReceive( section ) {

    if ( window.appVars[section] ) {
        if ( window.appVars[section].initForm  ) {
            window.appVars[section].initForm();
        }
    }

}


// ---- ---- ----
function listElementClick(event,targetId) {

}

function initializeButton(elem) {

}

function initializeText(elem) {

}

function initializeField(elem) {

}

function initializeCheckBox(elem) {

}

function initializeEllipses(elem) {

}




$(document).ready(function() {

    var section = window.fetchSections;

    // fetch the svg section from the server...

    if ( window.useFetchSVG ) {

        var page = window.fetchPage;
        var dataFetchPage = `/svg/${page}`;
        var parentEl =  "#" + window.targetDiv;

        $.get( dataFetchPage, function( data ) {
            $( parentEl ).html( data );

            try {
                appVars.svgForm = SVG("svg-" + window.fetchSections);
            } catch ( e ) {

            }

            initSvgCallOnReceive( window.fetchSections );
        });

    }

});




function populateMaster(master,section)  {

    for ( var ff in master.fields ) {
        $(master.fields[ff]).val(window.appVars[section].newDefinition[ff]);
    }

    for ( var rr in master.radio ) {
        $(master.radio[ff]).attr("checked",window.appVars[section].newDefinition[rr]);
    }

}


function saveFields(master,section) {

    for ( var ff in master.fields ) {
        window.appVars[section].newDefinition[ff] = $(master.fields[ff]).val();
    }

}



function initCheckBoxes(section,details) {

    var detailDescr = window.appVars[section].newDefinition[details][idx];

    for ( var k in detailDescr ) {
        var val = detailDescr[k];
        if ( k.indexOf("CheckBox") ) {
            var cbx = '#' + k + "-CheckBox";
            $(cbx).attr('checked',val)
        } else if ( k.indexOf("Box") ) {
            var cbx = '#' + k + "-Field";
            $(cbx).val(val);
        }
    }

}

function saveCheckBoxes(section,details) {

    var detailDescr = window.appVars[section].newDefinition[details][idx];

    for ( var k in devDescr ) {
        if ( k.indexOf("CheckBox") ) {
            var cbx = '#' + k + "-CheckBox";
            devDescr[k] = $(cbx).attr('checked')
        } else if ( k.indexOf("Box") ) {
            var cbx = '#' + k + "-Field";
            devDescr[k] = $(cbx).val();
        }
    }

}




function confirmRemoteStore(section,endPoint) {
    var confirmed = true;
    // confirm("about to save this dev to db" );
    if ( confirmed ) {
        var containerDef = window.appVars[section].newDefinition
        window.appVars[section].newDefinition = null;
        sendJSON(endPoint,containerDef)
    }
}



function createMasterEntry(section,details,elementTemplate,templateModel) {

    window.appVars[section].delailIdx = -1;
    window.appVars[section].newDefinition = window.clonify(templateModel)
    window.appVars[section].populateFields(0);
    window.appVars[section].delailIdx = 0;

    createNewDetailObject(section,details,elementTemplate,ctrlList)

    window.appVars[section].populateFields(window.appVars[section].delailIdx);

}

function createNewDetailObject(section,details,elementTemplate,ctrlList) {
    window.appVars[section].saveFields(window.appVars[section].delailIdx)
    var newElement = window.clonify(elementTemplate);
    window.appVars[section].delailIdx = window.appVars[section].newDefinition[details].length;
    window.appVars[section].newDefinition.devices.push(newElement);
    window.appVars[section].populateFields(window.appVars[section].delailIdx);
}


function appControlHandlers(section,details,elementTemplate,ctrlList) {

    $(ctrlList["prev"]).on('click',(evt) => {

                                  window.appVars[section].saveFields(window.appVars[section].delailIdx)

                                  if ( window.appVars[section].delailIdx > 0 ) window.appVars[section].delailIdx--;
                                  else window.appVars[section].delailIdx = window.appVars[section].newDefinition[details].length - 1;

                                  window.appVars[section].populateFields(window.appVars[section].delailIdx)

                              })


    $(ctrlList["next"]).on('click',(evt) => {
                                  window.appVars[section].saveFields(window.appVars[section].delailIdx)
                                  window.appVars[section].delailIdx++;

                                  if ( window.appVars[section].delailIdx >= window.appVars[section].newDefinition[details].length ) {
                                      window.appVars[section].delailIdx = 0;
                                  }

                                  window.appVars[section].populateFields(window.appVars[section].delailIdx)
                              })


    $(ctrlList["add"]).on('click',(evt) => {
                                     createNewDetailObject(section,details,elementTemplate,ctrlList)
                              })


    $(ctrlList["delete"]).on('click',(evt) => {
                                    window.appVars[section].newDefinition.devices.splice(window.appVars[section].delailIdx,1)
                                    window.appVars[section].delailIdx =
                                            Math.min(window.appVars[section].delailIdx,window.appVars[section].newDefinition[details].length-1)
                                    window.appVars[section].populateFields(window.appVars[section].delailIdx);
                              })


    $(ctrlList["panel"]).on('show.bs.modal', (e) => {
                               if ( window.appVars[section].newDefinition === null ) {
                                   window.appVars[section].createNewContainerElement()
                               } else {
                                   if ( window.appVars[section].delailIdx < 0 ) window.appVars[section].delailIdx = 0;
                                   window.appVars[section].populateFields(window.appVars[section].delailIdx)
                               }
                           });

}





function genericMasterDetail(section,masterMap,detai1,panelName,detailModel,ctrlList) {

    window.appVars[section].newDefinition = null;

    // --- --- --- --- --- --- --- --- --- --- --- ---
    window.appVars[section].populateFields = (idx) => {
        populateMaster(masterMap,section);
        initCheckBoxes(section,detail1);
    };


    // --- --- --- --- --- --- --- --- --- --- --- ---
    window.appVars[section].saveFields = (idx) => {
        saveFields(masterMap,section);
        saveCheckBoxes(section,detail1);
    };


    // --- --- --- --- --- --- --- --- --- --- --- ---
    window.appVars[section].storeCurrentDev = () => {  // means you are done
        confirmRemoteStore(section,panelName)
    }


    // --- --- --- --- --- --- --- --- --- --- --- ---
    window.appVars[section].createNewContainerElement = () => {
        createMasterEntry(section,detail1,detailModel,bleModel)
    }


    // --- --- --- --- --- --- --- --- --- --- --- ---
    window.appVars[section].initForm  = () => {

        // custom this form
        if ( window.appVars.name ) {
            var userNameText = window.appVars.name.first + " " + window.appVars.name.last;
            $(window.appVars[section].uId).html(userNameText);
        }

        appControlHandlers(section,detail1,detailModel,ctrlList)

    }

}




/*

var mousedownonelement = false;

window.getlocalmousecoord = function (svg, evt) {
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    var localpoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    localpoint.x = Math.round(localpoint.x);
    localpoint.y = Math.round(localpoint.y);
    return localpoint;
};

window.createtext = function (localpoint, svg) {
    var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    var textdiv = document.createElement("div");
    var textnode = document.createTextNode("Click to edit");
    textdiv.appendChild(textnode);
    textdiv.setAttribute("contentEditable", "true");
    textdiv.setAttribute("width", "auto");
    myforeign.setAttribute("width", "100%");
    myforeign.setAttribute("height", "100%");
    myforeign.classList.add("foreign"); //to make div fit text
    textdiv.classList.add("insideforeign"); //to make div fit text
    textdiv.addEventListener("mousedown", elementMousedown, false);
    myforeign.setAttributeNS(null, "transform", "translate(" + localpoint.x + " " + localpoint.y + ")");
    svg.appendChild(myforeign);
    myforeign.appendChild(textdiv);

};

function elementMousedown(evt) {
    mousedownonelement = true;
}


$(('#thesvg')).click(function (evt) {
    var svg = document.getElementById('thesvg');
    var localpoint = getlocalmousecoord(svg, evt);
    if (!mousedownonelement) {
        createtext(localpoint, svg);
    } else {
        mousedownonelement = false;
    }
    });

*/
