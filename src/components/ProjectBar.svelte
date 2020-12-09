<script>
    import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tweened } from "svelte/motion";
    import { quintOut } from "svelte/easing";
    import { createEventDispatcher } from 'svelte'
    
	import IconButton from "./IconButton.svelte";

    export let projects
    export let currentTitle

    let showprojects = false
    
    const dispatch = createEventDispatcher()

    const easedBar = tweened( 0, {
		duration: 1500,
		easing: quintOut,
    });
    
	$: easedBar.set( showprojects*1 )

</script>


<style>

	.projects_menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
		margin: 0px;
		padding: 0px;
		background-color: white;
		height: 100%;
	}

	.button_container{
		margin: 0.12em;
		display: flex;
		justify-content: center;
	}

	.projects_list{
		padding-top: 1em;
		padding-bottom: 1em;
        overflow-y: scroll;
        justify-self: flex-start;
	}

	.projects_list>ul{
		list-style-type: none;
		padding: 0px;
		margin: 0px;
		margin-left: 1em;;
	}

	.projects_list>ul>li{
		padding: 0.2em;
		margin: 0px;
		margin-top: 1em;
		cursor:pointer;
		width:100%;
	}

	.projects_list>ul>li:hover{
		background-color: rgb(225, 225, 225);
	}

  

</style>


<div class="projects_menu">

    <div class="button_container">
        <IconButton
        iconUrl="./assets/icons/load.png"
        on:action={()=> showprojects = !showprojects}
        tip="Projects"
        size="1.7em"
        />
    </div>

    <div style="width: calc( 13vw * {$easedBar});">

        {#if showprojects}
        <div class="projects_list"
        in:fly="{{ x: -100, duration: 1000, delay: 500 }}"
        out:fly="{{ x: -100, duration: 800 }}"
        >
            <ul>
                {#each projects as p, index (p)}
                <li on:click={ ()=>dispatch('loadProject',  p.gcode.title )}
                    transition:fade
                    animate:flip="{{ delay: 1000 }}"
                > 
                    {p.gcode.title}
                </li>
                {/each}
            </ul>
        </div>
        {/if}

    </div>

    {#if showprojects}
    <div class="button_container delete"
    in:fly="{{ x: -100, duration: 1000, delay: 500 }}"
    out:fly="{{ x: -100, duration: 800 }}"
    >
        <IconButton
        iconUrl="./assets/icons/thrash.png"
        on:action={()=> { dispatch('deleteProject', currentTitle ) }}
        tip="Delete project"
        size="1.2em"
        />
    </div>
    {/if}
</div>
