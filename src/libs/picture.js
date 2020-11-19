const Picture = function (  ){


    this.params = {
        id: 'pictureCanvas',
        x : 0,
        y: 0,
        width: 100,
        height: 100,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }

    this.buffer = {}
    
    this.ctxt = {}

    this.image = new Image()

    this.notify = function(){}
}

Picture.prototype.init = function( id ){

    this.params.id = id
    
    this.buffer = document.createElement('canvas')
    
    this.ctxt = document.getElementById( id ).getContext("2d")

    this.image = new Image()

    this.image.onload = () => {
        const width = this.image.naturalWidth
        const height = this.image.naturalHeight
        this.buffer.getContext('2d').canvas.width = width
        this.buffer.getContext('2d').canvas.height = height
        this.buffer.getContext('2d').drawImage( this.image, 0, 0, width, height )
        this.draw()
        this.notify()
        // console.log( "Picture loaded" )
    }
}

Picture.prototype.reset = function(){

    this.params = {
        x : 0,
        y: 0,
        width: 100,
        height: 100,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }
}

Picture.prototype.set = function( params ){

    if ( params ) this.params = {...this.params, ...params }
    this.draw()
}

Picture.prototype.load = function( src ){

    
    // this.reset()
    this.image.src = src
}

Picture.prototype.draw = function(){

    const canvas = this.ctxt.canvas
    canvas.width = this.params.width
    canvas.height = this.params.height

    const area = {
        width: Math.floor( canvas.width/this.params.zoom )+1,
        height: Math.floor( canvas.height/this.params.zoom )
    }
    // console.log(area)
    const offset = {
        x: (this.buffer.getContext('2d').canvas.width - area.width)/2 - this.params.x/this.params.zoom ,
        y: (this.buffer.getContext('2d').canvas.height - area.height)/2 - this.params.y/this.params.zoom 
    }


    this.ctxt.clearRect(0, 0, canvas.width,  canvas.height);

    this.ctxt.filter =`
        brightness(${this.params.brightness})
        contrast(${this.params.contrast})
        saturate(${this.params.saturation})
        blur(${this.params.blur*5}px)
        invert(${this.params.invert})
    `
    this.ctxt.drawImage(this.buffer,
            offset.x, offset.y, area.width, area.height,
            0, 0, canvas.width, canvas.height
    )
}

Picture.prototype.getPixel = function( x, y) {

    return this.ctxt.getImageData(x, y, 1, 1)
}

export { Picture }