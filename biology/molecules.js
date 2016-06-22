//molecules.js
//graphics visualization of water molecules and hydrogen bonds

var sceneSelect = document.getElementById("scene-select");

var scene, camera, renderer, controls;
var clock = new THREE.Clock(true);

var sunLight, pointLight, ambientLight;

var texloader = new THREE.TextureLoader();

var oxygen, hydrogen1, hydrogen2, molecule;
var molecules = [];

var degreesToRadians = 3.14159265 / 180.0;

var angle = 0;
var waterMoleculeSelected = true;
var hydrogenBondsSelected = false;
var waterSelected = false;

function minimum(a, b) {
	if (a < b)
		return a;
	else
		return b;
}

function toGlobalCoords(obj) {
	var globalPos = new THREE.Vector3();
	globalPos.setFromMatrixPosition(obj.matrixWorld);
	return globalPos;
}

function minDistOtoH(pos, val) {
	var minDist;
	var returnObj;
	minDist = Infinity;

	for (var i = 0; i < molecules.length; i++){

		var h1Pos = toGlobalCoords(molecules[i].h1);
		var h2Pos = toGlobalCoords(molecules[i].h2);

		if (i != val ){
			var tmpDist = minimum(dist(pos, h1Pos), dist(pos, h2Pos));
			if (tmpDist == dist(pos, h1Pos)){
				if (tmpDist < minDist && !molecules[i].obj.children[1].bonded){
					minDist = tmpDist;
					returnObj = molecules[i].h1;
					// molecules[i].obj.children[1].bonded = true;
				}
			}
			else if (tmpDist == dist(pos, h2Pos)){
				if (tmpDist < minDist && !molecules[i].obj.children[2].bonded){
					minDist = tmpDist;
					returnObj = molecules[i].h2;
					molecules[i].obj.children[2].bonded = true;
				}
			}
		}
	}
	return returnObj;
}

var bonds = [];
function hydrogenBonds() {

	for (var i = 0; i < molecules.length; i++){
		var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
		var lineGeometry = new THREE.Geometry();

		 //get the global position of each oxygen atom instead of local
		var oPos = toGlobalCoords(molecules[i].o);

		var closest = minDistOtoH(oPos, i);

		if (closest){
			var cPos = toGlobalCoords(closest);
			lineGeometry.vertices.push(oPos, cPos);
		}

		var line = new THREE.Line(lineGeometry, lineMaterial);
		bonds.push({ fromObj: molecules[i].o, toObj: closest, line: line });
		scene.add(line);
	}
	console.log(bonds);
}

function dist(t0, t1){
	var deltaX = t1.x - t0.x;
	var deltaY = t1.y - t0.y;
	var deltaZ = t1.z - t0.z;

	var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

	return distance;
}

function moleculesInit() {

	var circlegeo = new THREE.SphereGeometry(500, 6, 2);
	var xf = 0;
	var yf = 200;
	var zf = 0;

	for (var k = 0; k < 2; k++){
		//making single layer
		for (var j = 0; j < 3; j++){
			for (var i = 8; i < circlegeo.vertices.length - 7; i++){
				var temp = molecule.clone();
				temp.position.set(circlegeo.vertices[i].x+xf, circlegeo.vertices[i].y+yf+(50*Math.random()), circlegeo.vertices[i].z+zf+(50*Math.random()));
				temp.rotation.set(Math.random()-Math.random(), Math.random()-Math.random(), Math.random()-Math.random());

				temp.updateMatrixWorld();      //get the positions of the individual atoms
				var oPos = toGlobalCoords(temp.children[0]);
				var h1Pos = toGlobalCoords(temp.children[1]);
				var h2Pos = toGlobalCoords(temp.children[2]);
				molecules.push({ obj: temp, o: temp.children[0], h1: temp.children[1], h2: temp.children[2] });
				scene.add(temp);
			}
			xf += 500;
			zf += 300;
		}
		yf += 200;
		xf -= 1400;
		zf -= 1000;
	}

	console.log(molecules);

	hydrogenBonds();

}

function addAtom(color, size, x, y, z, texture) {
	var atomGeo = new THREE.SphereGeometry(size, 32, 32);
	if (texture) {
		var tex = texloader.load(texture);
		tex.repeat.set(4, 1);
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		var atomMat = new THREE.MeshLambertMaterial({color: color, map:tex});
	}
	else
		var atomMat = new THREE.MeshLambertMaterial({color: color});
	var atom = new THREE.Mesh(atomGeo, atomMat);
	atom.castShadow = true;
	atom.position.set(x, y, z);

	return atom;
}

function removeAll() {
	for (var i=0; i < molecules.length; i++)
		scene.remove(molecules[i].obj);
	for (var j = 0; j < bonds.length; j++)
		scene.remove(bonds[j].line);
	molecules = [];
	bonds = [];
}

