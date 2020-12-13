export const getPathasString = coords => {

    return coords.map( c, i => {

        return i === 0 ? `M${c.x}, ${c.y} `
                        :
                        `L${c.x}, ${c.y} `;

        }
    ).join(" ");
}



export const buildSVG = (pathAsString, width, height, stroke, title) => {

    return `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Surface Projection, SVG Export. Surface Projection © Edouard Mortec lockdown 2020)  -->
<svg version="1.1" id="${title}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
x="0mm" y="0mm" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}"  
style="enable-background:new 0 0 ${width} ${height}" xml:space="preserve">
     <path id="${title}_path" style="fill: none; stroke-width: ${stroke}mm; stroke: black;"
           d="${pathAsString}"
    />
</svg>`;
}



export const buildGCODE = ( coords, params ) => {

const begin = `
(Generator: Surface Projection, Gcode Export. Surface Projection © Edouard Mortec lockdown 2020)

(BEGIN)
G17
G90
G00 Z1
G00 X0 Y0

`


const penup = `
(PEN_UP)
G00 Z0.25
${params.pen_up}

(TRANSLATE)
`


const pendown = `

(PEN_DOWN)
G01 Z0 F1000
${params.pen_down}
G04 P0.20

(DRAW)
`


const end = `

(END)
G00 Z1
G00 X0 Y0 F10000
`


const path = coords.map( c, i, a => {

    const speed = params.map_l ? 
                c.z * ( params.max_speed - params.min_speed ) + params.min_speed
                :
                params.max_speed

    speed = Math.round(speed)

    const code =
        i === 0 ?
            penup + `G01 X${c.x} Y${c.y} F${params.translate_speed}
            `
            : 
            i === 1 ? 
                pendown + `G01 X${c.x} Y${c.y} F${speed}
                `
                :
                i === (a.length - 1) ?
                    `G01 X${c.x} Y${c.y} F${speed}
                    ` + penup
                    :
                    `G01 X${c.x} Y${c.y} F${speed}
                    `

}).join("\n");


return begin + path + end;
}