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
        gcode_cmds: {
            drawing_speed: 5000,
            translate_speed: 10000,
            begin:"G17;G90;G00 Z1;G00 X0 Y0;",
            pen_up:"G04 P0.25;G00 Z0.25;M03 S80;",
            pen_down:"G01 Z0 F1000;M05;G04 P0.25;",
            end:"G04 P0.5;G00 X0 Y0 F10000;",
        }
    }
}

export const defaultProjects = {
    last_project_title: defaultProject.gcode.title,
    projects: [{...{},...defaultProject}]
}