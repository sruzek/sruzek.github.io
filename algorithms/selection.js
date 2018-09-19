//selection sort algorithm
//color palette: http://paletton.com/#uid=63k0u0kgjbwajlybWfNl99zqk6E
// T(n) = O(n²)
// S(n) = O(1)

var objectCount = 15;
var columnOffset = 0.5;
var objectSize = 0.5;
var orbitSensitivity = 0.01;
var orbitSpeed = 10;

var speedSelect = document.getElementById("speed-select");
var sortButton = document.getElementById("sort-button");
var repeatSelect = document.getElementById("repeat-select");

var animationSpeed = speedSelect.selectedIndex + 1;

var scene;
var animator = null;
var camera = null;
var cameraPivot = null;
var renderer = null;
var clock = new THREE.Clock(true);
var commands = null;
var animationStarted = false;
var sort = null;
var controls;
var objects = [];
var marker;
var repeating = false;
var time = 0;

var result;

var pointLight, pointLight2;

function swapAndGetCommand(seq, i, j, path) {
	var result = {
		first: seq[i],
		second: seq[j],
		path: path
	};
	var tmp = seq[i];
	seq[i] = seq[j];
	seq[j] = tmp;
	return result;
}

function selectionSort(seq) {
	var result = [];
	var path = [];
	for (var i = 0; i < seq.length - 1; ++i) {
		var minElIdx = i;
		for (var j = i + 1; j < seq.length; ++j) {
			if (seq[j].value < seq[minElIdx].value){
				minElIdx = j;
				path = [];
				for (var k = i+1; k < minElIdx; ++k) {
					path.push(seq[k]);
				}
			}
		}
		if (minElIdx !== i){
			result.push(swapAndGetCommand(seq, i, minElIdx, path));
		}
	}
	return result;
}

function RotatingAnimator(first, second, path) {
	this.done = false;
	this.pathColored = false;

	var speedMultiplier = 2;
	var firstObj = first.obj;
	var secondObj = second.obj;
	var totalAngle = 0;
	var pivot = new THREE.Object3D();
	pivot.position.x = firstObj.position.x + (secondObj.position.x - firstObj.position.x) / 2;
	pivot.updateMatrixWorld();
	scene.add(pivot);

	THREE.SceneUtils.attach(firstObj, scene, pivot);
	THREE.SceneUtils.attach(secondObj, scene, pivot);

	this.animate = function (dt) {
		if (this.done)
			return;
		// move the marker along the line if there are more
		if (!this.pathColored)
			// numbers in the path
			marker.translateX(dt*animationSpeed);

		//set the first number in the path to red
		firstObj.material.color.setHex(0xff0000);

		//if the numbers need to swap, i.e there is no path
		if (path.length == 0)
			this.pathColored = true;

		//need to color the path if its not just a swap
		else {
			for (var i=0; i<path.length; i++){
				if (marker.position.x >= path[i].obj.position.x + 1){
					path[i].obj.material.color.setHex(0xff0000);
				}										//hex num for red apparently
				if (path[path.length-1].obj.material.color.getHex() == 16711680){
					this.pathColored = true;
				}
			}
		}

		if (this.pathColored){   //want to start the rotation of the two objects to swap
			secondObj.material.color.setHex(0xff0000);
			marker.position.setX(secondObj.position.x);  //move the marker back to the beginning

			var angle = dt * animationSpeed * speedMultiplier;

			if (totalAngle + angle >= Math.PI) {   //if they have swapped completely
				angle = Math.PI - totalAngle;
				this.done = true;      //the swapping is done, move to next pair
			}

			pivot.rotateY(angle);
			firstObj.rotateY(angle);
			secondObj.rotateY(angle);
			totalAngle += angle;
			pivot.updateMatrixWorld();

		}

		if (this.done) {
			this.pathColored = false;

			THREE.SceneUtils.detach(firstObj, pivot, scene);
			THREE.SceneUtils.detach(secondObj, pivot, scene);
			scene.remove(pivot);


			for (var i = 0; i < objects.length; i++){   //reset the red objects back to their
				var iObj = objects[i].obj;				//  original greyscale colors
				var iVal = objects[i].value;
				var tmp = new THREE.Color(iVal/objectCount, iVal/objectCount, iVal/objectCount);
				iObj.material.color.setHex(tmp.getHex());
			}
			marker.position.setX(secondObj.position.x);  //move the marker back to the start
		}
	}
}

function generateRandomIntegers(count) {
	var used = {};
	var values = [];
	function tryAdjust(v) {
		for (var j = 0; ; j += 1) {
			var right = v + j;
			var left = v - j;
			if (right <= count && !(right in used))
				return right;
			else if (left >= 1 && !(left in used))
				return left;
			else if (left <= 1 && right >= count)
				return null;
		}
	}
	while (values.length < count) {
		var val = tryAdjust(Math.floor(Math.random() * count) + 1);
		if (!val)
			break;
		used[val] = true;
		values.push(val);
	}
	return values;
}

