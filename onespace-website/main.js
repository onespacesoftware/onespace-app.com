import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Logo from "/teamImages/logo.jpg";
import Paris from "/teamImages/paris.jpg";
import Umang from "/teamImages/umang.jpg";
import Weston from "/teamImages/weston.jpg";
import Sahith from "/teamImages/sahith.jpg";
import Ayush from "/teamImages/ayush.jpg";
import Sid from "/teamImages/sid.jpg";
import Title from "/team title.png";

/////////////////////////////
///// ENVIRONMENT SETUP /////
/////////////////////////////

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 55, -55);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// const axis = new THREE.AxesHelper(100);
// scene.add(axis);

///////////////////////
///// FLOATY LOGO /////
///////////////////////

const extrudeSettings1 = {
  steps: 1,
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 2,
  bevelSegments: 3,
};

const length1 = 10,
  width1 = 10;

const shape1 = new THREE.Shape();
shape1.lineTo(0, width1);
shape1.lineTo(length1, width1);
shape1.lineTo(length1, 0);
shape1.lineTo(0, 0);

const extrudeSettings2 = {
  steps: 1,
  depth: 1.75,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 2,
  bevelSegments: 3,
};

const length2 = 1.5,
  width2 = 1.5;
const shape2 = new THREE.Shape();

shape2.lineTo(0, width2);
shape2.lineTo(length2, width2);
shape2.lineTo(length2, 0);
shape2.lineTo(0, 0);

const extrudeSettings3 = {
  steps: 1,
  depth: 2.25,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 2,
  bevelSegments: 3,
};

const length3 = 0.5,
  width3 = 0.5;

const shape3 = new THREE.Shape();
shape3.lineTo(0, width3);
shape3.lineTo(length3, width3);
shape3.lineTo(length3, 0);
shape3.lineTo(0, 0);

const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);
const material1 = new THREE.MeshStandardMaterial({
  color: 0x2c3235,
  wireframe: false,
  side: THREE.DoubleSide,
});
const square1 = new THREE.Mesh(geometry1, material1);

square1.position.set(-5, 15, 0);

const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
const material2 = new THREE.MeshStandardMaterial({
  color: 0xc0daf3,
  wireframe: false,
  side: THREE.DoubleSide,
});
const square2 = new THREE.Mesh(geometry2, material2);

square2.position.set(4, 25, -0.5);

const geometry3 = new THREE.ExtrudeGeometry(shape3, extrudeSettings3);
const material3 = new THREE.MeshStandardMaterial({
  color: 0xc0bdb0,
  wireframe: false,
  side: THREE.DoubleSide,
});
const square3 = new THREE.Mesh(geometry3, material3);
9;

square3.position.set(7, 22, -0.75);

const squaresGroup = new THREE.Group();
squaresGroup.add(square1, square2, square3);
scene.add(squaresGroup);

function onDocumentMouseDown(event) {
  event.preventDefault();

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(squaresGroup.children, true);

  if (intersects.length > 0) {
    onClick(event);
  }
}
document.addEventListener("mousedown", onDocumentMouseDown, false);

let isSpinning = false;
let originalRotationSpeed = 0.005;
let clickRotationSpeed = 0.2;
let spinAcceleration = 0.01;
let spinDeceleration = 0.0005;

