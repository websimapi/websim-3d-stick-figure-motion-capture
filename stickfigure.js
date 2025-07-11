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
        // Root bone
        const rootBone = new THREE.Bone();
        rootBone.name = 'root';
        rootBone.position.set(0, 0, 0);

        // Spine bones
        const spineBone = new THREE.Bone();
        spineBone.name = 'spine';
        spineBone.position.set(0, 0.8, 0);
        rootBone.add(spineBone);

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

        // Left arm
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

        // Right arm
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

        // Left leg
        const leftHipBone = new THREE.Bone();
        leftHipBone.name = 'leftHip';
        leftHipBone.position.set(0.1, 0, 0);
        rootBone.add(leftHipBone);

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

        // Right leg
        const rightHipBone = new THREE.Bone();
        rightHipBone.name = 'rightHip';
        rightHipBone.position.set(-0.1, 0, 0);
        rootBone.add(rightHipBone);

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
            rootBone, spineBone, chestBone, neckBone, headBone,
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

        // Reset to original rotations
        Object.keys(this.bones).forEach(key => {
            this.bones[key].rotation.copy(this.originalRotations[key]);
        });

        // Helper function to calculate rotation between two points
        const calculateRotation = (from, to) => {
            const direction = new THREE.Vector3(
                to.x - from.x,
                -(to.y - from.y), // Flip Y for correct orientation
                to.z - from.z
            ).normalize();
            
            const euler = new THREE.Euler();
            euler.setFromVector3(direction);
            return euler;
        };

        // Update bone rotations based on pose landmarks
        try {
            // Spine/torso alignment
            if (landmarks[11] && landmarks[12]) { // left and right shoulder
                const leftShoulder = landmarks[11];
                const rightShoulder = landmarks[12];
                const shoulderCenter = {
                    x: (leftShoulder.x + rightShoulder.x) / 2,
                    y: (leftShoulder.y + rightShoulder.y) / 2,
                    z: (leftShoulder.z + rightShoulder.z) / 2
                };
                
                if (landmarks[23] && landmarks[24]) { // left and right hip
                    const leftHip = landmarks[23];
                    const rightHip = landmarks[24];
                    const hipCenter = {
                        x: (leftHip.x + rightHip.x) / 2,
                        y: (leftHip.y + rightHip.y) / 2,
                        z: (leftHip.z + rightHip.z) / 2
                    };
                    
                    const spineRotation = calculateRotation(hipCenter, shoulderCenter);
                    this.bones.spine.rotation.x = spineRotation.x;
                    this.bones.spine.rotation.z = spineRotation.z;
                }
            }

            // Arms
            if (landmarks[11] && landmarks[13]) { // left shoulder to left elbow
                const rotation = calculateRotation(landmarks[11], landmarks[13]);
                this.bones.leftUpperArm.rotation.x = rotation.x;
                this.bones.leftUpperArm.rotation.z = rotation.z;
            }
            
            if (landmarks[13] && landmarks[15]) { // left elbow to left wrist
                const rotation = calculateRotation(landmarks[13], landmarks[15]);
                this.bones.leftLowerArm.rotation.x = rotation.x;
                this.bones.leftLowerArm.rotation.z = rotation.z;
            }
            
            if (landmarks[12] && landmarks[14]) { // right shoulder to right elbow
                const rotation = calculateRotation(landmarks[12], landmarks[14]);
                this.bones.rightUpperArm.rotation.x = rotation.x;
                this.bones.rightUpperArm.rotation.z = rotation.z;
            }
            
            if (landmarks[14] && landmarks[16]) { // right elbow to right wrist
                const rotation = calculateRotation(landmarks[14], landmarks[16]);
                this.bones.rightLowerArm.rotation.x = rotation.x;
                this.bones.rightLowerArm.rotation.z = rotation.z;
            }

            // Legs
            if (landmarks[23] && landmarks[25]) { // left hip to left knee
                const rotation = calculateRotation(landmarks[23], landmarks[25]);
                this.bones.leftUpperLeg.rotation.x = rotation.x;
                this.bones.leftUpperLeg.rotation.z = rotation.z;
            }
            
            if (landmarks[25] && landmarks[27]) { // left knee to left ankle
                const rotation = calculateRotation(landmarks[25], landmarks[27]);
                this.bones.leftLowerLeg.rotation.x = rotation.x;
                this.bones.leftLowerLeg.rotation.z = rotation.z;
            }
            
            if (landmarks[24] && landmarks[26]) { // right hip to right knee
                const rotation = calculateRotation(landmarks[24], landmarks[26]);
                this.bones.rightUpperLeg.rotation.x = rotation.x;
                this.bones.rightUpperLeg.rotation.z = rotation.z;
            }
            
            if (landmarks[26] && landmarks[28]) { // right knee to right ankle
                const rotation = calculateRotation(landmarks[26], landmarks[28]);
                this.bones.rightLowerLeg.rotation.x = rotation.x;
                this.bones.rightLowerLeg.rotation.z = rotation.z;
            }

            // Head/neck
            if (landmarks[0] && landmarks[11] && landmarks[12]) { // nose and shoulders
                const leftShoulder = landmarks[11];
                const rightShoulder = landmarks[12];
                const shoulderCenter = {
                    x: (leftShoulder.x + rightShoulder.x) / 2,
                    y: (leftShoulder.y + rightShoulder.y) / 2,
                    z: (leftShoulder.z + rightShoulder.z) / 2
                };
                
                const neckRotation = calculateRotation(shoulderCenter, landmarks[0]);
                this.bones.neck.rotation.x = neckRotation.x;
                this.bones.neck.rotation.z = neckRotation.z;
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