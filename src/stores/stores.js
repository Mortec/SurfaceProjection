import { writable } from 'svelte/store';


function createStore( params ) {

	const { subscribe, set, update } = writable( params )

	return {

        subscribe,

        update,

        tune: ( params )  => {
            update( s =>( { ...s, ...params } ) )
        }
	}
}

export const pictureStore = createStore( 
    {id: 'pictureCanvas', x: 0,  y: 0, width: 100, height: 100, brightness: 1, contrast: 1, saturation: 1, zoom: 1, blur: 0.5, invert: 0}
)

export const surfaceStore = createStore(
    {resX: 100, resY: 100, x: 0, y: 0, width: 1, height: 1, intensity: 1}
)