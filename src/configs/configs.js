export const defaultProject = {

    title: "surface_projection",

    picture: {
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
    },

    surface: {
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