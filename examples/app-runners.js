


var gsHandleDragger = null;
var gsEndDragger = null;



class remoteAction {
    constructor(key,period,timelapse,count,value,device,characteristic,kind) {
        this.key = key;
        this.period = period;
        this.timelapse = timelapse;
        this.count = count;
        this.value = value;
        this.device = device;
        this.characteristic = characteristic;
        this.RWN = kind; /// by default ... read/write/notify
    }
}




window.appVars.runners = {};

// --- --- --- --- --- --- ---


window.appVars.runners.devicesInPlay = {};

appVars.runners.currentScript = "";
appVars.runners.currentDevice = "";
appVars.runners.currentCharacteristic = "";
appVars.runners.actionSet = [];

appVars.runners.currentAction = null;
appVars.runners.currentRow = 0;


function resetSelections(datum) {

   // adust scrolls and hilights.

}



// adds to data...
function add_device(dev_name) {

    if ( !(window.appVars.runners.devicesInPlay[dev_name]) ) {
        window.appVars.runners.devicesInPlay[dev_name] = { info : "", characteristcs : {} }; // characteristics go here...
    }

}



// THROW AWAY TEST LIST

var throwAwayTest = {
"1ebca2fe44590" : "sensor.temp.cool",
"1ebc3fea44590" : "sensor.weight.cool",
"1ebc4fae44590" : "sensor.size.cool",
"1ebc5afe44590" : "sensor.azimuth.cool",

"1ebcc2fe44590" : "1ebcc2fe44590",
"1ebc3cea44590" : "sensor.go.cool",
"1ebc4fce44590" : "sensor.hoho.cool",
"1ebee2fe44590" : "sensor.dddodo.cool",
"1ebc3cea44590" : "1ebc3cea44590",
"1ebc4fce44590" : "sensor.slow.cool"
};


function add_characteristic(char_name,dev_name) {

    var devData = window.appVars.runners.devicesInPlay[dev_name];
    if ( devData ) {
        devData.characteristcs[throwAwayTest[char_name]] = {
            cuuid : char_name,
            selectedAction : 0
        };  // list of actions
    }

}

function add_action(act_name,char_name,dev_name) {

}



/// elements to display on click

function listElementClick(event,listElGroup) {

    var elNameParts = listElGroup.split('-');

    if ( elNameParts[0] == "rsDeviceList" ) {
        var dev_name = $('#' + listElGroup + '-tspan').text();
        if ( dev_name ) {
            appVars.runners.currentAction = null;
            appVars.runners.currentDevice = dev_name;
            updateTSpans(Object.keys(window.appVars.runners.devicesInPlay[dev_name].characteristcs),"rsCharacteristicsList");
        }
    } else if ( elNameParts[0] == "rsCharacteristicsList" ) {

        var char_name = $('#' + listElGroup + '-tspan').text();
        if ( char_name.length ) {

            appVars.runners.currentAction = null;
            appVars.runners.currentCharacteristic = char_name;

            var devData = window.appVars.runners.devicesInPlay[appVars.runners.currentDevice];
            if ( devData ) {
                var txt = devData.characteristcs[char_name].cuuid;
                $("#requirementTxt tspan").text(txt);
            } else {
                $("#requirementTxt tspan").text("");
            }

            $("#rsDelayBox-Field").val("")
            $("#rsPeriodBox-Field").val("")
            $("#rsCountBox-Field").val("")
        }

    } else {
        if ( elNameParts.length > 1 ) {
            var row = elNameParts[1];
            if ( appVars.runners.actionSet.length > (row-1) ) {
                var datum = appVars.runners.actionSet[row-1];

                var lapse = $("#rsTimeLapseList-" + row + "-tspan").text();
                var period = $("#rsPeriodList-" + row + "-tspan").text();
                var count = $("#rsCountList-" + row + "-tspan").text();

                $("#rsDelayBox-Field").val(lapse)
                $("#rsPeriodBox-Field").val(period)
                $("#rsCountBox-Field").val(count)

                appVars.runners.currentDevice = datum.device;
                appVars.runners.currentCharacteristic = datum.characteristics;

                appVars.runners.currentAction = datum;
                appVars.runners.currentRow = row;
                resetSelections(datum)

            }
        }
    }

}


// --- --- --- --- --- --- ---



var runnersListGroups = {
  "rsDeviceList": 9,
  "rsActionList": 5,
  "rsCharacteristicsList": 9,
  "rsTimeLapseList": 5,
  "rsPeriodList": 5,
  "rsCountList": 5,
  "valueList": 5
};




