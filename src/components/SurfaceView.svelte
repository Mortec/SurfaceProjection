<script>
  import { onMount } from "svelte"
  import { Surface } from "../libs/surface.js"
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

    export let params = {
        id: 'surfacePath',
        x: 0,
        y: 0,
        format: {name: "sLTR", width:  210, height: 260 },
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
    }

    let width = 210
    let height = 279
    let scale = 1
    let paper_name = "sLTR"
    /*nota:
    path: zig = unique snake path along the x axis
        zag: unique snake path along the y axis
        d->l : unique path with sorting of vertices based on luminance, darkness to light 
    */

    let surface = new Surface()

    const formula = (x, y, l, i, a, q, w, h ) => Math.sin( i/a.length * Math.PI * (l*w/2) ) * q

    onMount( () => {

        surface.params = params
        pictureStore.subscribe( s =>{
            surface.loadTexture( s.id )
                .computeMap( formula )
                .computePath()
                .computePathString()
            surfaceStore.tune({})
        })

        surfaceStore.subscribe( s => {
            surface.params = s
            paper_name = s.format.name
            surface.setVertices()
                    .loadTexture()
                    .computeMap( formula )
                    .computePath()
                    .computePathString()
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

  $: surfaceStore.tune( params )
  $: width = height * params.format.width/params.format.height
  $: scale = height/(params.format.height * 3.779527559)
  $: params.format = paper_formats.filter( p => p.name === paper_name )[0]




</script>



<!-- STYLE -------------------------------------------------------- -->


<style>

    .surfaceView{
        width: calc(100vh/400 * 216 * 1.5);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

	.surface{
		padding: none;
		background-color: white;	
		border: 1px solid rgb(211, 211, 211);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
      }
      
    .surface_params{
        background-color: rgb(237, 237, 237);
        width: calc(100vh/400 * 216 * 0.5 );
        padding-left: 1em;
        padding-right: 0.5em;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
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
        font-size: 0.9em;
        font-family: abel, roboto;
        border: none;
        height:  1.8em;
        padding: none;
        margin: none;
        margin-left: 1em;
        display: inline-block;
        width :auto;
        background-color: whitesmoke;
    }
    option{
        padding: none;  
        margin: none;
    }

</style>


<!-- pseudoHTML -------------------------------------------------------- -->
<!-- https://oreillymedia.github.io/Using_SVG/guide/units.html } -->

<div class="surfaceView" in:fade>

    <div class="surface"
        bind:clientHeight={height}
        style="
            width: {width};
            height: 70vh;
        "
        
    >
  <DragLogger bind:x={params.x} bind:y={params.y}/>

  <!-- on:mousedown={ mousedown }
  on:mouseup={ mouseup }
  on:mouseout={ mouseup }
  on:mousemove={ drag } -->
        <svg id="surfacesvg"

            width = {width}
            height = {height}
            viewBox = "0, 0, {params.format.width}, {params.format.height}"
            style="
            background-color:{params.paper_color};
            "
            >

                <path id={params.id}
                    style="
                        fill : none;
                        stroke-width: {params.pen_stroke};
                        stroke : {params.pen_color};
                        stroke-opacity:{ params.pen_opacity};
                    "
                    d="M100 0 L200 100 L0 200 Z"
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
            range={{min: 2, max: params.format.width}}
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
            name="q"
            label="__q"
            range={{min: 0, max: 1}}
            step={0.001}
            value={params.q}
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
                 size="0.7em"
                 radius="50%"
                 value={color}
                 />
            {/each}
        </div>

        <div>
            <span>pen stroke [mm] :</span><br>
            {#each pen_strokes as stroke, id}

                 <InputRadio
                 id="penstroke-{id}"
                 bind:group={params.pen_stroke}
                 size="{ (0.8 - 0.4) * stroke + 0.2 }em"
                 radius="50%"
                 value={stroke}
                 color={"black"}
                 />
                 <span style="font-size: 0.8em">{stroke}</span>

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

