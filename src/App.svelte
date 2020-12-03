<script>
	import PictureView from "./components/PictureView.svelte";
	import SurfaceView from "./components/SurfaceView.svelte";
	import GcodeView from "./components/GcodeView.svelte";
	import IconButton from "./components/IconButton.svelte";
	import { projectStore, pictureStore, surfaceStore, gcodeStore } from './stores/stores'
	import { get } from 'svelte/store';
	import { onMount } from "svelte"
	import { defaultProjects } from './configs/default.js'
	import { saveAs } from 'file-saver';	
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tweened } from "svelte/motion";
  	import { quintOut } from "svelte/easing";
	import cloneDeep from 'lodash/cloneDeep';

	let projects
	let showprojects = false
	let saveStatus = "waiting"

	// projects = localStorage.length ?
	// 				JSON.parse( localStorage.getItem( 'projects' ) )
	// 				:
	// 				{...defaultProjects};
	
	projects = cloneDeep(defaultProjects);

  	const saveProject = ()=>{
		const savedProject = cloneDeep( get(projectStore) )
		projects.projects = projects.projects.filter( p => p.gcode.title != savedProject.gcode.title )
		projects.projects.push( savedProject )
		projects.last_project_title = savedProject.gcode.title
		localStorage.setItem( 'projects', JSON.stringify( projects ) )
		saveStatus = "success"
	}
  
  	const loadProject = ( title )=>{
		let loadedProject = projects.projects.filter( p => p.gcode.title === title )[0]
		loadedProject = cloneDeep(loadedProject)
		pictureStore.tune(loadedProject.picture)
		surfaceStore.tune(loadedProject.surface)
		gcodeStore.tune(loadedProject.gcode)
	}

  	onMount( ()=>{
		loadProject( projects.last_project_title )
	} )
 
	const exportSVG = function ( message ){
		const blob = new Blob([ message.detail ], {type: "text/plain;charset=utf-8"});
		const format = $projectStore.gcode.format.name
    	saveAs(blob, $projectStore.gcode.title + "_" + format + ".svg");  
	}

	const exportPNG = function(){
		const canvas = document.querySelector("#pictureCanvas");
		canvas.toBlob(function(blob) {
    		saveAs(blob, $projectStore.gcode.title + ".png");
		})
	}

	const exportGCODE = ( message )=>{
		const blob = new Blob([ message.detail ], {type: "text/plain;charset=utf-8"});
		const format = $projectStore.gcode.format.name
		saveAs(blob, $projectStore.gcode.title + "_" + format + ".nc");
	}

	const easedBar = tweened( 0, {
		duration: 1500,
		easing: quintOut,
	});


	$: easedBar.set( showprojects*1 )

</script>

<!-- STYLE -------------------------------------------------------- -->

<style>

	.container{
		width: 100%;
		height: 100%;
	}

	header {
		margin: 0px;
		padding-top: 1em;
		padding-left: 3em;
		height: 8vh;
	}
	
	h1 {
	  font-size: 1.6em;
	  margin: 0px;
	  padding:0px;
	  font-family: "Cutive Mono", monospace;
	  letter-spacing: -3px;
	}

	main{
		width: 100%;
		height: 83vh;
		display: flex;
		flex-direction: row;
		justify-content:space-between;
	}
	
	nav {
		display: block;
		margin: 0px;
		padding: 0px;
		background-color: white;
		overflow-y: scroll;
		height: 100%;
	}

	.loadbutton_container{
		margin: 0.12em;
		display: flex;
		justify-content: center;
	}

	.projects_list{
		padding-top: 1em;
		padding-bottom: 1em;
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

	.playground {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-around;
		padding-top: 1em;
		padding-left: 3em;
		height: 100%;
		width: 100%;
		position: relative;
	}

  	footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: auto;
		padding-right: 2em;
	}

	.colophon{
		color: #bbb;
		font-size:0.9em;
	}

	.colophon>a{
		color: #bbb;
	}
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{$projectStore.gcode.title}</h1>
	</header>
	<main>

		<nav class="projects-menu">
			<div class="loadbutton_container">
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
					{#each projects.projects as p, index (p)}
					<li on:click={()=>loadProject(p.gcode.title)}
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
		</nav>

		<div class="playground">
			<PictureView on:exportPNG={exportPNG} />
			<SurfaceView on:exportSVG={exportSVG}/>
			<GcodeView bind:saveStatus={saveStatus} on:exportGCODE={exportGCODE} on:saveProject={saveProject}/>

		</div>

	</main>
	<footer>
		<p class="colophon">
		surface_projection © <a href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020
		</p>
	</footer>
</div>
