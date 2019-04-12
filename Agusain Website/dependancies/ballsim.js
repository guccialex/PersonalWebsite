
var world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
//world.broadphase = new CANNON.NaiveBroadphase();

/*
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape
    });
    groundBody.position.set(0, 0, 0)
    groundBody.quaternion.setFromEuler(0, 0, Math.PI / 2);
    world.add(groundBody);
*/




var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

//turn on shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


document.body.appendChild(renderer.domElement);

var ambientlight = new THREE.AmbientLight(0xf2f2f2, 0.8);
scene.add(ambientlight)



var light = new THREE.PointLight(0xffffff, 1.2);
light.castShadow = true
scene.add(light)
light.position.set(0, 35, 15)



function myaddsphere(posx, posy, posz, radius, mass, shapeormesh) {
  //'''wrapper by alex''' because I don't fuckign get how they integrate them together
  // and what the fuck is quaternion, wait i know now
  // but i still need this because it doesnt do what I want it to do

  if (shapeormesh == 0) {
    //adding it to cannon
    var sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({
      mass: mass,
      shape: sphereShape
    });
    sphereBody.position.set(posx, posy, posz);
    world.add(sphereBody);


    //adding it to three
    var geometry = new THREE.SphereGeometry(radius, 15, 15);
    var material = new THREE.MeshLambertMaterial({
      color: 0x222222,
    });
    var middle = new THREE.Mesh(geometry, material);
    middle.position.x = posx
    middle.position.y = posy
    middle.position.z = posz
    scene.add(middle)


    //returns an array of the mesh and shape, so you update them together
    return ([sphereBody, middle])
  }
}



function myaddbox(posx, posy, posz, sizex, sizey, sizez, mass, shapeormesh) {
  //'''wrapper by alex''' because I don't fuckign get how they integrate them together
  // and what the fuck is quaternion, wait i know now
  // but i still need this because it doesnt do what I want it to do

  if (shapeormesh == 0) {
    //adding it to cannon
    var boxShape = new CANNON.Box(new CANNON.Vec3(sizex, sizey, sizez));
    var boxBody = new CANNON.Body({
      mass: mass,
      shape: boxShape
    });
    boxBody.position.set(posx, posy, posz);
    world.add(boxBody);


    //adding it to three
    var geometry = new THREE.BoxGeometry(sizex, sizey, sizez);
    var material = new THREE.MeshLambertMaterial({
      color: 0x777777,
    });
    var middle = new THREE.Mesh(geometry, material);
    middle.position.x = posx
    middle.position.y = posy
    middle.position.z = posz
    scene.add(middle)
    //returns an array of the mesh and shape, so you update them together
    return ([boxBody, middle])
  }
}




function myupdateshape(mesh, shape) {
  //given a mesh in cannonjs and a shape in threejs, update the threejs shape position
  shape.position.x = mesh.position.x;
  shape.position.y = mesh.position.y;
  shape.position.z = mesh.position.z;
  shape.quaternion.x = mesh.quaternion.x;
  shape.quaternion.y = mesh.quaternion.y;
  shape.quaternion.z = mesh.quaternion.z;
  shape.quaternion.w = mesh.quaternion.w;
}

function myupdateshapes(listofshapes) {
  //takes in a list of shapes and meshs and updates each individual one

  for (var item = 0; item < listofshapes.length; item++) {
    if (listofshapes[item][2] == 0) {
      myupdateshape(listofshapes[item][0], listofshapes[item][1])
    }
  }

}



/*
var geometry = new THREE.BoxGeometry(2, 4.3, 0.2);
var material = new THREE.MeshLambertMaterial({
  color: 0x000000,
});
var myguy = new THREE.Mesh(geometry, material);
myguy.castShadow = true; //default is false
myguy.receiveShadow = false; //default
myguy.position.y = 2.5
myguy.position.z = 5

//sscene.add(myguy)
*/


camera.position.x = 0;
camera.position.y = 40;
camera.position.z = 100;

camera.rotation.x = -Math.sin(Math.PI / 9)



meshandshapes = []

meshandshape = myaddsphere(0, 50, 0, 1, 0.2, 0)
boxshape = myaddbox(0, 0, 0, 70, 1, 70, 0, 0)
meshandshapes.push([boxshape[0], boxshape[1], 0])


boxshape = myaddbox(-30, 0, 0, 1, 30, 70, 0, 0)
meshandshapes.push([boxshape[0], boxshape[1], 0])

boxshape = myaddbox(30, 0, 0, 1, 30, 70, 0, 0)
meshandshapes.push([boxshape[0], boxshape[1], 0])

boxshape = myaddbox(0, 0, -30, 70, 30, 1, 0, 0)
meshandshapes.push([boxshape[0], boxshape[1], 0])

boxshape = myaddbox(0, 0, 30, 70, 10, 1, 0, 0)
meshandshapes.push([boxshape[0], boxshape[1], 0])



//the third element in the array is used to identify what type of shape/mesh it is
// 0 means both shape and mesh , 1 means mesh without shape, 2 means shape without mesh
meshandshapes.push([meshandshape[0], meshandshape[1], 0])









var timeStep = 1.0 / 30.0; // seconds
var count = 0


var animate = function() {
  requestAnimationFrame(animate);

  count += 1

  world.step(timeStep);



  if (count % 10 == 0 && count < 500) {
    meshandshape = myaddsphere(Math.random() * 50 - 25, Math.random() * 20+3, Math.random() * 50 - 25, 1, 0.2, 0)
    meshandshapes.push([meshandshape[0], meshandshape[1], 0])
  }


  myupdateshapes(meshandshapes)
  //console.log(sphereBody)

  //farwall.rotation.x += 0.005

  //scene.rotation.x += 0.01
  renderer.render(scene, camera);
};

animate();
