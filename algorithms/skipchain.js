// skipchain.js

"use strict";

var scene, renderer;
var controls;
var clock = new THREE.Clock();

var mapWidth = 250, mapHeight = 170;

var camera, mapCamera;

var sky, sunSphere;

var spotLight, dirLight, hemiLight;

var line;
var MAX_POINTS = 500;
var drawCount;

init();
animate();

function init() {
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog(0x492762, 10, 250);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
	camera.position.set(0, 40, 80);
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
	controls.maxPolarAngle = Math.PI/2;
	controls.maxDistance = 100;
	controls.minDistance = 10;
	// controls.autoRotate = true;

	window.addEventListener( 'resize', onWindowResize, false );

	// initHelpers();

	initSky();
    initLights();
    ground();

    draw();
}

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
	// nums = [1, 9, 5, 6, 6, 1, 8];
	// nums = [4.5, 0.5, 9, 4, 11.5, 16, 0.5, 3.5, 1.5, 17, 32.5, 17.5, 1];
	// nums = [4, 5, 3, 7, 2, 10, 5, 6, 7, 1, 2, 7, 8];
		// []
	// nums = [9, 1, 1, 9];
	shapes = []
	for (var i = 0; i < nums.length; i++){
		var g = new THREE.SphereGeometry(1, 8, 8);
		var c = new THREE.Color(nums[i]/10, nums[i]/10, nums[i]/10);
		var material = new THREE.MeshLambertMaterial( { color: c, wireframe: true });
		var temp = new THREE.Mesh(g, material);
		temp.scale.set(nums[i]/3, nums[i]/3, nums[i]/3);
		temp.position.x = i*7 - (nums.length*3);
	    temp.position.y = 3;
	    temp.position.z = 0;
	    temp.castShadow = true;
	    scene.add(temp);
	    shapes.push(temp);
	}

	skipchain(nums, shapes, nums.length);
}

function skipchain(nums, shapes, size, i) {
	var sol = [];
	var output = [];
	var k = 1;
	console.log('nums=', nums);
	for (var i = 0; i < size; i++){
		if (i == 0){
			sol[0] = nums[0];
		}
		else if (i == 1){
			if (nums[0] > nums[1]){
				sol[1] = nums[0];
				shapes[0].position.z +=10;
				output[k] = 0;
				k++;
			}
			else{
				sol[1] = nums[1];
				shapes[1].position.z +=10;
				output[k] = 0;
				k++;
			}
		}
		else{
			console.log(nums[i]);
			if (sol[i-1] > sol[i-2]+nums[i]){
				sol[i] = sol[i-1];
				if (shapes[i-2].position.z == 10){
					shapes[i-2].position.z -=10;
				}
			}
			else{
				sol[i] = sol[i-2]+nums[i];
				shapes[i].position.z += 10;
				if (shapes[i-1].position.z == 10 && shapes[i-2].position.z == 10){
				// 	// if (shapes[i-2].position.z == 10 || shapes[i].position.z == 10){
						shapes[i-1].position.z -=10;
				// 	// }
				}
			}
		}
		console.log('sol[',i,']=', sol[i]);
	}
	drawEdges(shapes);
	text(nums, shapes, sol);
}

function text(nums, shapes, sol){
	var group = new THREE.Group();
	for (var t = 0; t < nums.length; t++){
		var theText = nums[t];
		var hash = document.location.hash.substr( 1 );
		if ( hash.length !== 0 ) {
			theText = hash;
		}
		var text3d = new THREE.TextGeometry( theText, {
			size: 2,
			height: 0.3,
			curveSegments: 10,
			font: "helvetiker"

		});
		text3d.computeBoundingBox();
	var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		// var c = new THREE.Color(nums[i]/10, nums[i]/10, nums[i]/10);
		var material = new THREE.MeshFaceMaterial( [
			new THREE.MeshPhongMaterial( { color: 0x9984A8 } ),
			// new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
			new THREE.MeshPhongMaterial( { color: 0x9984A8, overdraw: 0.5 } )
		] );

		text = new THREE.Mesh( text3d, material );

		text.position.x = shapes[t].position.x + centerOffset;
		text.position.y = shapes[t].position.y + nums[t]/2;
		text.position.z = shapes[t].position.z;

		text.rotation.x = 0;
		text.rotation.y = Math.PI * 2;

		group.add( text );
	}

	scene.add( group );
}

function drawEdges(shapes){
	var geometry = new THREE.BufferGeometry();

	var positions = new Float32Array( MAX_POINTS * 3 ); 
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

	drawCount = 2*(shapes.length-1);
	geometry.setDrawRange( 0, drawCount );

	var material = new THREE.LineBasicMaterial( { color: 0xC4B8CD, linewidth: 2 } );

	line = new THREE.Line( geometry,  material );
	scene.add( line );

	updatePositions();
}

function updatePositions() {

	var positions = line.geometry.attributes.position.array;

	var index = 0;

	for ( var i = 0, l = shapes.length-1; i < l; i ++ ) {

		positions[ index ++ ] = shapes[i].position.x;
		positions[ index ++ ] = shapes[i].position.y;
		positions[ index ++ ] = shapes[i].position.z;

		positions[ index ++ ] = shapes[i+1].position.x;
		positions[ index ++ ] = shapes[i+1].position.y;
		positions[ index ++ ] = shapes[i+1].position.z;

	}

}

function ground() {
	var groundgeo = new THREE.PlaneGeometry(400, 200, 10, 10);
	var groundmat = new THREE.MeshPhongMaterial({color: 0x492762, vertexColors: THREE.VertexColors});
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
	sunLight.position.set( 500, 1000, -500 );
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