function createObjectSequence(materialFactory) {
	var ints = generateRandomIntegers(objectCount);
	var geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8, 1); // new THREE.SphereGeometry(0.1, 16, 16);
	var x = -Math.floor(ints.length / 2) * (columnOffset + objectSize);

	result = [];
	for (var i = 0; i < ints.length; ++i) {
		var value = ints[i];
		var material = materialFactory(ints[i]);
		var box = new THREE.Mesh(geometry, material);
		box.scale.setY(value/10*2);
		box.position.x = x;
		box.position.setY(box.position.y + value/10*2);
		box.name = i;
		box.castShadow = true;
		box.receiveShadow = true;

		var theText = value;
		var hash = document.location.hash.substr( 1 );
		if ( hash.length !== 0 ) {
			theText = hash;
		}
		var text3d = new THREE.TextGeometry( theText, {
			size: 0.3,
			height: 0.05,
			curveSegments: 10,
			font: "helvetiker"

		});
		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var material = new THREE.MeshFaceMaterial( [
			new THREE.MeshPhongMaterial( { color: 0x9984A8 } ),
			new THREE.MeshPhongMaterial( { color: 0x9984A8, overdraw: 0.2 } )
		] );
		text = new THREE.Mesh( text3d, material );
		text.position.x = -0.1;  //firstBox.position.x + centerOffset;
		text.position.y = 2;
		text.rotation.y = Math.PI * 2;
		var textScale = (objectCount - value)/2 + 1;
		// text.scale.setY(textScale);
		// box.add(text);

		result.push({ id: i, obj: box, value: value });
		objects.push({ obj: box, value: value });
		scene.add(box);
		x += columnOffset + objectSize;
	}
	var tmpGeo = new THREE.SphereGeometry(0.001, 8, 8);
	var tmpMat = new THREE.MeshPhongMaterial({color: 0x00ff00});
	marker = new THREE.Mesh(tmpGeo, tmpMat);
	marker.position.setX(objects[0].obj.position.x);
	marker.position.setY(3);
	scene.add(marker);

	return result;
}

function createObjectMaterial(num) {
	var c = new THREE.Color(num/objectCount, num/objectCount, num/objectCount);
	material = new THREE.MeshPhongMaterial( { color: c, specular: 0xffffff, metal: false });
	return material;
}

function updateCameraProjection() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function set() {
	scene.add(cameraPivot);
	animationStarted = false;
	animator = null;
	var seq = createObjectSequence(createObjectMaterial);
	marker.position.setX(-7);
	commands = sort(seq);
	if (repeating)
		animationStarted = true;
}

function reset(dt) {
	//loop to rotate all of the numbers
	for (var num = 0; num < objectCount; num++){
		var tempobj = scene.getObjectByName(num);
		//turn all numbers same color
		tempobj.material.color.setHex(0xfde4e4);
		//rotate
		tempobj.rotation.y += dt * animationSpeed/2;
		time = time + dt;
		//after you're done spinning
		if (time > 50 - (animationSpeed*2) ){
			for (var num = 0; num < objectCount; num++) {
				var tempobj = scene.getObjectByName(num);
				//remove all of the numbers to reset with new ones
				scene.remove(tempobj);
			}
			time = 0;
			set();
		}
	}
}

//this function is from threejs.org/examples/webgl_shadowmap_pointlight.html
function createLight(color) {
	var pointLight = new THREE.PointLight( color, 1, 30 );
	pointLight.castShadow = true;
	pointLight.shadow.camera.near = 1;
	pointLight.shadowCameraFar = 30;
	// pointLight.shadowCameraVisible = true;
	pointLight.shadowMapWidth = 2048;
	pointLight.shadowMapHeight = 1024;
	pointLight.shadowBias = 0.01;
	pointLight.shadowDarkness = 0.5;

	var geometry = new THREE.SphereGeometry( 0.003, 32, 32 );
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var sphere = new THREE.Mesh( geometry, material );
	pointLight.add( sphere );

	return pointLight;
}

