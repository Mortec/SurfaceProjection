export const defaultProject = {

    title: "surface_projection",

    picture: {
        id: "pictureCanvas",
        imgUrl: "./assets/images/EM-Portrait2.jpg",
        x : 0,
        y: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 0.0,
        blur: 0,
        zoom: 0.7,
        invert: 0.0,
    },

    surface: {
        id: 'surfacePath',
        x: 0,
        y: 0,
        format:{name: "sLTR", width:  210, height: 260 },
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
        paper_color: "#FFFFFF",
        pen_color: "#000000",
        pen_stroke: 0.5,
        pen_opacity: 1
    },

    gcode: {
        title: "surface_projection",
        begin_sequence:"",
        pen_up_sequence:"",
        pen_down_sequence:"",
        end_sequence:"",
    }
}

export const defaultProjects = {
    last_project_title: defaultProject.title,
    projects: [defaultProject]
}