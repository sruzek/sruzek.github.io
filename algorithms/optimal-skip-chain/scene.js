//scene.js 

"use strict";

var scene, renderer;
var controls;
var clock = new THREE.Clock();

var mapWidth = 250, mapHeight = 170;

var camera, mapCamera;

var sky, sunSphere;

var spotLight, dirLight;

init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
	camera.position.set(0, 20, 100);
	camera.lookAt(scene.position);
	scene.add(camera);

	mapCamera = new THREE.OrthographicCamera(    //camera that displays map in corner
	-50,		// Left
    50,		// Right
    35,		// Top
    -35,	// Bottom
    -5,            			// Near 
    200 );  
	mapCamera.up = new THREE.Vector3(0,0,-1);
	mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
	scene.add(mapCamera);

    renderer = new THREE.WebGLRenderer(); 
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild( renderer.domElement );
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.autoRotate = true;

	window.addEventListener( 'resize', onWindowResize, false );

	// initHelpers();

	initSky();
    initLights();
    ground();

    var g = new Graph();

    g.edgeFactory.build = function(source, target) {
		var e = new AbstractEdge();
		e.source = source;
		e.target = target;
		e.weight = Math.floor(Math.sin(Math.random()) * 10) + 1;
		return e;
    }

    g.addEdge("start", "end");
    g.addEdge("start", "second");
    g.addEdge("second", "end");
    g.addEdge("start", "middle");

    dijkstra(g, g.nodes["start"]);

    draw();
}

// function draw(g){
//     console.log(g.edges);
//     for(e in g.edges) {
//         if(g.edges[e].target.predecessor === g.edges[e].source || g.edges[e].source.predecessor === g.edges[e].target) {
//             g.edges[e].color(0xffffff);   // = "#bfa";
//             g.edges[e].color(0xffffff);     // = "#56f";
//         } else {
//             g.edges[e].color(0xfab0b5);     // = "#aaa";
//         }
//     }
// }
// 
    // var mesh = new THREE.Mesh(g, material);

// var nums = [1, 9, 5, 6, 6, 1, 8];
var nums = [];
var shapes = [];

function drand(){
	var ans = [];
	for (var x = 0; x < 13; x++){
		ans[x] = Math.floor(Math.random()*10) + 2;
	}
	return ans;
}

function draw() {
	nums = drand();
	shapes = []
	for (var i = 0; i < nums.length; i++){
		var g = new THREE.SphereGeometry(1, 8, 8);
		var c = new THREE.Color(nums[i]/10, nums[i]/10, nums[i]/10);
		var material = new THREE.MeshLambertMaterial( { color: c, wireframe: true });
		var temp = new THREE.Mesh(g, material);
		temp.scale.set(nums[i]/3, nums[i]/3, nums[i]/3);
		temp.position.x = i*6 - 35;
	    temp.position.y = 3;
	    temp.position.z = 0;
	    scene.add(temp);
	    shapes.push(temp);
	}
	skipchain(nums, shapes, nums.length);
}

function skipchain(nums, shapes, size, i) {
	var sol = [];
	var s;
	for (var i = 0; i < size; i++){
		if (i == 0){
			sol[0] = nums[0];
			shapes[0].position.z += 5;
		}
		else if (i == 1){
			s = Math.max(sol[0], nums[1]);
			console.log(sol[0], nums[1]);
			if (s == nums[1]){
				sol[1] = s;
				shapes[0].position.z -= 5;
				shapes[1].position.z += 5;
			}
		}
		else{
			console.log('made it to else');
			s = Math.max(sol[i-2]+nums[i], sol[i-1]);
			console.log(sol[i-2], nums[i], sol[i-1]);
			console.log(s);
			if (s == sol[i-2]+nums[i]){
				console.log('s == sol[i-2]+nums[i]');
				shapes[i-1].position.z -=5;
				shapes[i-2].position.z += 5;
				shapes[i].position.z += 5;
			}
			if (s == sol[i-1]){
				console.log('s == sol[i-1]');
				shapes[i-2].position.z -=5;
				shapes[i-1].position.z +=5;
			}
			sol[i] = s;

		}
	}
}



function ground() {
	var groundgeo = new THREE.PlaneGeometry(200, 100, 10, 10);
	var groundmat = new THREE.MeshPhongMaterial({color: 0x6d282a, vertexColors: THREE.VertexColors});
	var ground = new THREE.Mesh(groundgeo, groundmat);
	ground.position.y = -0.5;
	ground.material.side = THREE.DoubleSide;
	ground.rotation.x = -Math.PI/2;
	ground.recieveShadow = true;
	scene.add(ground);
}

function initLights() {

	var ambLight = new THREE.AmbientLight(0xfde4e4, 0.1);
    scene.add(ambLight);

	var sunLight = new THREE.SpotLight( 0xffffff, 0.3, 0, Math.PI/2, 1 );
	sunLight.position.set( 1000, 2000, -1000 );
	sunLight.castShadow = true;
	sunLight.shadowBias = -0.0002;
	sunLight.shadowCameraNear = 750;
	sunLight.shadowCameraFar = 4000;
	sunLight.shadowCameraFov = 30;
	sunLight.shadowCameraVisible = false;
	scene.add( sunLight );

}

function initSky() {
	sky = new THREE.Sky();
	scene.add( sky.mesh );

	// Add Sun Helper
	sunSphere = new THREE.Mesh(
		new THREE.SphereGeometry( 5000, 16, 16 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	sunSphere.position.y = -700000;

	var distance = 400000;

	var uniforms = sky.uniforms;
	uniforms.turbidity.value = 15; 			//3;
	uniforms.reileigh.value = 2;  			//0;
	uniforms.luminance.value = 1.0;  			//1.1;
	uniforms.mieCoefficient.value = 0.005;
	uniforms.mieDirectionalG.value = 0.8;   //0.28;

	var theta = Math.PI * 0.9;   //( 0.9 );     //elevation / inclination
	var phi = 2 * Math.PI * 0.25-0.5;          //( 0.1 );   //which way its facing
	                                     
	sunSphere.position.x = distance * Math.cos( phi );
	sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
	sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

	sky.uniforms.sunPosition.value.copy( sunSphere.position );
}

function initHelpers() {
	//helper to show where the ground is
	var gridHelper = new THREE.GridHelper( 200, 10 );
	gridHelper.setColors(0xffffff, 0x404040);
	scene.add( gridHelper );
}

var i = 0;
function animate() {
    requestAnimationFrame( animate );
	render();		
	update();
}

function update() {
	controls.update();
}

function render() {
	var w = window.innerWidth, h = window.innerHeight;

	renderer.setViewport( 0, 0, w, h );
	renderer.clear();
	renderer.render( scene, camera );              //240       160
	renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
	renderer.render( scene, mapCamera );

	camera.lookAt(scene.position);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