var runnersListGroupsActions = {
    // ---
    "rsDeviceList": (e) => {
    },
    "rsCharacteristicsList": (e) => {
    },
    // ---
    "rsActionList":  (e) => {
    },
    "rsTimeLapseList": (e) => {
    },
    "rsPeriodList": (e) => {
    },
    "rsCountList": (e) => {
    },
    "valueList": (e) => {
    }
};



function updateTSpans(names,listGroup) {

    window.appVars.runners.clearOneTSpanList(listGroup);

    var n = runnersListGroups[listGroup];
    var nEls = names.length;

    n = Math.min(nEls,n);

    for ( var i = 0; i < n; i++ ) {
        var tname = listGroup + "-" + (i+1) + "-tspan";
        $('#' + tname).text(names[i]);
    }

}


function updateActionLists() {

    var n = Math.min(appVars.runners.actionSet.length,runnersListGroups["rsActionList"]);

    window.appVars.runners.clearOneTSpanList("rsActionList");
    window.appVars.runners.clearOneTSpanList("rsTimeLapseList");
    window.appVars.runners.clearOneTSpanList("rsPeriodList");
    window.appVars.runners.clearOneTSpanList("rsCountList");
    window.appVars.runners.clearOneValueList("value");


    for ( var i = 0; i < n; i++ ) {
        // this is a test...
        var datum = appVars.runners.actionSet[i];

        var j = '' + (i + 1);

        if ( i < runnersListGroups["rsActionList"] ) {
            $("#rsActionList-" + j + "-tspan").text(datum.key);
        }
        if ( i < runnersListGroups["rsTimeLapseList"] ) {
            $("#rsTimeLapseList-" + j + "-tspan").text(datum.timelapse);
        }
        if ( i < runnersListGroups["rsPeriodList"] ) {
            $("#rsPeriodList-" + j + "-tspan").text(datum.period);
        }
        if ( i < runnersListGroups["rsCountList"] ) {
            $("#rsCountList-" + j + "-tspan").text(datum.count);
        }
        if ( i < runnersListGroups["valueList"] ) {
            $("#value-" + j + "-Box-Field").val(datum.value);
        }
    }

}


function addInNewAction(actionType) {

    var device = appVars.runners.currentDevice;

    if ( device && device.length ) {
        var characteristic = appVars.runners.currentCharacteristic;
        if ( characteristic && characteristic.length ) {

            var value = "";

            var key = actionType + "-" + appVars.runners.currentDevice + appVars.runners.currentCharacteristic;

            var timelapse = $("#rsDelayBox-Field").val();
            var period = $("#rsPeriodBox-Field").val();
            var count = $("#rsCountBox-Field").val();

            var newAction = new remoteAction(key,period,timelapse,count,value,device,characteristic,);
            appVars.runners.actionSet.unshift(newAction);
            updateActionLists();

        }
    }

}


function sendAction(action) {

    if ( typeof dataIo !== 'undefined' ) {
        dataIo.emit(JSON.stringify(action));
    }

}