function init() {
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0x476768, 1, 500 );

	camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
	camera.position.y = 10;
	camera.position.z = 25;
	camera.lookAt(new THREE.Vector3(-1, 0, 0));
	updateCameraProjection();

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
	controls.maxDistance = 100;

	//------skybox---------
 //    var urlPrefix = "../images/skyboxByDad/";
 //    urls = [
	//     	urlPrefix + "grassywater-W.png",
	//     	urlPrefix + "grassywater-E.png",
	// 	    urlPrefix + "grassywater-U.png",
	// 	    urlPrefix + "grassywater-D.png",
	// 	    urlPrefix + "grassywater-S.png",
	// 	    urlPrefix + "grassywater-N.png"
	//     ];
	// var textureCube	= new THREE.CubeTextureLoader().load( urls );
	// shader	= THREE.ShaderLib['cube'],
	// uniforms = THREE.UniformsUtils.clone(shader.uniforms);
	// uniforms['tCube'].value = textureCube;
	// var material = new THREE.ShaderMaterial({
	// 	fragmentShader	: shader.fragmentShader,
	//  	vertexShader	: shader.vertexShader,
	//  	uniforms	: uniforms,
	//  	depthWrite: false,
	//  	side: THREE.BackSide
	// }),
	// skyboxMesh	= new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000), material );
	// scene.add( skyboxMesh );
	//-------------------------------------------------------------------------------

	//------------ ground and walls ---------------------------------
	var groundgeo = new THREE.PlaneGeometry(300, 300, 1, 1);
	var groundmat = new THREE.MeshPhongMaterial({color: 0x102C2E, vertexColors: THREE.VertexColors});
	var ground = new THREE.Mesh(groundgeo, groundmat);
	ground.position.z = 5;
	ground.material.side = THREE.DoubleSide;
	ground.rotation.x = -Math.PI/2;
	ground.receiveShadow = true;
	scene.add(ground);

	var wallgeo = new THREE.PlaneGeometry(30, 20, 1, 1);
	var leftwall = new THREE.Mesh(wallgeo, groundmat);
	leftwall.rotation.y = Math.PI/2;
	leftwall.position.x = -15;
	leftwall.position.y = 10;
	leftwall.position.z = 5;
	// leftwall.material.side = THREE.FrontSide;
	scene.add(leftwall);

	var rightwall = leftwall.clone();
	rightwall.position.x = 15;
	// rightwall.material.side = THREE.BackSide;
	scene.add(rightwall);

	var backWall = new THREE.Shape();
	backWall.moveTo(-15, 0);
	backWall.lineTo(-15, 20);
	backWall.lineTo(-5, 20);
	backWall.lineTo(-5, 0);

    var geo = new THREE.ShapeGeometry(backWall);
    var dWall = new THREE.Mesh(geo, groundmat);
    dWall.position.z = -10;
    scene.add(dWall);

    var dWallR = dWall.clone();
    dWallR.position.x = 20;
    scene.add(dWallR);

    var backWallT = new THREE.Shape();
    backWallT.moveTo(-5, 10);
    backWallT.lineTo(-5, 7);
    backWallT.lineTo(5, 7);
    backWallT.lineTo(5, 10);

    var geoT = new THREE.ShapeGeometry(backWallT);
    var TdWall = new THREE.Mesh(geoT, groundmat);
    TdWall.position.z = -10;
    scene.add(TdWall);

    var TdWallB = TdWall.clone();
    TdWallB.position.y = -7;
    scene.add(TdWallB);

    var TdWallB2 = TdWall.clone()
    TdWallB2.position.y = 10;
    scene.add(TdWallB2);
    //-------------------------------------------------------------------------------


	var ambLight2 = new THREE.AmbientLight(0xac8e74);
	scene.add(ambLight2);

	var sphere = new THREE.SphereGeometry(0.2, 16, 8 );
	var sunLight = new THREE.DirectionalLight( 0xffffff, 1 );  // , 1.5, 0, Math.PI/2, 1 );
	sunLight.castShadow = true;
	sunLight.shadow.camera.left = -20; // CHANGED
	sunLight.shadow.camera.right = 20; // CHANGED
	sunLight.shadow.camera.top = 20; // CHANGED
	sunLight.shadowCameraBottom = -20; // CHANGED
	sunLight.position.set( 2.5, 4, 2 );
	// sunLight.shadowBias = -0.0002;
	sunLight.shadow.camera.near = 75;
	sunLight.shadowCameraFar = 4000;
	sunLight.shadow.camera.fov = 500;
	// sunLight.shadowCameraVisible = true;
	// sunLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
	// scene.add( sunLight );
	// scene.add(new THREE.DirectionalLightHelper(sunLight, 1));

	pointLight = createLight( 0x22293E );
	pointLight.position.set(-5, 5, -5);
	scene.add( pointLight );

	pointLight2 = createLight( 0x234727 );
	pointLight2.position.set(5, 5, 5);
	scene.add( pointLight2 );

	cameraPivot = new THREE.Object3D();
	cameraPivot.position.x = -0.5;
	cameraPivot.position.y = 1;
	cameraPivot.add(camera);

	sort = selectionSort;

	set();

	sortButton.addEventListener("click", function () {
		animationStarted = true;
	});

	speedSelect.addEventListener("change", function () {
		animationSpeed = this.selectedIndex + 1;
	});

	repeatSelect.addEventListener("change", function () {
		if (this.selectedIndex == 0)
			repeating = false;
		if (this.selectedIndex == 1)
			repeating = true
	});

	window.addEventListener("resize", function () {
		renderer.setSize(window.innerWidth, window.innerHeight);
		updateCameraProjection();
	});
}

function update() {
	requestAnimationFrame(update);

	controls.update();

	var dt = clock.getDelta();

	if (animator)
		animator.animate(dt);

	renderer.render(scene, camera);

	if (animator && animator.done)
		animator = null;

	if (animationStarted && !animator && commands.length > 0) {
		var cmd = commands.splice(0, 1)[0];
		animator = new RotatingAnimator(cmd.first, cmd.second, cmd.path);
	}
	//the nums are sorted
	if (animationStarted && !animator && commands.length == 0){
		//spinny celebration then reset to a different random number sequence
		reset(dt);
	}
}

init();
update();

