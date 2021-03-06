<script>
	import ProjectBar from "./components/ProjectBar.svelte"
	import PictureView from "./components/PictureView.svelte";
	import SurfaceView from "./components/SurfaceView.svelte";
	import GcodeView from "./components/GcodeView.svelte";
	import { defaultProjects } from './configs/default.js'
	import { projectStore, pictureStore, surfaceStore, gcodeStore } from './stores/stores'
	import { get } from 'svelte/store';
	import { onMount } from "svelte"
	import { saveAs } from 'file-saver';	
	import cloneDeep from 'lodash/cloneDeep';

	let projects
	let saveStatus = "waiting"

	projects = localStorage.length ?
					JSON.parse( localStorage.getItem( 'projects' ) )
					:
					cloneDeep(defaultProjects);
	
	projects = (projects.projects.length === 0) ? 
					cloneDeep(defaultProjects)
					:
					projects;

	// projects = cloneDeep(defaultProjects);

  	const saveProject = ()=>{
		const savedProject = cloneDeep( get(projectStore) )
		projects.projects = projects.projects.filter( p => p.gcode.title != savedProject.gcode.title )
		projects.projects.push( savedProject )
		projects.last_project_title = savedProject.gcode.title
		localStorage.setItem( 'projects', JSON.stringify( projects ) )
		saveStatus = "success"
	}
  
  	const loadProject = ( title ) => {
		let loadedProject = projects.projects.filter( p => p.gcode.title === title )[0]
		loadedProject = cloneDeep(loadedProject)
		pictureStore.tune(loadedProject.picture)
		surfaceStore.tune(loadedProject.surface)
		gcodeStore.tune(loadedProject.gcode)
	}

	const deleteProject = ( title ) => {
		projects.projects = projects.projects.filter( p => p.gcode.title != title )
		localStorage.setItem( 'projects', JSON.stringify( projects ) )
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

	.nav{
		height: 100%;
	}
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{$projectStore.gcode.title}</h1>
	</header>
	<main>

		<nav class="projects">
			<ProjectBar
			currentTitle={$projectStore.gcode.title}
			projects={projects.projects}
			on:loadProject={ e => loadProject(e.detail) }
			on:deleteProject={ e => deleteProject(e.detail) }
			/>
		</nav>

		<section class="playground">
			<PictureView on:exportPNG={exportPNG} />
			<SurfaceView on:exportSVG={exportSVG}/>
			<GcodeView bind:saveStatus={saveStatus} on:exportGCODE={exportGCODE} on:saveProject={saveProject}/>

		</section>

	</main>
	<footer>
		<p class="colophon">
		surface_projection © <a href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020
		</p>
	</footer>
</div>