var runnersReactors = {
  "g": {

    "rsSendSelectedActionsToScript": (e) => {

            //soloAction-1-CheckBox-CheckBox
            var nActions = runnersListGroups["rsActionList"]
            nActions = Math.min(nActions,appVars.runners.actionSet.length);

            for ( var i = 0; i < nActions ; i++ ) {

                var checkCheckBox = `#soloAction-${i+1}-CheckBox-CheckBox`;

                if ( $(checkCheckBox).prop('checked') ) {
                    var action = appVars.runners.actionSet[i];
                    sendAction(action);
                }
            }

        },

    "rsSelectAllSolo": (e) => {
            var nActions = runnersListGroups["rsActionList"]
            nActions = Math.min(nActions,appVars.runners.actionSet.length);

            var allChkced = false;

            for ( var i = 0; i < nActions ; i++ ) {
                var checkCheckBox = `#soloAction-${i+1}-CheckBox-CheckBox`;
                var chkced = $(checkCheckBox).prop('checked');
                allChkced = chkced | allChkced;
            }

            for ( var i = 0; i < nActions ; i++ ) {
                var checkCheckBox = `#soloAction-${i+1}-CheckBox-CheckBox`;
                $(checkCheckBox).prop('checked',!allChkced);
            }

        },



    "rsManageWriteCharacteristic": (e) => {
            addInNewAction("write")
        },

    "rsManageReadCharacteristic": (e) => {
            addInNewAction("read")
        },

    "rsManageNotifyCharacteristic": (e) => {
            addInNewAction("notify")
        },

    "rsStoreActions": (e) => {

            if ( appVars.runners.currentAction ) {
                var datum = appVars.runners.currentAction;

                datum.timelapse = $("#rsDelayBox-Field").val();
                datum.period = $("#rsPeriodBox-Field").val();
                datum.count = $("#rsCountBox-Field").val();

                var fieldRow = appVars.runners.currentRow;

                datum.value = $("#value-" + fieldRow + "-Box-Field").val();

                updateActionLists();
            }

        },

    "rsDeleteActions": (e) => {

            var nActions = runnersListGroups["rsActionList"]
            nActions = Math.min(nActions,appVars.runners.actionSet.length)
            for ( var i = nActions-1; i >= 0 ; i-- ) {

                var checkCheckBox = `#rsDelAction-${i+1}-CheckBox-CheckBox`;

                if ( $(checkCheckBox).prop('checked') ) {
                    appVars.runners.actionSet.splice(i,1);
                    $(checkCheckBox).prop('checked',false);
                }

            }

            updateActionLists();
        },

    "rsRunSelectedScript": (e) => {

            if ( appVars.runners.currentScript ) {

                // script callback is better....
                // simulate
                window.appVars.runners.allClearTSpanText();
                //

                if ( window.appVars.runners.scriptRunning && appVars.runners.currentScript.length ) {
                    runnersReactors.g.rsStopSelectedScript()
                }

                // AJAX....

                $.ajax({
                    type: 'get',
                    url: '/runScript',      // this url is found in the server as an 'express' route
                    data: appVars.runners.currentScript,
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (data) {

                        window.appVars.runners.scriptRunning = true;

                        add_device("888afe44590")
                        add_device("1e88afe44590")
                        add_device("1ebcafe44590")

                        updateTSpans(Object.keys(window.appVars.runners.devicesInPlay),"rsDeviceList")

                        add_characteristic("1ebca2fe44590","888afe44590")
                        add_characteristic("1ebc3fea44590","888afe44590")
                        add_characteristic("1ebc4fae44590","888afe44590")
                        add_characteristic("1ebc5afe44590","888afe44590")

                        add_characteristic("1ebcc2fe44590","1e88afe44590")
                        add_characteristic("1ebc3cea44590","1e88afe44590")
                        add_characteristic("1ebc4fce44590","1e88afe44590")

                        add_characteristic("1ebee2fe44590","1ebcafe44590")
                        add_characteristic("1ebc3cea44590","1ebcafe44590")
                        add_characteristic("1ebc4fce44590","1ebcafe44590")

                        add_action("read")
                        add_action("write")
                        add_action("notify")

                    }
                });

            }

        },

        "rsStopSelectedScript": (e) => {
            if ( typeof dataIo !== 'undefined' ) {
                var stopCMD = {
                    cmd : "stop",
                    script : appVars.runners.currentScript
                }
                dataIo.emit(JSON.stringify(stopCmd));
            }

        }
  },
  "ellipse": {
    "scrollHandleAction": (e,p2) => {
            //
            runnersReactors.runnersReactors.currentScrollRef = $('#' + p2);
     }
  },
  "path": {
    "rsDevCharScollUp": (e,p2) => {},
    "rsDevCharScollDown": (e,p2) => {}
  }
}



window.appVars.runners.buttons = [
    "sendActionButton",
    "sendActionButton-rect",
];

window.appVars.runners.displayTexts = [
];

window.appVars.runners.displayFields = [
    "value-1-Box",
    "value-2-Box",
    "value-3-Box",
    "value-4-Box",
    "value-5-Box",
    "rsDelayBox",
    "rsPeriodBox",
    "rsCountBox",
];

window.appVars.runners.displayCheckBox = [
    "rsDelAction-1-CheckBox",
    "rsDelAction-2-CheckBox",
    "rsDelAction-3-CheckBox",
    "rsDelAction-4-CheckBox",
    "rsDelAction-5-CheckBox",
    "soloAction-1-CheckBox",
    "soloAction-2-CheckBox",
    "soloAction-3-CheckBox",
    "soloAction-4-CheckBox",
    "soloAction-5-CheckBox",
];

window.appVars.runners.displayEllipses = [
];

