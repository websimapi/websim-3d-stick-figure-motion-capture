import * as THREE from 'three';
import { StickFigure } from './stickfigure.js';
import { PoseDetection } from './pose-detection.js';

class MotionCaptureApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stickFigure = null;
        this.poseDetection = null;
        this.animationId = null;
        
        this.init();
    }

    async init() {
        // Set up Three.js scene
        this.setupScene();
        
        // Create stick figure
        this.stickFigure = new StickFigure();
        this.scene.add(this.stickFigure.getMesh());
        
        // Initialize pose detection
        this.poseDetection = new PoseDetection();
        await this.poseDetection.initialize();
        
        // Set up pose callback
        this.poseDetection.onPoseDetected((landmarks) => {
            this.stickFigure.updateFromPose(landmarks);
        });
        
        // Set up UI
        this.setupUI();
        
        // Start animation loop
        this.animate();
        
        // Update status
        this.updateStatus('Ready - Click Start to begin motion capture');
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1, 3);
        this.camera.lookAt(0, 1, 0);

        // Renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 20, 0x444444, 0x222222);
        gridHelper.position.y = -1.5;
        this.scene.add(gridHelper);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupUI() {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');

        startBtn.addEventListener('click', async () => {
            const success = await this.poseDetection.startCamera();
            if (success) {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                this.updateStatus('Motion capture active');
            } else {
                this.updateStatus('Failed to start camera');
            }
        });

        stopBtn.addEventListener('click', () => {
            this.poseDetection.stopCamera();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            this.updateStatus('Motion capture stopped');
        });
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = `Status: ${message}`;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Simple camera orbit
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.cos(time) * 4;
        this.camera.position.z = Math.sin(time) * 4;
        this.camera.lookAt(0, 1, 0);
        
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.poseDetection) {
            this.poseDetection.stopCamera();
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize the application
const app = new MotionCaptureApp();

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});