function onClick() {
  if (!isSpinning) {
    isSpinning = true;
    originalRotationSpeed = 0.005;

    const spinFast = () => {
      if (originalRotationSpeed < clickRotationSpeed) {
        originalRotationSpeed += spinAcceleration;
        squaresGroup.rotateY(originalRotationSpeed);
        requestAnimationFrame(spinFast);
      } else {
        slowDown();
      }
    };

    const slowDown = () => {
      if (originalRotationSpeed > 0.005) {
        originalRotationSpeed -= spinDeceleration;
        squaresGroup.rotateY(originalRotationSpeed);
        requestAnimationFrame(slowDown);
      } else {
        isSpinning = false;
        originalRotationSpeed = 0.005;
      }
    };

    spinFast();
  }
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 toCenter = center - vUv;
    float gradient = length(toCenter);

    vec3 color = mix(vec3(0.0), vec3(1.0), gradient);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const gradientMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const circle = new THREE.CircleGeometry(5, 50);
const shadow = new THREE.Mesh(circle, gradientMaterial);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.05;
scene.add(shadow);

const ground = new THREE.CircleGeometry(25, 100);
const mesh = new THREE.MeshLambertMaterial({ color: "gray" });
const platform = new THREE.Mesh(ground, mesh);
platform.rotation.x = -Math.PI / 2;
platform.receiveShadow = true;
scene.add(platform);

const logoSpotLight = new THREE.SpotLight(
  0xffffff,
  1000,
  50,
  Math.PI / 6,
  0.5,
  0.75
);
logoSpotLight.position.set(0, 40, 0);

logoSpotLight.castShadow = true;

logoSpotLight.shadow.mapSize.width = 1024;
logoSpotLight.shadow.mapSize.height = 1024;

logoSpotLight.shadow.camera.near = 500;
logoSpotLight.shadow.camera.far = 4000;
logoSpotLight.shadow.camera.fov = 30;

scene.add(logoSpotLight);

/////////////////
///// ABOUT /////
/////////////////

const rectangle1 = new THREE.PlaneGeometry(480, 340);
const windowBackground = new THREE.MeshLambertMaterial({ color: 0x97c5f1 });
const mainFrame = new THREE.Mesh(rectangle1, windowBackground);
mainFrame.rotation.x = -Math.PI / 2;
mainFrame.position.set(0, 0, 310);
scene.add(mainFrame);

const rectangleBackground = new THREE.MeshLambertMaterial({ color: 0xf4f9ff });

const rectangle2 = new THREE.PlaneGeometry(220, 180);
const topLeft = new THREE.Mesh(rectangle2, rectangleBackground);
topLeft.rotation.x = -Math.PI / 2;
topLeft.position.set(120, 0.25, 350);
scene.add(topLeft);

const parisTexture = new THREE.TextureLoader().load(Paris);
const paris = new THREE.Mesh(
  new THREE.CircleGeometry(80, 50),
  new THREE.MeshLambertMaterial({ map: parisTexture })
);
paris.position.set(120, 0.5, 350);
paris.rotation.x = -Math.PI / 2;
paris.rotation.z = -Math.PI;
scene.add(paris);

const parisLight = new THREE.PointLight(0xffffff, 500, 0);
parisLight.position.set(110, 30, 320);
// const parisLightHelper = new THREE.PointLightHelper(parisLight);
scene.add(parisLight);

const rectangle3 = new THREE.PlaneGeometry(220, 180);
const topRight = new THREE.Mesh(rectangle3, rectangleBackground);
topRight.rotation.x = -Math.PI / 2;
topRight.position.set(-120, 0.25, 350);
scene.add(topRight);

const umangTexture = new THREE.TextureLoader().load(Umang);
const umang = new THREE.Mesh(
  new THREE.CircleGeometry(80, 50),
  new THREE.MeshLambertMaterial({ map: umangTexture })
);
umang.position.set(-120, 0.5, 350);
umang.rotation.x = -Math.PI / 2;
umang.rotation.z = -Math.PI;
scene.add(umang);

const umangLight = new THREE.PointLight(0xffffff, 500, 0);
umangLight.position.set(-110, 30, 320);
// const umangLightHelper = new THREE.PointLightHelper(umangLight);
scene.add(umangLight);

const rectangle4 = new THREE.PlaneGeometry(220, 90);
const bottomLeft = new THREE.Mesh(rectangle4, rectangleBackground);
bottomLeft.rotation.x = -Math.PI / 2;
bottomLeft.position.set(120, 0.25, 195);
scene.add(bottomLeft);

const westonTexture = new THREE.TextureLoader().load(Weston);
const weston = new THREE.Mesh(
  new THREE.CircleGeometry(40, 50),
  new THREE.MeshLambertMaterial({ map: westonTexture })
);
weston.position.set(170, 0.5, 195);
weston.rotation.x = -Math.PI / 2;
weston.rotation.z = -Math.PI;
scene.add(weston);

const westonLight = new THREE.PointLight(0xffffff, 500, 0);
westonLight.position.set(160, 20, 180);
// const westonLightHelper = new THREE.PointLightHelper(westonLight);
scene.add(westonLight);

const tylerTexture = new THREE.TextureLoader().load(Logo);
const tyler = new THREE.Mesh(
  new THREE.CircleGeometry(40, 50),
  new THREE.MeshLambertMaterial({ map: tylerTexture })
);
tyler.position.set(70, 0.5, 195);
tyler.rotation.x = -Math.PI / 2;
tyler.rotation.z = -Math.PI;
scene.add(tyler);

const tylerLight = new THREE.PointLight(0xffffff, 500, 0);
tylerLight.position.set(65, 20, 180);
const tylerLightHelper = new THREE.PointLightHelper(tylerLight);
scene.add(tylerLight);

const rectangle5 = new THREE.PlaneGeometry(220, 90);
const bottomRight = new THREE.Mesh(rectangle5, rectangleBackground);
bottomRight.rotation.x = -Math.PI / 2;
bottomRight.position.set(-120, 0.25, 195);
scene.add(bottomRight);

const sahithTexture = new THREE.TextureLoader().load(Sahith);
const sahith = new THREE.Mesh(
  new THREE.CircleGeometry(30, 50),
  new THREE.MeshLambertMaterial({ map: sahithTexture })
);
sahith.position.set(-50, 0.5, 195);
sahith.rotation.x = -Math.PI / 2;
sahith.rotation.z = -Math.PI;
scene.add(sahith);

const sahithLight = new THREE.PointLight(0xffffff, 100, 0);
sahithLight.position.set(-50, 10, 180);
// const sahithLightHelper = new THREE.PointLightHelper(sahithLight);
scene.add(sahithLight);

const ayushTexture = new THREE.TextureLoader().load(Ayush);
const ayush = new THREE.Mesh(
  new THREE.CircleGeometry(30, 50),
  new THREE.MeshLambertMaterial({ map: ayushTexture })
);
ayush.position.set(-120, 0.5, 195);
ayush.rotation.x = -Math.PI / 2;
ayush.rotation.z = -Math.PI;
scene.add(ayush);

const ayushLight = new THREE.PointLight(0xffffff, 100, 0);
ayushLight.position.set(-120, 10, 180);
const ayushLightHelper = new THREE.PointLightHelper(ayushLight);
scene.add(ayushLight);

const sidTexture = new THREE.TextureLoader().load(Sid);
const sid = new THREE.Mesh(
  new THREE.CircleGeometry(30, 50),
  new THREE.MeshLambertMaterial({ map: sidTexture })
);
sid.position.set(-190, 0.5, 195);
sid.rotation.x = -Math.PI / 2;
sid.rotation.z = -Math.PI;
scene.add(sid);

const sidLight = new THREE.PointLight(0xffffff, 100, 0);
sidLight.position.set(-190, 10, 180);
// const sidLightHelper = new THREE.PointLightHelper(sidLight);
scene.add(sidLight);

const titleTexture = new THREE.TextureLoader().load(Title);
const titleRectangle = new THREE.PlaneGeometry(200, 40);
const titleMesh = new THREE.MeshLambertMaterial({ map: titleTexture });
titleMesh.alphaHash = 1;
const title = new THREE.Mesh(titleRectangle, titleMesh);

title.position.set(0, 0.5, 460);
title.rotation.x = -Math.PI / 2;
title.rotation.z = -Math.PI;
scene.add(title);

const titleLight = new THREE.PointLight(0xffffff, 500, 0);
titleLight.position.set(0, 20, 450);
// const titleLightHelper = new THREE.PointLightHelper(titleLight);
scene.add(titleLight);

const topLeftCorner = new THREE.PointLight(0xffffff, 100, 0);
topLeftCorner.position.set(220, 10, 470);
// const topLeftCornerHelper = new THREE.PointLightHelper(topLeftCorner);
scene.add(topLeftCorner);

const topRightCorner = new THREE.PointLight(0xffffff, 100, 0);
topRightCorner.position.set(-220, 10, 470);
// const topRightCornerHelper = new THREE.PointLightHelper(topRightCorner);
scene.add(topRightCorner);

const teamSpotLight = new THREE.SpotLight(
  0xffffff,
  5,
  350,
  Math.PI / 8,
  0.5,
  0
);
teamSpotLight.position.set(0, 200, 250);

const targetObject = new THREE.Object3D();
targetObject.position.set(0, 0, 500);

teamSpotLight.target = targetObject;

scene.add(teamSpotLight);
scene.add(targetObject);

// const spotlightHelper = new THREE.SpotLightHelper(teamSpotLight);
// scene.add(spotlightHelper);

////////////////////////////////////////////
///// CAMERA MOVEMENT & TEAM SPOTLIGHT /////
////////////////////////////////////////////

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", () => {
  const meetTeamButton = document.getElementById("meet-team-button");
  const sections = document.querySelectorAll("section");
  const main = document.querySelector("main");
  const nextPrevButtons = document.getElementById("next-prev-buttons");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const returnButton = document.getElementById("return-button");

  let currentSectionIndex = 0;

  document.getElementById("meet-team-button").style.pointerEvents = "none";
  meetTeamButton.addEventListener("animationend", function (event) {
    if (event.animationName === "fadeIn") {
      meetTeamButton.style.pointerEvents = "auto";
    }
  });

  let isAnimatingCamera = false;

  meetTeamButton.addEventListener("click", () => {
    let targetPosition = new THREE.Vector3(200, 300, 250);
    let targetUp = new THREE.Vector3(0, 0, 1);
    let targetControl = new THREE.Vector3(200, 0, 200);

    const topSection = document.querySelector(".top");
    window.scrollTo({ top: topSection.offsetTop, behavior: "smooth" });
    currentSectionIndex = 0;
    nextPrevButtons.style.opacity = 1;
    updateButtons();

    document.getElementById("next-prev-buttons").style.pointerEvents = "auto";

    function animateCamera() {
      if (!isAnimatingCamera) return;

      const increment = 0.05;

      if (camera.position.distanceTo(targetPosition) > 0.1) {
        const newPosition = camera.position
          .clone()
          .lerp(targetPosition, increment);
        camera.position.copy(newPosition);
      }

      if (camera.up.distanceTo(targetUp) > 0.1) {
        const newUp = camera.up.clone().lerp(targetUp, increment);
        camera.up.copy(newUp);
      }

      if (controls.target.distanceTo(targetControl) > 0.1) {
        const newTarget = controls.target
          .clone()
          .lerp(targetControl, increment);
        controls.target.copy(newTarget);
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animateCamera);
    }
    isAnimatingCamera = true;
    animateCamera();
  });

  function updateButtons() {
    prevButton.disabled = currentSectionIndex === 0;
    nextButton.disabled = currentSectionIndex === sections.length - 1;
  }

  const targetCoordinates = [
    { x: 0, y: 0, z: 500 },
    { x: 100, y: 0, z: 350 },
    { x: -100, y: 0, z: 350 },
    { x: 100, y: 0, z: 180 },
    { x: -100, y: 0, z: 180 },
  ];

  let isAnimating = false;
  const animationDuration = 200;
  let startTime;
  let startCoords, targetCoords;

  function animateTargetPosition(timestamp) {
    if (!startTime) {
      startTime = timestamp;
      startCoords = { ...targetObject.position };
      targetCoords = targetCoordinates[currentSectionIndex];
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    const newPosition = {
      x: startCoords.x + (targetCoords.x - startCoords.x) * progress,
      y: startCoords.y + (targetCoords.y - startCoords.y) * progress,
      z: startCoords.z + (targetCoords.z - startCoords.z) * progress,
    };

    targetObject.position.set(newPosition.x, newPosition.y, newPosition.z);

    if (progress < 1) {
      requestAnimationFrame(animateTargetPosition);
    } else {
      isAnimating = false;
      startTime = null;
    }
  }

  function updateTargetPosition() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animateTargetPosition);
    }
  }

  prevButton.addEventListener("click", () => {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      const prevSection = sections[currentSectionIndex];
      window.scrollTo({ top: prevSection.offsetTop, behavior: "smooth" });
      updateButtons();
      updateTargetPosition();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
      const nextSection = sections[currentSectionIndex];
      window.scrollTo({ top: nextSection.offsetTop, behavior: "smooth" });
      updateButtons();
      updateTargetPosition();
    }
  });

  returnButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    nextPrevButtons.style.opacity = 0;
    currentSectionIndex = 0;
    updateTargetPosition();

    document.getElementById("next-prev-buttons").style.pointerEvents = "none";

    isAnimatingCamera = false;

    camera.position.set(0, 45, -55);
    camera.up.set(0, 1, 0);
    controls.target = new THREE.Vector3(0, 0, 0);
  });
});