window.appVars.runners.tspanList = {
  "rsDeviceList": {
    "rsDeviceList-1-tspan": 1,
    "rsDeviceList-2-tspan": 2,
    "rsDeviceList-3-tspan": 3,
    "rsDeviceList-4-tspan": 4,
    "rsDeviceList-5-tspan": 5,
    "rsDeviceList-6-tspan": 6,
    "rsDeviceList-7-tspan": 7,
    "rsDeviceList-8-tspan": 8,
    "rsDeviceList-9-tspan": 9
  },
  "rsActionList": {
    "rsActionList-1-tspan": 1,
    "rsActionList-2-tspan": 2,
    "rsActionList-3-tspan": 3,
    "rsActionList-4-tspan": 4,
    "rsActionList-5-tspan": 5
  },
  "rsCharacteristicsList": {
    "rsCharacteristicsList-1-tspan": 1,
    "rsCharacteristicsList-2-tspan": 2,
    "rsCharacteristicsList-3-tspan": 3,
    "rsCharacteristicsList-4-tspan": 4,
    "rsCharacteristicsList-5-tspan": 5,
    "rsCharacteristicsList-6-tspan": 6,
    "rsCharacteristicsList-7-tspan": 7,
    "rsCharacteristicsList-8-tspan": 8,
    "rsCharacteristicsList-9-tspan": 9
  },
  "rsTimeLapseList": {
    "rsTimeLapseList-1-tspan": 1,
    "rsTimeLapseList-2-tspan": 2,
    "rsTimeLapseList-3-tspan": 3,
    "rsTimeLapseList-4-tspan": 4,
    "rsTimeLapseList-5-tspan": 5
  },
  "rsPeriodList": {
    "rsPeriodList-1-tspan": 1,
    "rsPeriodList-2-tspan": 2,
    "rsPeriodList-3-tspan": 3,
    "rsPeriodList-4-tspan": 4,
    "rsPeriodList-5-tspan": 5
  },
  "rsCountList": {
    "rsCountList-1-tspan": 1,
    "rsCountList-2-tspan": 2,
    "rsCountList-3-tspan": 3,
    "rsCountList-4-tspan": 4,
    "rsCountList-5-tspan": 5
  }
};






window.appVars.runners.clearOneTSpanList = (gk) => {
    var tset = window.appVars.runners.tspanList[gk];
    for ( var tk in tset ) {
        $('#' + tk).text("");
    }
}


window.appVars.runners.clearOneValueList = (listName) => {

    var n = runnersListGroups[listName + "List"];

    for ( var i = 0; i < n; i++ ) {
        var j = (i+1);
       $('#' + listName + '-' + j + '-Box-Field').val("");
    }
}

window.appVars.runners.allClearTSpanText = () => {

    for ( var gk in window.appVars.runners.tspanList ) {
        window.appVars.runners.clearOneTSpanList(gk);
    }

}


function initElements(eList,count) {

    for ( var i = 0; i < count; i++ ) {
        var groupName = '#' + eList + (i+1);
        $(groupName).on('click',runnersListGroupsActions[eList]);
    }

}

window.appVars.runners.initLists = () => {

    for ( var gk in runnersListGroups ) {
        var count = runnersListGroups[gk];
        initElements(gk,count);
    }

}




window.appVars.runners.initScrollBars = () => {

    var scrollBars = ['devicesScroll', 'characteristicScroll', 'actionSeqScroll'];

    var devSlider = new svgSlider(scrollBars[0],{ min : 0, max : 100 });
    var charSlider = new svgSlider(scrollBars[1],{ min : 0, max : 100 });
    var actionSlider = new svgSlider(scrollBars[2],{ min : 0, max : 100 });




/*
$('#characteristicScroller').on('mousedown',(evt) => {
                            console.log(JSON.stringify(evt))
                        })
$('#actionSeqScroller').on('mousedown',(evt) => {
                            console.log(JSON.stringify(evt))
                        })
*/

}

window.appVars.runners.ready = () => {

    window.appVars.runners.allClearTSpanText();

    window.appVars.runners.initLists();
    window.appVars.runners.initScrollBars();


    appVars.runners.buttons.forEach( (elem) => {
                    initializeButton(elem);
                })

    appVars.runners.displayTexts.forEach( (elem) => {
                    initializeText(elem);
                })

    appVars.runners.displayFields.forEach( (elem) => {
                     initializeField(elem);
                 })

    appVars.runners.displayCheckBox.forEach( (elem) => {
                   initializeCheckBox(elem);
               })

    appVars.runners.displayEllipses.forEach( (elem) => {
                   initializeEllipses(elem);
               })


    $("#scriptDropDown-Select").on("change",() => {
                                        appVars.runners.currentScript = $( "#scriptDropDown-Select").val();
                                   })

};





function add_script(src_name) {
    $('#scriptDropDown-Select').append('<option>' + src_name + '</option>' );
    $('#scriptDropDown-Select').val(src_name);
    appVars.runners.currentScript = $( "#scriptDropDown-Select").val();
}





window.appVars["runners"].initForm  = () => {

    window.appVars.runners.ready();

    add_script("all-sensors");
    add_script("temperature-sensors");

}



