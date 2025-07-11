export class PoseDetection {
    constructor() {
        this.pose = null;
        this.camera = null;
        this.isRunning = false;
        this.onPoseCallback = null;
    }

    async initialize() {
        // Initialize MediaPipe Pose
        const { Pose } = await import('@mediapipe/pose');
        const { Camera } = await import('@mediapipe/camera_utils');
        
        this.pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
            }
        });

        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.pose.onResults(this.onResults.bind(this));
    }

    onResults(results) {
        if (results.poseLandmarks && this.onPoseCallback) {
            this.onPoseCallback(results.poseLandmarks);
        }
    }

    async startCamera() {
        if (this.isRunning) return;

        try {
            const video = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 }
                }
            });

            video.srcObject = stream;
            
            // Wait for video to load
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    resolve();
                };
            });

            this.camera = new Camera(video, {
                onFrame: async () => {
                    await this.pose.send({ image: video });
                },
                width: 640,
                height: 480
            });

            this.camera.start();
            this.isRunning = true;
            
            return true;
        } catch (error) {
            console.error('Error starting camera:', error);
            return false;
        }
    }

    stopCamera() {
        if (!this.isRunning) return;

        if (this.camera) {
            this.camera.stop();
        }

        const video = document.getElementById('video');
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }

        this.isRunning = false;
    }

    onPoseDetected(callback) {
        this.onPoseCallback = callback;
    }

    getIsRunning() {
        return this.isRunning;
    }
}