///////////////////////////
///// LIGHTING & GRID /////
///////////////////////////

const logoPointLight = new THREE.PointLight(0xffffff, 2000, 0);
logoPointLight.position.set(-8, 12, -35);

// const ambientLight = new THREE.AmbientLight(0xFFFFFF);

// const gridHelper = new THREE.GridHelper(2000, 200);
scene.add(logoPointLight);

// const logoLightHelper = new THREE.PointLightHelper(logoPointLight);
// scene.add(logoLightHelper);

//////////////////////////////
///// ORIGIN OR TEMP POV /////
//////////////////////////////

// const g = new THREE.SphereGeometry(1);
// const m = new THREE.MeshBasicMaterial({color: "red"});
// const origin = new THREE.Mesh(g, m);
// origin.position.set(0, 45, 55);
// scene.add(origin);

/////////////////////
///// ANIMATION /////
/////////////////////

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  squaresGroup.rotateY(0.005);

  const bobbingSpeed = 0.002;
  const bobbingRange = 1;

  const yOffset = Math.sin(Date.now() * bobbingSpeed) * bobbingRange;

  squaresGroup.position.y = yOffset;

  const scaleFactor = Math.sin(Date.now() * 0.002) * 0.5 + 2;
  shadow.scale.set(scaleFactor, scaleFactor, scaleFactor);

  controls.update();
  renderer.render(scene, camera);
}
animate();
