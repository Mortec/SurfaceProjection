<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";
  import { projectStore } from './stores/stores'
  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { defaultProject, defaultProjects } from './configs/configs.js'


  let project, projects
  
  project = { ...defaultProject }
  projects = localStorage.length ?
	  			JSON.parse( localStorage.getItem( 'projects' ) )
				:
				{...defaultProjects};

  const saveProject = ()=>{
	  	console.log(project.title)
		project = {...project, ...get(projectStore) }
		console.log(project.title)
		projects.projects = projects.projects.filter( p => p.title != project.title )
		projects.projects.push( project )
		projects.last_project_title = project.title
		localStorage.setItem( 'projects', JSON.stringify( projects ) )
	  	// console.log( "save : ", project.title, JSON.parse( localStorage.getItem( 'projects' ) ) )
	}
  
  const loadProject = ( title )=>{
	  const loadedProject = projects.projects.filter( p => p.title === title )[0]
	  project = { ...project, ...loadedProject }
	//   console.log( "load : ", project )
	}

  onMount( ()=>{

	  loadProject( projects.last_project_title )
	} )
 



</script>

<!-- STYLE -------------------------------------------------------- -->

<style>

	.container{
		width: 100%;
		height: 100%;
	}

	header {
		margin: none;
		padding-top: 1em;
		padding-left: 3em;
		height: 8vh;
	}
	
	h1 {
	  font-size: 1.5em;
	  margin: none;
	  padding:none;
	}

	main{
		width: 100%;
		height: 83vh;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;

	}
	
	nav {
		display: block;
		width: 12vw;
		margin: none;
		padding: none;
	}


	.playground {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-around;
		padding-top: 1em;
		padding-left: 1em;

		height: 100%;
		width: 100%
		
	}

  	footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: auto;
		padding-right: 2em;
	}


	.gcode {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: none;
		padding: none;
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
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{project.title}</h1>
	</header>
	<main>

		<nav>
			<IconButton iconUrl="./assets/icons/load.png"
			/>
			<div class="projects_list">
				<ul>
				{#each projects.projects as p}
				<li on:dblclick={()=>loadProject(p.title)}> {p.title} </li>
				{/each}
				</ul>
			</div>
		</nav>

		<div class="playground">
			<PictureView params={project.picture}/>
			<SurfaceView params={project.surface}/>

			<!-- style="align-self: flex-end; height: calc(100vh/400 * 279);"> -->
			<div class="gcode"> 
				<label for="title">title:</label>
				<input type="text" name="title" bind:value={project.title} />
			</div>

			<div class="save" style="align-self: flex-start;" >
				<IconButton iconUrl="./assets/icons/save.png"
				on:action={saveProject}
				/>	

			</div>
		</div>

	</main>
	<footer>
		<p style="color: #bbb">surface_projection © <a style="color: #bbb" href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020</p>
	</footer>
</div>
