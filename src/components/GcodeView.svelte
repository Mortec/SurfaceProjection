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

  const handleInput = e => {
    
    params = {...params, ...{[e.detail.name]: e.detail.value} }
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

	}

    .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-self: flex-start;
    align-self: flex-start;
    margin: 0px;
  }

  input[type="text"] {
    font-family: "Cutive Mono", monospace;
    letter-spacing: -1px;
    margin: 1em;
    height: 1.5em;
    border: none;
  }

  input[type="text"]:focus {
    outline: none;
  }

  .savebutton {
    position: absolute;
    transform: translateY(-2.5em);
    z-index: 1010;
  }

  .gcode_params {
    background-color: rgb(237, 237, 237);
    width: 26vh;
    padding-left: 1.2em;
    padding-right: 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0px;
    margin-left: 10px;
    height: 100%;
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
    font-size: 0.85em;
    letter-spacing: -1px;
    align-self: flex-start;
  }
</style>

<div class="gcodeView">
    
  <div class="gcode_params">

    <div class="title">
      <label for="title">title:</label>
      <input type="text" name="title" bind:value={$gcode.title} on:blur={saveProject}/>
    </div>

    <div class="save" style="align-self: flex-end;">
      <IconButton
        iconUrl="./assets/icons/save.png"
        on:action={saveProject}
        bind:status={saveStatus}
        tip="Save project"
        tipsuccess="Project saved"
        tiperror="error while saving, please retry" />
    </div>

    <div>
      <span>pen color</span><br />
      {#each pen_colors as color, id}
        <InputColorRadio
          id="pencolor-{id}"
          bind:group={$gcode.pen_color}
          size="12px"
          radius="50%"
          value={color} />
      {/each}
    </div>

    <div>
      <span>pen stroke <span style="font-size:0.9em;">[mm]</span> :</span><br />
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

    <div>
      <Fader
        name="pen_opacity"
        label="ink_op."
        range={{ min: 0, max: 1 }}
        step={0.01}
        value={$gcode.pen_opacity}
        on:input={handleInput} />
    </div>

    <div>
      <span>paper color</span>
      {#each paper_colors as color, id}
        <InputColorRadio
          id="papercolor-{id}"
          bind:group={$gcode.paper_color}
          size="0.7em"
          radius="0%"
          value={color} />
      {/each}
    </div>

    <div>
      <span>paper format</span>
      <select id="paper_formats" bind:value={paper_name}>
        {#each paper_formats as item, i}
          <option value={item.name}>{item.name}</option>
        {/each}
      </select>
    </div>

    <div class="surface_params_pathFeedback">
      <span>path_length: {"..."}_mm</span>
    </div>

  </div>

</div>
