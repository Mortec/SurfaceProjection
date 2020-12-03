const defaultProject = {

    picture: {
        id: "pictureCanvas",
        imgUrl: "./assets/images/EM-Portrait2.jpg",
        x : 0,
        y : 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 0.0,
        blur: 0,
        zoom: 0.47,
        invert: 0.0,
    },

    surface: {
        x: 0,
        y: 0,
        resX: 10,
        resY: 10,
        scale: 0.7,
        crop: 0,
        a: 0,
        f: 0,
        threshold: 0,
        ceiling: 1,
        formula: 'sin(i/(w*h) * PI * (l*w/2.)) * a',
        structure: "net",
        path: 'zig',
    },

    gcode: {
        title: "surface_projection",
        pen_color: "#000000",
        pen_stroke: 0.5,
        pen_opacity: 1,
        format: {name:"sLTR", width: 216, height: 260},
        paper_color: "#FFFFFF",
        begin_sequence:"",
        pen_up_sequence:"",
        pen_down_sequence:"",
        end_sequence:"",
    }
}

export const defaultProjects = {
    last_project_title: defaultProject.gcode.title,
    projects: [{...{},...defaultProject}]
}