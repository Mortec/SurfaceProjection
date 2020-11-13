import { writable } from 'svelte/store';


function createPicture() {

	const { subscribe, set, update } = writable({
        src: './assets/images/Michael-Faraday.jpg',
        image: new Image(),
        width: 216, 
        height: 279,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        position: {x: 0, y: 0},
        ctxt: {}
    })

	return {
        subscribe,
        update,
		load: ( src ) =>  {

            update( s => { 

                const ctxt = document.getElementById("pictureCanvas").getContext("2d")
                const width = ctxt.canvas.width
                const height = ctxt.canvas.height
                
                const image = new Image()
                image.onload = () => {
                    
                    ctxt.scale(s.zoom, s.zoom)
                    ctxt.filter = `brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation}) blur(${s.blur*50}px)`
                    ctxt.drawImage(image, s.position.x, s.position.y, width , height )
                }
                image.src = src
                
                return { ...s, ...{ src, width, height, image, ctxt } }
            })
        },
        draw: ()=>{
            update( s =>{
                s.ctxt.scale(s.zoom, s.zoom)
                s.ctxt.filter = `brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation}) blur(${s.blur*5}px)`
                s.image.onload = () => {
                    s.ctxt.drawImage(s.image, s.position.x, s.position.y, s.width , s.height )
                }
                return s
            })
        },
        tune: (param)  => {
            update( s =>( { ...s, ...param} ) )
        }
	}
}

export const picture = createPicture()