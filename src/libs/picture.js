const Picture = function (  ){


    this.params = {
        id: 'pictureCanvas',
        imgUrl: "./assets/images/IMG_0406.jpg",
        x : 0,
        y: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }
    this.width = 100
    this.height = 100
    this.buffer = {}
    
    this.ctxt = {}

    this.image = new Image()

    this.notifyLoaded = function(){}
}

Picture.prototype.init = function( id ){

    this.params.id = id
    
    this.buffer = document.createElement('canvas')
    
    this.ctxt = document.getElementById( id ).getContext("2d")

    this.image = new Image()

    this.image.onload = (e) => {

        const width = this.image.naturalWidth
        const height = this.image.naturalHeight
        this.buffer.getContext('2d').canvas.width = width
        this.buffer.getContext('2d').canvas.height = height
        this.buffer.getContext('2d').drawImage( this.image, 0, 0, width, height )
        this.draw()
        this.notifyLoaded()
        // try {
        //     this.buffer.toDataURL();
        //   } catch (e) {
        //     console.log("BUFFER TAINTED")
        //   }
    }
}


Picture.prototype.resize = function( width, height ){
    this.width = width
    this.height = height
}

Picture.prototype.reset = function(){

    this.params = {
        x : 0,
        y: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }
}

Picture.prototype.set = function( params ){

    this.params = {...this.params, ...params }
    this.draw()
}

Picture.prototype.load = function( url ){

    this.imgUrl = url
    this.image.crossOrigin='anonymous'
    this.image.src = url
}

Picture.prototype.loadLocal = function( file, callback ){

        const fr =  new FileReader();

        fr.onload = ()=>{

            const localUrl = fr.result;
            callback( localUrl )
            this.load( localUrl )
        }

        fr.readAsDataURL(file)
}

Picture.prototype.loadURL = function( url ){


    
}

Picture.prototype.draw = function(){


    const canvas = this.ctxt.canvas
    canvas.width = this.width
    canvas.height = this.height

    const area = {
        width: Math.floor( canvas.width/this.params.zoom ),
        height: Math.floor( canvas.height/this.params.zoom )
    }

    const offset = {
        x: (this.buffer.getContext('2d').canvas.width - area.width)/2 - this.params.x/this.params.zoom ,
        y: (this.buffer.getContext('2d').canvas.height - area.height)/2 - this.params.y/this.params.zoom 
    }

    this.ctxt.clearRect(0, 0, canvas.width,  canvas.height);

    this.ctxt.filter =`
        invert(${this.params.invert})
        brightness(${this.params.brightness})
        contrast(${this.params.contrast})
        saturate(${this.params.saturation})
        blur(${this.params.blur*5}px)
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