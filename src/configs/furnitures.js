//https://fr.wikipedia.org/wiki/Format_de_papier

//millimeters
export const paper_formats = [
    {name: "A4", format : { width:  210, height: 297} },
    {name: "sLTR", format : { width:  210, height: 260} },//custom
    {name: "A3", format : { width:  297, height: 420} },
    {name: "sLTRxl", format : { width:  260, height: 330} },//custom
    {name: "LTR", format : { width:  216, height: 279} },
    {name: "LDGR", format : { width:  279, height: 432} },
    {name: "Ecu", format : { width:  400, height: 520} },
]

//https://html-color-codes.info/

export const paper_colors = [
  "#FFFFFF",//white
  "#424242",//black
  "#BDBDBD",//gray
  "#FE2E2E",//red
]

//millimeters
export const pen_strokes = [0.1, 0.3, 0.5, 0.7, 1]


export const pen_colors = [
  "#000000", //black
  "#FFFFFF", //white
  "#DF0101", //red
  "#0000FF", //blue
  "#098A29", //green
  "#B18904", //gold
  "#C6C6C6" //silver
]
