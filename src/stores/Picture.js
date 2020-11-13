import { writable } from 'svelte/store';


function createPicture() {

	const { subscribe, set, update } = writable({
        src: './assets/images/Michael-Faraday.jpg',
        image: new Image()
    })

	return {

        subscribe,

        update,

		init: ( src, id ) =>  {
            update( s => { 

                const ctxt = document.getElementById( id ).getContext("2d")
                const width = ctxt.canvas.width
                const height = ctxt.canvas.height
                const brightness= 1.0
                const contrast= 1.0
                const saturation= 1.0
                const blur = 0
                const zoom = 1
                const image = new Image()
                image.src = src

                return { ...s, ...{ src, width, height, image, ctxt, zoom, brightness, contrast, saturation, blur } }
            })
        },

        tune: (param)  => {
            update( s =>( { ...s, ...param } ) )
        }
	}
}

export const picture = createPicture()