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