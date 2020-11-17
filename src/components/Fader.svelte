<script>
    import { createEventDispatcher } from 'svelte';
 
    export let id = Date.now() + Math.random();
    export let label = "fadr" //name as it appear in the ui
    export let name = "fader" ///programmatic name
    export let value = "0.5"
    export let range = {min: 0.0, max: 1.0}
    export let step = 0.01
    
    const dispatch = createEventDispatcher();

    $: dispatch( 'input', { name: name, value: value } )


</script>

<!-- STYLE -------------------------------------------------------- -->
<style>

   .fader{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin: 0.5em 0.5em 0.5em 1em;
   }

  input {
    border: none;
    padding: 0px 0px 0px 0px;
    background-color: transparent;
  }

  input[type="number"] {
    text-align: center;
    border-radius: 0px;
    font-size: 0.9em;
    width: 30%;
    margin: 0em 0em 0em 0.5em;
  }

  input[type="number"]:focus{
    outline: none;
  }

  label{
      margin: 0em 0.5em 0.25em 0em
  }

  label > span {
    text-align: center;
    /* width: 4em; */
    padding: 0;
  }

  /* https://www.cssportal.com/style-input-range/ */
  input[type="range"] {
    height: 12px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 1px #000000;
    background: #c9c9c9;
    border-radius: 2px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #b1c8e3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -2px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #c9c9c9;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 1px #000000;
    background: #c9c9c9;
    border-radius: 2px;
    border: 0px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #b1c8e3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #c9c9c9;
    border: 0px solid #000000;
    border-radius: 4px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type="range"]::-ms-fill-upper {
    background: #c9c9c9;
    border: 0px solid #000000;
    border-radius: 4px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #b1c8e3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #c9c9c9;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #c9c9c9;
  }
</style>



<!-- pseudoHTML -------------------------------------------------------- -->

<div class="fader" {id}>
  <label for={name}><span>{label}</span></label>
  <input type="range" name={name} bind:value={value} min={range.min} max={range.max} {step}/>
  <input type="number" name={name} bind:value={value} min={range.min} max={range.max} {step} />
</div>
