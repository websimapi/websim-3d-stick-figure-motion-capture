import * as THREE from 'three';

export class StickFigure {
    constructor() {
        this.skeleton = null;
        this.mesh = null;
        this.bones = {};
        this.boneMap = {};
        this.originalRotations = {};
        this.setupStickFigure();
    }

    setupStickFigure() {
        // Create bone hierarchy
        this.createSkeleton();
        
        // Create mesh geometry
        this.createMesh();
        
        // Setup skinning
        this.setupSkinning();
    }

    createSkeleton() {
        // Root bone (at hips level)
        const rootBone = new THREE.Bone();
        rootBone.name = 'root';
        rootBone.position.set(0, 0, 0);

        // Spine bones - adjusted to match mesh geometry
        const hipBone = new THREE.Bone();
        hipBone.name = 'hip';
        hipBone.position.set(0, 0, 0);
        rootBone.add(hipBone);

        const spineBone = new THREE.Bone();
        spineBone.name = 'spine';
        spineBone.position.set(0, 0.8, 0);
        hipBone.add(spineBone);

        const chestBone = new THREE.Bone();
        chestBone.name = 'chest';
        chestBone.position.set(0, 0.6, 0);
        spineBone.add(chestBone);

        const neckBone = new THREE.Bone();
        neckBone.name = 'neck';
        neckBone.position.set(0, 0.3, 0);
        chestBone.add(neckBone);

        const headBone = new THREE.Bone();
        headBone.name = 'head';
        headBone.position.set(0, 0.2, 0);
        neckBone.add(headBone);

        // Left arm - match mesh positions
        const leftShoulderBone = new THREE.Bone();
        leftShoulderBone.name = 'leftShoulder';
        leftShoulderBone.position.set(0.2, 0.2, 0);
        chestBone.add(leftShoulderBone);

        const leftUpperArmBone = new THREE.Bone();
        leftUpperArmBone.name = 'leftUpperArm';
        leftUpperArmBone.position.set(0.3, 0, 0);
        leftShoulderBone.add(leftUpperArmBone);

        const leftLowerArmBone = new THREE.Bone();
        leftLowerArmBone.name = 'leftLowerArm';
        leftLowerArmBone.position.set(0.3, 0, 0);
        leftUpperArmBone.add(leftLowerArmBone);

        const leftHandBone = new THREE.Bone();
        leftHandBone.name = 'leftHand';
        leftHandBone.position.set(0.2, 0, 0);
        leftLowerArmBone.add(leftHandBone);

        // Right arm - match mesh positions
        const rightShoulderBone = new THREE.Bone();
        rightShoulderBone.name = 'rightShoulder';
        rightShoulderBone.position.set(-0.2, 0.2, 0);
        chestBone.add(rightShoulderBone);

        const rightUpperArmBone = new THREE.Bone();
        rightUpperArmBone.name = 'rightUpperArm';
        rightUpperArmBone.position.set(-0.3, 0, 0);
        rightShoulderBone.add(rightUpperArmBone);

        const rightLowerArmBone = new THREE.Bone();
        rightLowerArmBone.name = 'rightLowerArm';
        rightLowerArmBone.position.set(-0.3, 0, 0);
        rightUpperArmBone.add(rightLowerArmBone);

        const rightHandBone = new THREE.Bone();
        rightHandBone.name = 'rightHand';
        rightHandBone.position.set(-0.2, 0, 0);
        rightLowerArmBone.add(rightHandBone);

        // Left leg - match mesh positions
        const leftHipBone = new THREE.Bone();
        leftHipBone.name = 'leftHip';
        leftHipBone.position.set(0.1, 0, 0);
        hipBone.add(leftHipBone);

        const leftUpperLegBone = new THREE.Bone();
        leftUpperLegBone.name = 'leftUpperLeg';
        leftUpperLegBone.position.set(0, -0.5, 0);
        leftHipBone.add(leftUpperLegBone);

        const leftLowerLegBone = new THREE.Bone();
        leftLowerLegBone.name = 'leftLowerLeg';
        leftLowerLegBone.position.set(0, -0.5, 0);
        leftUpperLegBone.add(leftLowerLegBone);

        const leftFootBone = new THREE.Bone();
        leftFootBone.name = 'leftFoot';
        leftFootBone.position.set(0, -0.15, 0.1);
        leftLowerLegBone.add(leftFootBone);

        // Right leg - match mesh positions
        const rightHipBone = new THREE.Bone();
        rightHipBone.name = 'rightHip';
        rightHipBone.position.set(-0.1, 0, 0);
        hipBone.add(rightHipBone);

        const rightUpperLegBone = new THREE.Bone();
        rightUpperLegBone.name = 'rightUpperLeg';
        rightUpperLegBone.position.set(0, -0.5, 0);
        rightHipBone.add(rightUpperLegBone);

        const rightLowerLegBone = new THREE.Bone();
        rightLowerLegBone.name = 'rightLowerLeg';
        rightLowerLegBone.position.set(0, -0.5, 0);
        rightUpperLegBone.add(rightLowerLegBone);

        const rightFootBone = new THREE.Bone();
        rightFootBone.name = 'rightFoot';
        rightFootBone.position.set(0, -0.15, 0.1);
        rightLowerLegBone.add(rightFootBone);

        // Store bones for easy access
        this.bones = {
            root: rootBone,
            hip: hipBone,
            spine: spineBone,
            chest: chestBone,
            neck: neckBone,
            head: headBone,
            leftShoulder: leftShoulderBone,
            leftUpperArm: leftUpperArmBone,
            leftLowerArm: leftLowerArmBone,
            leftHand: leftHandBone,
            rightShoulder: rightShoulderBone,
            rightUpperArm: rightUpperArmBone,
            rightLowerArm: rightLowerArmBone,
            rightHand: rightHandBone,
            leftHip: leftHipBone,
            leftUpperLeg: leftUpperLegBone,
            leftLowerLeg: leftLowerLegBone,
            leftFoot: leftFootBone,
            rightHip: rightHipBone,
            rightUpperLeg: rightUpperLegBone,
            rightLowerLeg: rightLowerLegBone,
            rightFoot: rightFootBone
        };

        // Create skeleton
        this.skeleton = new THREE.Skeleton([
            rootBone, hipBone, spineBone, chestBone, neckBone, headBone,
            leftShoulderBone, leftUpperArmBone, leftLowerArmBone, leftHandBone,
            rightShoulderBone, rightUpperArmBone, rightLowerArmBone, rightHandBone,
            leftHipBone, leftUpperLegBone, leftLowerLegBone, leftFootBone,
            rightHipBone, rightUpperLegBone, rightLowerLegBone, rightFootBone
        ]);

        // Store original rotations
        Object.keys(this.bones).forEach(key => {
            this.originalRotations[key] = this.bones[key].rotation.clone();
        });
    }

