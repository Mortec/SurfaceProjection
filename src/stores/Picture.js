import { writable } from 'svelte/store';


function createPicture() {

	const { subscribe, set, update } = writable({
        buffer: document.createElement('canvas')
    })

	return {

        subscribe,

        update,

		init: ( src, id ) =>  {
            update( s => {

                const ctxt = document.getElementById( id ).getContext("2d")
                const width = ctxt.canvas.width
                const height = ctxt.canvas.height
                const x = 0
                const y = 0
                const brightness= 1.0
                const contrast= 1.0
                const saturation= 1.0
                const blur = 0
                const zoom = 1.0
                const image = new Image()
                const buffer = s.buffer
                image.onload = () => {
                    buffer.getContext('2d').canvas.width = image.naturalWidth
                    buffer.getContext('2d').canvas.height = image.naturalHeight
                    buffer.getContext('2d').drawImage( image, 0, 0, image.naturalWidth, image.naturalHeight )
                    update( s => s )
                }
                image.src = src

                return { ...s, ...{ src, width, height, x, y, buffer, ctxt, zoom, brightness, contrast, saturation, blur } }
            })
        },

        tune: ( param )  => {
            update( s =>( { ...s, ...param } ) )
        }
	}
}

export const picture = createPicture()