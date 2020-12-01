<script>
  import { onMount } from "svelte"
  import { Surface } from "../libs/surfaceGL.js"

  import  { surfaceStore }  from "../stores/stores.js"
  import  { pictureStore }  from "../stores/stores.js"
  import Fader from './Fader.svelte'
  import { createEventDispatcher } from 'svelte'
  import {fade } from 'svelte/transition'
  import IconButton from './IconButton.svelte'
  import { paper_colors, paper_formats, pen_colors, pen_strokes } from '../configs/furnitures.js'
  import InputColorRadio from './InputColorRadio.svelte'
  import InputRadio from './InputRadio.svelte'
  import { buildSVG } from '../libs/svgFuncs'
  import DragLogger from './DragLogger.svelte'
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";

    export let params = {
        x: 0,
        y: 0,
        format: {name: "sLTR", width:  210, height: 260 },
        resX: 7,
        resY: 7,
        scale: 0.7,
        crop: 0,
        a: 0,
        f: 0,
        threshold: 0,
        ceiling: 1,
        formula: 'sin(i/(w*h) * PI * (l*w/2)) * a',
        structure: "net",
        path: 'zig',
        paper_color: "#FFFFFF",
        pen_color: "#000000",
        pen_stroke: 0.5,
        pen_opacity: 1
    }

    let width = 210
    let height = 279
    let paper_name = "sLTR"
    /*nota:
    path: zig = unique snake path along the x axis
        zag: unique snake path along the y axis
        d->l : unique path with sorting of vertices based on luminance, darkness to light 
    */

    let surface = new Surface()

    const formula = (x, y, l, i, a, f, w, h ) => Math.sin( i/(w*h) * Math.PI * (l*w/2) ) * a

    onMount( () => {

        surface.params = params
        surface.init('surfacePath', 'glCanvas', 'pictureCanvas')
        pictureStore.subscribe( s =>{
            surfaceStore.trig()
        })

        surfaceStore.subscribe( s => {
            surface.params = s
            paper_name = s.format.name
            surface.compute()
                    .getData()
                    .computePath()
                    .computePathString()
            
                    // console.log(surface.data)
            }
            )
    })

    const dispatch = createEventDispatcher()

    const exportSVG = function(){
        const SVGstring = buildSVG( 
          surface.pathString,
          params.format.width,
          params.format.height,
          params.pen_stroke,
          "test"
        )
        dispatch('exportSVG', SVGstring ) 
    }


  const handleInput = e => {
    
    params = {...params, ...{[e.detail.name]: e.detail.value} }
  }

  const easedWidth = tweened(undefined, {
    duration: 1500,
    easing: quintOut,
  });

  $: surfaceStore.tune( params )
  $: params.format = paper_formats.filter( p => p.name === paper_name )[0]
  $: width = height * params.format.width/params.format.height
  $: easedWidth.set( width )




</script>



<!-- STYLE -------------------------------------------------------- -->