    createMesh() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        const skinIndices = [];
        const skinWeights = [];

        // Helper function to add a limb (cylinder)
        const addLimb = (start, end, boneIndex, segments = 8) => {
            const startVert = vertices.length / 3;
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            const radius = 0.03;
            
            // Create cylinder vertices
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                // Start cap
                vertices.push(start.x + x, start.y, start.z + z);
                skinIndices.push(boneIndex, 0, 0, 0);
                skinWeights.push(1, 0, 0, 0);
                
                // End cap
                vertices.push(end.x + x, end.y, end.z + z);
                skinIndices.push(boneIndex, 0, 0, 0);
                skinWeights.push(1, 0, 0, 0);
            }
            
            // Create faces
            for (let i = 0; i < segments; i++) {
                const a = startVert + i * 2;
                const b = startVert + i * 2 + 1;
                const c = startVert + ((i + 1) % segments) * 2;
                const d = startVert + ((i + 1) % segments) * 2 + 1;
                
                // Two triangles per quad
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        };

        // Add head (sphere)
        const headCenter = new THREE.Vector3(0, 1.9, 0);
        const headRadius = 0.1;
        const headSegments = 8;
        const headStartVert = vertices.length / 3;
        
        for (let i = 0; i <= headSegments; i++) {
            for (let j = 0; j <= headSegments; j++) {
                const phi = (i / headSegments) * Math.PI;
                const theta = (j / headSegments) * Math.PI * 2;
                
                const x = headCenter.x + headRadius * Math.sin(phi) * Math.cos(theta);
                const y = headCenter.y + headRadius * Math.cos(phi);
                const z = headCenter.z + headRadius * Math.sin(phi) * Math.sin(theta);
                
                vertices.push(x, y, z);
                skinIndices.push(4, 0, 0, 0); // head bone index
                skinWeights.push(1, 0, 0, 0);
            }
        }
        
