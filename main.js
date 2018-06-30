
(function () {
  'use strict';
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // setup renderer & camera
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 200;
  camera.position.x = 20;

  // setup scene lights
  var pointlight1 = new THREE.PointLight(0xffffff, 1, 100);
  pointlight1.position.set(-50, 50, 100);
  scene.add(pointlight1);

  var pointlight2 = new THREE.PointLight(0xffffff, 1, 100);
  pointlight2.position.set(-50, -50, 100);
  scene.add(pointlight2);

  // setup scene objects
  var sphere_geo = new THREE.SphereGeometry(50, 50, 50);
  var sphere_mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
  var sphere = new THREE.Mesh(sphere_geo, sphere_mat);
  sphere.position.set(15, 15, 30);
  scene.add(sphere);

  var i;
  var points_geo = new THREE.Geometry();
  for (i = -500; i < 500; i++) {
    var position = new THREE.Vector3(i, 100, 50);
    points_geo.vertices.push(position);
  }

  var points_mat = new THREE.PointsMaterial({ vertexColors: true });
  for (i = 0; i < 1000; i++) {
    var color = new THREE.Color(0x0066ff);
    points_geo.colors.push(color);
  }
  var points = new THREE.Points(points_geo, points_mat);
  scene.add(points);

  // map background texture
  var texture = THREE.ImageUtils.loadTexture('stars.jpg');
  var bg_mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
      map: texture
    }));

  bg_mesh.material.depthTest = false;
  bg_mesh.material.depthwrite = false;

  // setup background scene
  var bg_scene = new THREE.Scene();
  var bg_camera = new THREE.Camera();
  bg_scene.add(bg_camera);
  bg_scene.add(bg_mesh);

  // move particles
  var frame_count = 0;
  function animate() {
    // skip frames to slow motion
    if (frame_count < 5) {
      frame_count++;
      requestAnimationFrame(animate);
      return;
    }
    frame_count = 0;
    requestAnimationFrame(animate);

    // spin sphere
    sphere.rotation.y += 0.1;

    for (i = 0; i < 1000; i++) {
      // make points appear to orbit sphere
      var px = Math.sin(i) * 75 + Math.random() * 20,
          py = Math.sin(i) * 75 + Math.random() * 20,
          pz = Math.cos(i) * 75 + Math.random() * 20;
      points.geometry.vertices[i].set(px, py, pz);

      // set color based on position for more realistic lighting
      if (points.geometry.vertices[i].x > 30) {
        points.geometry.colors[i].setHex(0x1a1a1a);
      }
    }

    // update positions & colors
    points.geometry.verticesNeedUpdate = true;
    points.geometry.colorsNeedUpdate = true;

    // render
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(bg_scene, bg_camera);
    renderer.render(scene, camera);
  }
  animate();
})();
