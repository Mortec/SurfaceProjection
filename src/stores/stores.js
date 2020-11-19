import { writable, derived } from 'svelte/store';

const createStore = function( object ) {

	const { subscribe, set, update } = writable( object )

	return {

        subscribe,

        update,

        tune: ( newparams )  => {

            update( s =>( { ...s, ...newparams } ) )
        }
	}
}

export const pictureStore = createStore( {
    id: "pictureCanvas",
    imgUrl: "./assets/images/EM-portrait2.jpg",
    x : 0,
    y: 0,
    width: 100,
    height: 100,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0,
} )

export const surfaceStore = createStore({
    id: 'surfacePath',
    x: 0,
    y: 0,
    width: 216,
    height: 279,
    resX: 7,
    resY: 7,
    scale: 0.7,
    crop: 0,
    q: 0,
    r:0,
    threshold: 0,
    ceiling: 1,
    formula: 'Math.sin(i/a.length * Math.PI * (l*w/2)) * q',
    structure: "net",
    path: 'zig',
    paper_color: "white",
    pen_color: "black",
})

export const gcodeStore = createStore({
    title: "surface_projection",
    paper_color: "white",
    pen_color: "black",
})

export const projectStore = derived(
    [pictureStore, surfaceStore, gcodeStore],
        ( ([$pictureStore, $surfaceStore, $gcodeStore]) => (
            { ...{picture: $pictureStore, surface: $surfaceStore, gcode: $gcodeStore} }
            )
        )
    )