function moleculeInit() {
	oxygen = addAtom(0xff0000, 40, 0, 0, 0);
	oxygen.name = "oxygen";
	oxygen.bonded = false;
	// oxygen.bonds = [];
	hydrogen1 = addAtom(0x0000ff, 30, -35, 20, 0);
	hydrogen1.name = "hydrogen1";
	hydrogen1.bonded = false;
	hydrogen2 = addAtom(0x0000ff, 30, 35, 20, 0);
	hydrogen2.bonded = false;
	hydrogen2.name = "hydrogen2";

	molecule = new THREE.Object3D();
	molecule.add(oxygen);
	molecule.add(hydrogen1);
	molecule.add(hydrogen2);
	molecule.position.setY(200);
	molecule.updateMatrixWorld();

	//get the positions of the individual atoms
	var oPos = toGlobalCoords(molecule.children[0]);
	var h1Pos = toGlobalCoords(molecule.children[1]);
	var h2Pos = toGlobalCoords(molecule.children[2]);
	molecules.push({ obj: molecule, o: molecule.children[0], h1: molecule.children[1], h2: molecule.children[2] });
	scene.add(molecule);

	if (hydrogenBondsSelected || waterSelected)
		moleculesInit();
}

function init() {
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 100000);
	camera.position.set( 0, 1000, 2500 );
	camera.lookAt(scene.position);
	scene.add(camera);


	renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.center.set(500, 200, 0);

	window.addEventListener( 'resize', onWindowResize, false );

	var groundMaterial = new THREE.MeshPhongMaterial( {
		shininess: 80,
		color: 0xffffff,
		specular: 0xffffff
	} );

	var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );

	var ground = new THREE.Mesh( planeGeometry, groundMaterial );
	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 1000, 1000, 1000 );
	ground.receiveShadow = true;
	scene.add( ground );


	var sunIntensity = 0.3,
		pointIntensity = 1,
		pointColor = 0xffaa00;
	ambientLight = new THREE.AmbientLight( 0x3f2806 );
	scene.add( ambientLight );

	sunLight = new THREE.SpotLight( 0xffffff, sunIntensity, 0, Math.PI/2, 1 );
	sunLight.position.set( 1000, 2000, 1000 );

	sunLight.castShadow = true;

	sunLight.shadowBias = -0.0002;

	sunLight.shadowCameraNear = 750;
	sunLight.shadowCameraFar = 4000;
	sunLight.shadowCameraFov = 600;

	scene.add( sunLight );

	sceneSelect.addEventListener("change", function () {
		if (this.selectedIndex == 0){
			waterMoleculeSelected = true;
			hydrogenBondsSelected = false;
			waterSelected = false;
			removeAll();
			moleculeInit();
		}
		if (this.selectedIndex == 1){
			hydrogenBondsSelected = true;
			waterSelected = false;
			if (waterMoleculeSelected){
				removeAll();
				moleculeInit();
			}
			waterMoleculeSelected = false;
		}
		if (this.selectedIndex == 2){
			waterSelected = true;
			if (waterMoleculeSelected){
				removeAll();
				moleculeInit();
			}
			waterMoleculeSelected = false;
			hydrogenBondsSelected = false;
		}
	});

	moleculeInit();
}

function update() {
	requestAnimationFrame(update);

	if (waterSelected){
		for (var i = 0; i < molecules.length; i++){
			var tPos = toGlobalCoords(molecule.children[0]);
			if (i%2 == 0){
				molecules[i].obj.position.x += Math.cos(angle*degreesToRadians*3.5)*(15*Math.random());
				molecules[i].obj.position.y += Math.cos(angle*degreesToRadians);
				molecules[i].obj.position.z += Math.sin(angle*degreesToRadians*2.5)*(15*Math.random());
			}
			if (i%2 == 1){
				molecules[i].obj.position.x += Math.sin(angle*degreesToRadians*1.7)*(10*Math.random());
				molecules[i].obj.position.y += Math.sin(angle*degreesToRadians);
				molecules[i].obj.position.z += Math.cos(angle*degreesToRadians*1.3)*(10*Math.random());
			}
				molecules[i].obj.updateMatrixWorld();
			angle+=0.1;
			if (angle == 180)
				angle -= 360;
		}
		for (var i = 0; i < bonds.length; i++){
			bonds[i].line.geometry.verticesNeedUpdate = true;
			var bPos = toGlobalCoords(bonds[i].fromObj);
			var b2Pos = toGlobalCoords(bonds[i].toObj);
			bonds[i].line.geometry.vertices[0] = bPos;
			bonds[i].line.geometry.vertices[1] = b2Pos;
			if (dist(bPos, b2Pos) > 300){
				var btemp = minDistOtoH(bPos, i);
				var tempLoc = toGlobalCoords(btemp);
				if (tempLoc){
					bonds[i].line.geometry.vertices[0] = tempLoc;
					bonds[i].toObj.bonded = false;
				}
			}
		}
	}

	controls.update();

	renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
update();
