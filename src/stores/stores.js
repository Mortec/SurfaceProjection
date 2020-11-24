import { writable, derived } from 'svelte/store';

const createStore = function( object ) {

	const { subscribe, set, update } = writable( object )

	return {

        subscribe,

        set,

        update,

        tune: ( newparams )  => {

            update( s =>( { ...s, ...newparams } ) )
        },

        trig: ()=>{update( s => s)}
	}
}

export const pictureStore = createStore( {
    id: "pictureCanvas",
    imgUrl: "./assets/images/EM-portrait2.jpg",
    x : 0,
    y: 0,
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
    pen_stroke: 1,
    pen_opacity: 1
})

export const gcodeStore = createStore({
    title: "surface_projection",
})

export const projectStore = derived(
    [pictureStore, surfaceStore, gcodeStore],
        ( ([$pictureStore, $surfaceStore, $gcodeStore]) => (
            { ...{picture: $pictureStore, surface: $surfaceStore, gcode: $gcodeStore} }
            )
        )
    )