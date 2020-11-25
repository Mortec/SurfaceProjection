<script>
    import { createEventDispatcher } from 'svelte';
    import {fade} from 'svelte/transition'

    export let iconUrl = "./assets/icons/save.png";  
    export let tip = "This button has an action";
    export let tipsuccess = "This button has an action that was successful";
    export let tiperror = "This button has an action that failed";
    export let size = "1.4em";
    export let status = "waiting";
    export let tipPosition = "left";
    export let opacity = 0.7;
    const dispatch = createEventDispatcher();
    const action = () => {  dispatch('action') };

    let showtip = false;
    let tiprequest=true;
</script>

<!-- STYLE -------------------------------------------------------- -->
<style>
  .IconButton {
    margin: 0.6em;
    display: inline-block;
    padding: none;
  }

  button {
    border: none;
    text-align: center;
    text-decoration: none;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(180, 180, 180, 180);
    padding: 0px;
    /* background-color: transparent; */
    cursor: pointer;
  }

  button:hover {
      filter: invert(1) opacity(0.4)
  }
  button:active {
      filter: invert(1)
  }

  button>img{
      width:100%;
      height: 100%;
      margin: none;
      padding: none;
      display: block;
  }

    span.tooltip {
      line-height: 0.5em;
      padding: 0.25em;
      font-size: 0.9em;
      text-align: center;
      color: black;
      background: rgb(255, 255, 255);
      border: 4px solid rgb(255, 255, 255);
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 2px 0px;
      position: absolute;
      z-index: 10;
      transform: translateY(-130%) translateX(-35%);
      width: 6em;
}

</style>

<!-- pseudoHTML -------------------------------------------------------- -->
<!-- http://csstooltip.com/ -->
<div class="IconButton"
    style= "width:{size}; height:{size}; opacity: {opacity}"

>
            {#if showtip}
            <span class="tooltip"
                transition:fade="{{duration:3000}}"
                on:introend="{() => showtip = false}"
            >
            {tip}
            </span>
            {/if}

            {#if status==='success'}
            <span class="tooltip" transition:fade="{{duration:1000}}"
            on:introend="{() => status = 'waiting'}"
            >
            {tipsuccess} 
            </span>
            {/if}

            {#if status==='error'}
            <span class="tooltip" transition:fade="{{duration:3000}}"
            on:introend="{() => status = 'waiting'}"
            >
            {tiperror}
            </span>
            {/if}

            <button type="submit"
                on:click={action}
                on:mouseover="{( ) => tiprequest = true}"
                on:mouseleave="{( ) => tiprequest = false}"
                on:mouseenter="{() =>
                    setTimeout( ()=>{ if (tiprequest) showtip=true }, 5000)
                }"
            >
            <img src={iconUrl} alt={tip}/>
            </button>
    
</div>