        // Add head faces
        for (let i = 0; i < headSegments; i++) {
            for (let j = 0; j < headSegments; j++) {
                const a = headStartVert + i * (headSegments + 1) + j;
                const b = headStartVert + i * (headSegments + 1) + (j + 1);
                const c = headStartVert + (i + 1) * (headSegments + 1) + j;
                const d = headStartVert + (i + 1) * (headSegments + 1) + (j + 1);
                
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        // Add limbs with proper bone indices matching the skeleton hierarchy
        // Torso
        addLimb(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.8, 0), 1); // root to spine
        addLimb(new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0, 1.4, 0), 2); // spine to chest
        addLimb(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, 1.7, 0), 3); // chest to neck
        
        // Left arm
        addLimb(new THREE.Vector3(0.2, 1.6, 0), new THREE.Vector3(0.5, 1.6, 0), 6); // left shoulder to upper arm
        addLimb(new THREE.Vector3(0.5, 1.6, 0), new THREE.Vector3(0.8, 1.6, 0), 7); // left upper arm to lower arm
        addLimb(new THREE.Vector3(0.8, 1.6, 0), new THREE.Vector3(1.0, 1.6, 0), 8); // left lower arm to hand
        
        // Right arm
        addLimb(new THREE.Vector3(-0.2, 1.6, 0), new THREE.Vector3(-0.5, 1.6, 0), 10); // right shoulder to upper arm
        addLimb(new THREE.Vector3(-0.5, 1.6, 0), new THREE.Vector3(-0.8, 1.6, 0), 11); // right upper arm to lower arm
        addLimb(new THREE.Vector3(-0.8, 1.6, 0), new THREE.Vector3(-1.0, 1.6, 0), 12); // right lower arm to hand
        
        // Left leg
        addLimb(new THREE.Vector3(0.1, 0, 0), new THREE.Vector3(0.1, -0.5, 0), 14); // left hip to upper leg
        addLimb(new THREE.Vector3(0.1, -0.5, 0), new THREE.Vector3(0.1, -1.0, 0), 15); // left upper leg to lower leg
        addLimb(new THREE.Vector3(0.1, -1.0, 0), new THREE.Vector3(0.1, -1.15, 0.1), 16); // left lower leg to foot
        
        // Right leg
        addLimb(new THREE.Vector3(-0.1, 0, 0), new THREE.Vector3(-0.1, -0.5, 0), 18); // right hip to upper leg
        addLimb(new THREE.Vector3(-0.1, -0.5, 0), new THREE.Vector3(-0.1, -1.0, 0), 19); // right upper leg to lower leg
        addLimb(new THREE.Vector3(-0.1, -1.0, 0), new THREE.Vector3(-0.1, -1.15, 0.1), 20); // right lower leg to foot

        // Set geometry attributes
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
        geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Create material
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });

        // Create skinned mesh
        this.mesh = new THREE.SkinnedMesh(geometry, material);
        this.mesh.add(this.skeleton.bones[0]);
        this.mesh.bind(this.skeleton);
    }

    setupSkinning() {
        // Create bone mapping for MediaPipe landmarks
        this.boneMap = {
            'nose': 'head',
            'left_shoulder': 'leftShoulder',
            'right_shoulder': 'rightShoulder',
            'left_elbow': 'leftUpperArm',
            'right_elbow': 'rightUpperArm',
            'left_wrist': 'leftLowerArm',
            'right_wrist': 'rightLowerArm',
            'left_hip': 'leftHip',
            'right_hip': 'rightHip',
            'left_knee': 'leftUpperLeg',
            'right_knee': 'rightUpperLeg',
            'left_ankle': 'leftLowerLeg',
            'right_ankle': 'rightLowerLeg'
        };
    }

    updateFromPose(landmarks) {
        if (!landmarks || landmarks.length === 0) return;

        // MediaPipe pose landmark indices
        const POSE_LANDMARKS = {
            NOSE: 0,
            LEFT_EYE_INNER: 1,
            LEFT_EYE: 2,
            LEFT_EYE_OUTER: 3,
            RIGHT_EYE_INNER: 4,
            RIGHT_EYE: 5,
            RIGHT_EYE_OUTER: 6,
            LEFT_EAR: 7,
            RIGHT_EAR: 8,
            MOUTH_LEFT: 9,
            MOUTH_RIGHT: 10,
            LEFT_SHOULDER: 11,
            RIGHT_SHOULDER: 12,
            LEFT_ELBOW: 13,
            RIGHT_ELBOW: 14,
            LEFT_WRIST: 15,
            RIGHT_WRIST: 16,
            LEFT_PINKY: 17,
            RIGHT_PINKY: 18,
            LEFT_INDEX: 19,
            RIGHT_INDEX: 20,
            LEFT_THUMB: 21,
            RIGHT_THUMB: 22,
            LEFT_HIP: 23,
            RIGHT_HIP: 24,
            LEFT_KNEE: 25,
            RIGHT_KNEE: 26,
            LEFT_ANKLE: 27,
            RIGHT_ANKLE: 28,
            LEFT_HEEL: 29,
            RIGHT_HEEL: 30,
            LEFT_FOOT_INDEX: 31,
            RIGHT_FOOT_INDEX: 32
        };

        // Reset to original rotations
        Object.keys(this.bones).forEach(key => {
            this.bones[key].rotation.copy(this.originalRotations[key]);
        });

        // Helper function to convert MediaPipe coordinates to world coordinates
        const convertCoords = (landmark) => {
            return new THREE.Vector3(
                (landmark.x - 0.5) * 4, // Center around 0 and scale
                (0.5 - landmark.y) * 4, // Flip Y axis and scale
                landmark.z * 2 // Scale Z depth
            );
        };

        // Helper function to calculate rotation from direction vector
        const calculateRotation = (from, to) => {
            const direction = new THREE.Vector3().subVectors(to, from).normalize();
            const quaternion = new THREE.Quaternion();
            
            // Calculate rotation to point towards the target
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(up, direction).normalize();
            const newUp = new THREE.Vector3().crossVectors(direction, right).normalize();
            
            const matrix = new THREE.Matrix4();
            matrix.makeBasis(right, newUp, direction);
            quaternion.setFromRotationMatrix(matrix);
            
            return quaternion;
        };

        try {
            // Get key landmarks
            const nose = landmarks[POSE_LANDMARKS.NOSE];
            const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
            const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
            const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
            const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
            const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
            const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
            const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
            const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
            const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
            const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
            const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
            const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

            // Calculate center points
            const shoulderCenter = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2,
                z: (leftShoulder.z + rightShoulder.z) / 2
            };

            const hipCenter = {
                x: (leftHip.x + rightHip.x) / 2,
                y: (leftHip.y + rightHip.y) / 2,
                z: (leftHip.z + rightHip.z) / 2
            };

            // Position root bone at hip center
            const rootPos = convertCoords(hipCenter);
            this.bones.root.position.copy(rootPos);

            // Torso rotation (spine)
            if (leftShoulder && rightShoulder && leftHip && rightHip) {
                const shoulderPos = convertCoords(shoulderCenter);
                const hipPos = convertCoords(hipCenter);
                const spineDirection = new THREE.Vector3().subVectors(shoulderPos, hipPos).normalize();
                
                // Calculate spine rotation
                const spineQuaternion = calculateRotation(hipPos, shoulderPos);
                this.bones.spine.setRotationFromQuaternion(spineQuaternion);
            }

            // Head/neck rotation
            if (nose && leftShoulder && rightShoulder) {
                const nosePos = convertCoords(nose);
                const shoulderPos = convertCoords(shoulderCenter);
                const neckQuaternion = calculateRotation(shoulderPos, nosePos);
                this.bones.neck.setRotationFromQuaternion(neckQuaternion);
            }

            // Left arm
            if (leftShoulder && leftElbow) {
                const shoulderPos = convertCoords(leftShoulder);
                const elbowPos = convertCoords(leftElbow);
                const upperArmQuaternion = calculateRotation(shoulderPos, elbowPos);
                this.bones.leftUpperArm.setRotationFromQuaternion(upperArmQuaternion);
            }

            if (leftElbow && leftWrist) {
                const elbowPos = convertCoords(leftElbow);
                const wristPos = convertCoords(leftWrist);
                const lowerArmQuaternion = calculateRotation(elbowPos, wristPos);
                this.bones.leftLowerArm.setRotationFromQuaternion(lowerArmQuaternion);
            }

            // Right arm
            if (rightShoulder && rightElbow) {
                const shoulderPos = convertCoords(rightShoulder);
                const elbowPos = convertCoords(rightElbow);
                const upperArmQuaternion = calculateRotation(shoulderPos, elbowPos);
                this.bones.rightUpperArm.setRotationFromQuaternion(upperArmQuaternion);
            }

            if (rightElbow && rightWrist) {
                const elbowPos = convertCoords(rightElbow);
                const wristPos = convertCoords(rightWrist);
                const lowerArmQuaternion = calculateRotation(elbowPos, wristPos);
                this.bones.rightLowerArm.setRotationFromQuaternion(lowerArmQuaternion);
            }

            // Left leg
            if (leftHip && leftKnee) {
                const hipPos = convertCoords(leftHip);
                const kneePos = convertCoords(leftKnee);
                const upperLegQuaternion = calculateRotation(hipPos, kneePos);
                this.bones.leftUpperLeg.setRotationFromQuaternion(upperLegQuaternion);
            }

            if (leftKnee && leftAnkle) {
                const kneePos = convertCoords(leftKnee);
                const anklePos = convertCoords(leftAnkle);
                const lowerLegQuaternion = calculateRotation(kneePos, anklePos);
                this.bones.leftLowerLeg.setRotationFromQuaternion(lowerLegQuaternion);
            }

            // Right leg
            if (rightHip && rightKnee) {
                const hipPos = convertCoords(rightHip);
                const kneePos = convertCoords(rightKnee);
                const upperLegQuaternion = calculateRotation(hipPos, kneePos);
                this.bones.rightUpperLeg.setRotationFromQuaternion(upperLegQuaternion);
            }

            if (rightKnee && rightAnkle) {
                const kneePos = convertCoords(rightKnee);
                const anklePos = convertCoords(rightAnkle);
                const lowerLegQuaternion = calculateRotation(kneePos, anklePos);
                this.bones.rightLowerLeg.setRotationFromQuaternion(lowerLegQuaternion);
            }

        } catch (error) {
            console.warn('Error updating pose:', error);
        }
    }

    getMesh() {
        return this.mesh;
    }

    getSkeleton() {
        return this.skeleton;
    }
}