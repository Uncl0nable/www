// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Player setup
const player = {
  position: new THREE.Vector3(0, 1, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  yaw: 0,
  pitch: 0,
  speed: 0.1,
};

// Terrain generation
const world = {};
const blockSize = 1;
const chunkSize = 16;

function generateChunk(x, z) {
  const chunk = [];
  for (let i = 0; i < chunkSize; i++) {
    for (let j = 0; j < chunkSize; j++) {
      const height = Math.floor(Math.random() * 4) + 1;
      for (let k = 0; k < height; k++) {
        const block = new THREE.Mesh(
          new THREE.BoxGeometry(blockSize, blockSize, blockSize),
          new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        );
        block.position.set(x + i, k, z + j);
        scene.add(block);
        chunk.push(block);
      }
    }
  }
  world[`${x},${z}`] = chunk;
}

generateChunk(0, 0);

// Player movement
const keys = {};
document.addEventListener('keydown', (e) => (keys[e.code] = true));
document.addEventListener('keyup', (e) => (keys[e.code] = false));

function updatePlayer() {
  if (keys['KeyW']) {
    player.position.z -= player.speed;
  }
  if (keys['KeyS']) {
    player.position.z += player.speed;
  }
  if (keys['KeyA']) {
    player.position.x -= player.speed;
  }
  if (keys['KeyD']) {
    player.position.x += player.speed;
  }
  if (keys['Space']) {
    player.position.y += player.speed;
  }
  if (keys['ShiftLeft']) {
    player.position.y -= player.speed;
  }
}

// Camera controls
document.addEventListener('mousemove', (e) => {
  player.yaw -= e.movementX * 0.002;
  player.pitch -= e.movementY * 0.002;
  player.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.pitch));
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  updatePlayer();

  // Update camera position and rotation
  camera.position.copy(player.position);
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
