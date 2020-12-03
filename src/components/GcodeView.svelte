<script>
  import { createEventDispatcher } from "svelte";

  import IconButton from "./IconButton.svelte";
  import InputColorRadio from "./InputColorRadio.svelte";
  import InputRadio from "./InputRadio.svelte";
  import Fader from "./Fader.svelte";

  import { gcodeStore as gcode } from "../stores/stores.js";
  import { paper_colors,  paper_formats, pen_colors, pen_strokes, } from "../configs/furnitures.js";


  let paper_name = "sLTR" 
  export let saveStatus = "waiting"
  
  const dispatch = createEventDispatcher()

  const exportGCODE = function(){
        const GCODEstring = "buildGCODEstring"
        dispatch('exportGCODE', GCODEstring ) 
  }

  const saveProject = function() {
      dispatch('saveProject')
  }



  $: $gcode.format = paper_formats.filter( p => p.name === paper_name )[0]


</script>

<style>
    .gcodeView {
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: 0px;
		padding: 0px;
    height: 70vh;
    width: 26vh;
	}

    .inline_feature {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-content: center;
    justify-self: flex-start;
    align-self: flex-start;
    margin: 0px;
    width: 100%;
    margin-top: 0.5em;
  }

  .gcode_params {
    background-color: rgb(237, 237, 237);
    width: 28vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0px;
    padding: 1em;
    height: 100%;
    width: 100%;
  }

  input[type="text"] {
    font-family: "Cutive Mono", monospace;
    letter-spacing: -2px;
    margin: 0px 0px 0px 0.5em;
    height: 1.24em;
    border: none;
    width: 90%;
    outline: none;
  }

  /* input[type="text"]:focus {
    outline: none;
  } */

  .savebutton {
    position: absolute;
    z-index: 1010;
  }

  label {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }


  select {
    outline: none;
    font-size: 0.8em;
    font-family: abel, roboto;
    border: none;
    height: 1.8em;
    padding: 0px;
    margin: 0px;
    margin-left: 1em;
    display: inline-block;
    width: auto;
    background-color: whitesmoke;
  }
  option {
    padding: 0px;
    margin: 0px;
  }
  .path_infos {
    font-family: "Cutive Mono", monospace;
    font-size: 0.9em;
    letter-spacing: -1px;
    align-self: flex-start;
  }

  .slot {
    margin-top: 2em;
  }

  .gcode{
    width: 100%;
  }

  .inline_feature>label{

    text-align: left;
    padding-bottom: 0.5ch;
  }
  .inline_feature>input[type="text"]{
    width: 70%;
  }

  .inline_feature>input[type="number"]{
    width: 50%;
    height: 2.5ex;
    outline: none;
  }

</style>

<div class="gcodeView">
    
  <div class="gcode_params">

      <div class="inline_feature">
        <label for="title">title:</label>
        <input type="text" name="title" bind:value={$gcode.title} on:blur={saveProject}/>
        
        <div class="save" >
          <IconButton
          iconUrl="./assets/icons/save.png"
          on:action={saveProject}
          bind:status={saveStatus}
          tip="Save project"
          tipsuccess="Project saved"
          tiperror="error while saving, please retry" />
        </div>
      </div>

      <div class="pen">
        <div class="slot">
          <span>pen color: </span><br />
          {#each pen_colors as color, id}
            <InputColorRadio
              id="pencolor-{id}"
              bind:group={$gcode.pen_color}
              size="12px"
              radius="50%"
              value={color} />
          {/each}
        </div>

        <div class="slot">
          <span>pen stroke: <span style="font-size:0.9em;">[mm]</span> :</span><br />
          {#each pen_strokes as stroke, id}
            <InputRadio
              id="penstroke-{id}"
              bind:group={$gcode.pen_stroke}
              size="{(10 - 4) * stroke + 4}px"
              radius="50%"
              value={stroke}
              color={'black'} />
            <span style="font-size: 0.8em; margin-right: 0.5em;">{stroke}</span>
          {/each}
        </div>

        <div class="slot">
          <Fader
            name="pen_opacity"
            label="ink_op."
            range={{ min: 0, max: 1 }}
            step={0.01}
            bind:value={$gcode.pen_opacity}
          />
        </div>
    </div>

    <div class="paper">
      <div class="slot">
        <span>paper color: </span>
        {#each paper_colors as color, id}
          <InputColorRadio
            id="papercolor-{id}"
            bind:group={$gcode.paper_color}
            size="0.7em"
            radius="0%"
            value={color} />
        {/each}
      </div>

      <div class="slot">
        <span>paper format: </span>
        <select id="paper_formats" bind:value={paper_name}>
          {#each paper_formats as item, i}
            <option value={item.name}>{item.name}</option>
          {/each}
        </select>
      </div>

    </div>

    <div class="gcode">

      <span>gcode cmds. :</span>

      <div class="inline_feature">
        <label for="drawing_speed">drawing speed: </label>
        <input type="number" name="drawing_speed"
          min={500} max={10000} step={1}
          bind:value={$gcode.gcode_cmds.drawing_speed}
        >
      </div>

      <div class="inline_feature">
        <label for="translate_speed">translate speed: </label>
        <input type="number" name="translate_speed"
        min={500} max={10000} step={1}
        bind:value={$gcode.gcode_cmds.translate_speed}
      >
      </div>

      <div class="inline_feature">
          <label for="begin_cmd">begin: </label>
          <input type="text" name="begin_cmd"
          bind:value={$gcode.gcode_cmds.begin}
        >
      </div>

      <div class="inline_feature">
          <label for="pen_up">pen up: </label>
          <input type="text" name="pen_up"
          bind:value={$gcode.gcode_cmds.pen_up}
          >
      </div>

      <div class="inline_feature">
          <label for="pen_down">pen down: </label>
          <input type="text" name="pen_down"
          bind:value={$gcode.gcode_cmds.pen_down}
          >
      </div>

      <div class="inline_feature">
          <label for="end_cmd">end: </label>
          <input type="text" name="end_cmd"
          bind:value={$gcode.gcode_cmds.end}
          >
      </div>

    </div>

    <div class="path_infos slot">
        <span>path_length: {"..."}_mm</span><br>
        <span>drawing_time: {"..."}_min</span>
    </div>

  </div>

</div>
