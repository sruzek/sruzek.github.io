// merge.js
// graphical representation of the merge sort algorithm
// color palette: http://paletton.com/#uid=3000t0kcbnL4n-Z88slfRjQktg6
// S(n) = O(n)
// T(n) = O(nlogn)

var scene, camera, renderer, controls;

function skybox(){
	var skygeo = new THREE.CubeGeometry( 2500, 2500, 2500 );
	var cubeMaterials = [
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "../images/cotton_candy/cottoncandy_ft.tga" ), side: THREE.DoubleSide }), //front side
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_bk.png' ), side: THREE.DoubleSide }), //back side
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_up.png' ), side: THREE.DoubleSide }), //up side
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_dn.png' ), side: THREE.DoubleSide }), //down side
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_rt.png' ), side: THREE.DoubleSide }), //right side
	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_lf.png' ), side: THREE.DoubleSide }) //left side
	];

	var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
	var cube = new THREE.Mesh( skygeo, cubeMaterial );
	scene.add( cube );
}

function init(){
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xBD7575, 1, 500 );

	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.y = 5;
	camera.position.z = 25;
	camera.lookAt(new THREE.Vector3(-1, 1000, 0));
	// updateCameraProjection();

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	var canvas = renderer.domElement;
	document.body.appendChild(canvas);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI/2;
	// controls.center.set(400, 20, 0);
	// controls.maxDistance = 100;

	window.addEventListener( 'resize', onWindowResize, false );

	var groundMaterial = new THREE.MeshLambertMaterial( {
		color: 0x7A934A
	} );

	var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );

	var ground = new THREE.Mesh( planeGeometry, groundMaterial );
	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 100, 100, 100 );
	ground.receiveShadow = true;
	scene.add( ground );

	ambientLight = new THREE.AmbientLight( 0xffdcdc );
	scene.add( ambientLight );

	skybox();
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
update();

