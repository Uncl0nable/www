// Initialize Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add simple lighting
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(0, 10, 0);
scene.add(light);

// Set camera position
camera.position.set(0, 5, 10);

// Update window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Function to create a block (cube)
function createBlock(x, y, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Cube of size 1x1x1
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Green block
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
    return block;
}

// Create a grid of blocks (like a floor)
for (let x = -5; x < 5; x++) {
    for (let z = -5; z < 5; z++) {
        createBlock(x, 0, z); // Create blocks on the ground
    }
}

function generateWorld() {
    for (let x = -50; x < 50; x++) {
        for (let z = -50; z < 50; z++) {
            createBlock(x, 0, z); // Generate blocks at y = 0 (ground level)
        }
    }
}

generateWorld();

const controls = new THREE.PointerLockControls(camera, renderer.domElement);

// Mouse event listener to lock the mouse cursor
document.body.addEventListener('click', () => {
    controls.lock();
});

// Movement variables
let velocity = new THREE.Vector3();
const speed = 0.1;
const clock = new THREE.Clock();

// Movement based on WASD keys
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            velocity.z = -speed;
            break;
        case 's':
            velocity.z = speed;
            break;
        case 'a':
            velocity.x = -speed;
            break;
        case 'd':
            velocity.x = speed;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (['w', 's'].includes(event.key)) velocity.z = 0;
    if (['a', 'd'].includes(event.key)) velocity.x = 0;
});

// Update the camera position based on the velocity
function update() {
    const delta = clock.getDelta();
    controls.moveRight(velocity.x * delta);
    controls.moveForward(velocity.z * delta);
    renderer.render(scene, camera);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
}

animate();

function checkCollision(camera, world) {
    world.children.forEach(block => {
        if (block.geometry instanceof THREE.BoxGeometry) {
            if (camera.position.distanceTo(block.position) < 1) {
                // Prevent camera from moving into the block
                camera.position.set(0, 5, 10); // Example collision resolution
            }
        }
    });
}

// Call this function in the animation loop
function update() {
    const delta = clock.getDelta();
    controls.moveRight(velocity.x * delta);
    controls.moveForward(velocity.z * delta);
    checkCollision(camera, scene);
    renderer.render(scene, camera);
}
