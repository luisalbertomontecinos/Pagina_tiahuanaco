import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#87CEEB');
scene.fog = new THREE.FogExp2('#87CEEB', 0.015);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 2;
controls.maxDistance = 50;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;

const hemiLight = new THREE.HemisphereLight('#87CEEB', '#8B5A2B', 0.6);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight('#ffffff', 1.8);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

const floorGeo = new THREE.PlaneGeometry(400, 400);
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x8B5A2B,
    roughness: 1,
    metalness: 0.05
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const loader = new GLTFLoader();
const modelos3D = [];

loader.load('puerta.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(5, 0, -5);
    model.rotation.y = Math.PI / 10;
    model.rotation.x = -0.05;
    model.rotation.z = 9.5;
    model.scale.set(1.1, 1.1, 1.1);

    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            node.material = new THREE.MeshStandardMaterial({
                color: node.material.color || 0x8a847c,
                roughness: 0.7,
                metalness: 0.1
            });
        }
    });

    scene.add(model);
    modelos3D[0] = { pos: new THREE.Vector3(5, 2, 0), center: new THREE.Vector3(5, 3.5, 0) };
});

loader.load('estatua.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(12, 0, 0);
    model.rotation.y = -Math.PI / 6;
    model.scale.set(1, 1, 1);

    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            node.material = new THREE.MeshStandardMaterial({
                color: 0x8a847c,
                roughness: 0.7,
                metalness: 0.1
            });
        }
    });

    scene.add(model);
    modelos3D[1] = { pos: new THREE.Vector3(12, 0, 0), center: new THREE.Vector3(12, 2, 0) };
});

const modelInfo = [
    {
        title: 'Puerta del Sol',
        description: 'Monumento emblemático de Tiwanaku, reconocido por su iconografía solar y su valor ceremonial.',
        period: 'Tiwanaku clásico',
        location: 'Sitio arqueológico de Tiwanaku, Bolivia',
        significance: 'Símbolo del poder religioso y astronómico de la cultura.'
    },
    {
        title: 'Monolito Ponce',
        description: 'Estatua monolítica que representa a una figura ceremonial con un fuerte simbolismo político y religioso.',
        period: 'Periodo de apogeo de Tiwanaku',
        location: 'Museo Nacional de Arqueología, La Paz',
        significance: 'Refleja la importancia de las élites y las prácticas rituales.'
    }
];

const title = document.getElementById('model-title');
const description = document.getElementById('model-description');
const period = document.getElementById('model-period');
const location = document.getElementById('model-location');
const significance = document.getElementById('model-significance');

function actualizarInfo(index) {
    const info = modelInfo[index];
    if (!info) return;

    title.textContent = info.title;
    description.textContent = info.description;
    period.textContent = info.period;
    location.textContent = info.location;
    significance.textContent = info.significance;
}

window.seleccionarModelo = function(index) {
    if (!modelos3D[index]) return;

    const model = modelos3D[index];
    camera.position.set(model.pos.x, model.center.y + 1.5, model.pos.z + 6);
    controls.target.copy(model.center);
    controls.update();
    actualizarInfo(index);
};

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener('resize', resizeRenderer);

camera.position.set(0, 3, 7);
controls.target.set(0, 1.5, 0);
controls.update();
resizeRenderer();
actualizarInfo(0);
animate();
