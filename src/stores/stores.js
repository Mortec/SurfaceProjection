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
    y : 0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0,
} )

export const surfaceStore = createStore({
    x: 0,
    y: 0,
    format: {name:"sLTR", width: 216, height: 260},
    resX: 7,
    resY: 7,
    scale: 0.7,
    crop: 0,
    a: 0,
    f: 0,
    threshold: 0,
    ceiling: 1,
    formula: 'sin(i/(w*h) * PI * (l*w/2.)) * a',
    structure: "net",
    path: 'zig',
    paper_color: "#FFFFFF",
    pen_color: "#000000",
    pen_stroke: 0.5,
    pen_opacity: 1
})

export const gcodeStore = createStore({
    title: "surface_projection",
    begin_sequence:"",
    pen_up_sequence:"",
    pen_down_sequence:"",
    end_sequence:"",
})

export const projectStore = derived(
    [pictureStore, surfaceStore, gcodeStore],
        ( ([$pictureStore, $surfaceStore, $gcodeStore]) => (
            { ...{picture: $pictureStore, surface: $surfaceStore, gcode: $gcodeStore} }
            )
        )
    )