<style>

    .surfaceView{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

	.surface{
		padding: 0px;
		background-color: white;	
		border: 1px solid rgb(211, 211, 211);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
      }
      
    .surface_params{
        background-color: rgb(237, 237, 237);
        width: 26vh;
        padding-left: 1.2em;
        padding-right: 0.5em;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 0px;
        margin-left: 10px;
        /* height: 100%; */
      }

    .surface_params_faders{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .surface_params_formula{
        margin-top: 1em;
    }

    .surface_params_formula > span{
        width: 100%;
        margin-left: 1em;
    }

    #formula{
        background-color: rgb(222, 222, 222);
        color: rgb(0, 0, 0);
        padding: 0.5em;
        font-family: roboto, monospace;
        font-size: 0.85em;
        margin-left: 1em;
        margin-right: 1em;
        width: 100%;
        height: calc(100vh/400 * 90);
        resize: none;
        border: 0px solid transparent
    }

    #formula:focus{
        border: 0px solid transparent;
        box-shadow: transparent;
        outline: none;

    }

    .surface_params_pathFeedback{
        font-family: 'Cutive Mono', monospace;
        font-size: 0.85em;
        letter-spacing: -1px;
        align-self: flex-start;
    }

    
    label{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .savebutton{
        position: absolute;
        transform: translateY( -2.5em);
        z-index: 1010;
    }



    select{
        outline: none;
        font-size: 0.8em;
        font-family: abel, roboto;
        border: none;
        height:  1.8em;
        padding: 0px;
        margin: 0px;
        margin-left: 1em;
        display: inline-block;
        width :auto;
        background-color: whitesmoke;
    }
    option{
        padding: 0px;  
        margin: 0px;
    }

</style>


<!-- pseudoHTML -------------------------------------------------------- -->
<!-- https://oreillymedia.github.io/Using_SVG/guide/units.html } -->

<div class="surfaceView" in:fade>

    <div class="surface"
        bind:clientHeight={height}
        style="
            width: {$easedWidth};
            height: 70vh;
        "
        
    >
  <DragLogger bind:x={params.x} bind:y={params.y}/>

        <svg id="surfacesvg"

            width = {$easedWidth}
            height = {height}
            viewBox = "0, 0, {params.format.width}, {params.format.height}"
            style="
            background-color:{params.paper_color};
            "
            >

                <path id='surfacePath'
                    style="
                        fill : none;
                        stroke-width: {params.pen_stroke};
                        stroke : {params.pen_color};
                        stroke-opacity:{ params.pen_opacity};
                    "
                    d="M0 0 L{params.format.width} {params.format.height/2} L{params.format.width/2} {params.format.height} Z"
                />

        </svg>
        
        <div class="savebutton">
            <IconButton
            iconUrl="./assets/icons/export.png"
            on:action={ ()=>exportSVG()}
            tip="Export SVG"
            size= "1.2em"
            opacity="0.4"
            />
          </div>
    </div>

    <div class="surface_params">

        <div class="surface_params_faders">
            <Fader
            name="resX"
            label="res_x"
            range={{min: 2, max: params.format.width * 2}}
            step={1}
            value={params.resX}
            on:input={ handleInput }
            />

            <Fader
            name="resY"
            label="res_y"
            range={{min: 2, max: params.format.height}}
            step={1}
            value={params.resY}
            on:input={ handleInput }
            />

            <Fader
            name="scale"
            label="scale"
            range={{min: 0.25, max: 1.5}}
            step={0.01}
            value={params.scale}
            on:input={ handleInput }
            />

            <Fader
            name="crop"
            label="crop"
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.crop}
            on:input={ handleInput }
            />

            <Fader
            name="a"
            label="__a"
            range={{min: -1, max: 1}}
            step={0.001}
            value={params.a}
            on:input={ handleInput }
            />

            <Fader
            name="threshold"
            label="thrsh."
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.threshold}
            on:input={ handleInput }
            />

            <Fader
            name="ceiling"
            label="ceil."
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.ceiling}
            on:input={ handleInput }
            />
            
        </div>

        <div>
            <span>pen color</span><br>
            {#each pen_colors as color, id}
                 <InputColorRadio
                 id="pencolor-{id}"
                 bind:group={params.pen_color}
                 size="12px"
                 radius="50%"
                 value={color}
                 />
            {/each}
        </div>

        <div>
            <span>pen stroke <span style="font-size:0.9em;">[mm]</span> :</span><br>
            {#each pen_strokes as stroke, id}

                 <InputRadio
                 id="penstroke-{id}"
                 bind:group={params.pen_stroke}
                 size="{ (10 - 4) * stroke + 4 }px"
                 radius="50%"
                 value={stroke}
                 color={"black"}
                 />
                 <span style="font-size: 0.8em; margin-right: 0.5em;">{stroke}</span>

            {/each}
        </div>

        <div> 
        <Fader
            name="pen_opacity"
            label="ink_op."
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.pen_opacity}
            on:input={ handleInput }
        />
       </div>

        <div>
            <span>paper color</span>
            {#each paper_colors as color, id}
                 <InputColorRadio
                 id="papercolor-{id}"
                 bind:group={params.paper_color}
                 size="0.7em"
                 radius="0%"
                 value={color}
                 />
            {/each}
        </div>

        <div>
            <span>paper format</span>
            <select id="paper_formats" bind:value={paper_name}>
            {#each paper_formats as item, i }
                <option  value={item.name}>{item.name}</option>
            {/each}
            </select>
        </div>

        <!-- <div class = "surface_params_formula">
            <span>formula:</span>
            <label>
            <textarea id="formula" bind:value={params.formula}></textarea>
            </label>
        </div> -->

        <div class="surface_params_pathFeedback">
            <span >path_length: {surface.path.length}_pts</span>
        </div>

    </div>
    
</div>

