


class svgSlider {


    constructor(sliderGroupName,range) {

        this.topBox = document.getElementById(sliderGroupName);
        this.handle = document.getElementById(sliderGroupName + 'er');
        this.backRect = document.getElementById(sliderGroupName + '-rect');


        this.handle.setAttribute("class","rowElement");

        this.mappedCY = 0.0;

        this.topOffset = 10;

        this.HH = parseInt(this.backRect.getAttributeNS(null, 'height')) - (this.topOffset*2);
        this.YY = parseInt(this.backRect.getAttributeNS(null, 'y')) + this.topOffset;

        this.min = range.min;
        this.max = range.max;

        if ( this.max <= this.min ) throw(new Error("non positive range supplied in parameters"))

        this.range = this.max - this.min;
        this.value = 0;
        this.mappedCY = this.YY + 10;
        this.unmappedCY = this.mappedCY;
        this.unitDelta = this.HH/this.range;

        this.redraw();

        this.attachEventHandlers()

    }


    attachEventHandlers() {
        this.handle.addEventListener("mousedown", (e) => {
            this.startDrag(e);
        });
        this.handle.addEventListener("wheel", (e) => {
            this.mouseWheelHandler(e);
        });
    }


    mouseWheelHandler(e) {

    }

    startDrag(e) {

        this.lastMouseY = e.clientY;
        e.preventDefault();

        gsHandleDragger = (e) => { this.handleDrag(e) };
        gsEndDragger = (e) => { this.endDrag(e) };


        document.addEventListener('mousemove', gsHandleDragger, false);
        document.addEventListener('mouseup', gsEndDragger, false);

    }

    handleDrag(e) {

        var deltaY = this.lastMouseY - e.clientY;
        this.lastMouseY = e.clientY;

        if ( deltaY === 0 )  {
            return;
        }

        this.unmappedCY += -deltaY;

        if ( (this.unmappedCY < this.YY) || ( this.unmappedCY > (this.YY + this.HH) ) ) {
            return;
        }

        this.mappedCY = this.unmappedCY;
        this.redraw();
    }

    endDrag(e) {

        //console.log("ENDING DRAG" + this.lastMouseY)
        document.removeEventListener('mousemove', gsHandleDragger, false);
        document.removeEventListener('mouseup', gsEndDragger, false);
    }


    getValue(v) { return(this.value); }

    setValue(v) {

        if ( v < this.min ) {
            this.value = this.min;
        } else if ( v > this.max ) {
            this.value = this.max;
        } else {
            this.value = v;
        }

        this.mappedCY = (this.unitDelta*this.value);
        redraw();
    }

    incPosition(increment) {
        var v = this.value + increment;
        this.setValue(v);
    }

    redraw() {
        this.handle.setAttributeNS(null, 'cy',`${this.mappedCY}`);
    }


}



