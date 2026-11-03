import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export interface VisitorProps {
  position: [number, number, number];
  rotationY?: number;
  lookAtTarget?: [number, number];
  role?: "staff" | "visitor";
  coatColor?: string;
  trouserColor?: string;
  skinColor?: string;
  hairColor?: string;
  reduced: boolean;
  low: boolean;
  inLobby?: boolean;
  greetingOpen?: boolean;
  onGreet?: () => void;
  phaseOffset?: number;
  canInteract?: () => boolean;
}

const headGeo = new THREE.SphereGeometry(0.115, 18, 18);
const neckGeo = new THREE.CylinderGeometry(0.042, 0.048, 0.09, 12);
const torsoGeo = new THREE.BoxGeometry(0.34, 0.56, 0.2);
const hipGeo = new THREE.BoxGeometry(0.31, 0.14, 0.19);
const legGeo = new THREE.BoxGeometry(0.115, 0.72, 0.13);
const shoeGeo = new THREE.BoxGeometry(0.12, 0.07, 0.22);
const upperArmGeo = new THREE.BoxGeometry(0.09, 0.3, 0.095);
const foreArmGeo = new THREE.BoxGeometry(0.08, 0.27, 0.085);
const strapGeo = new THREE.BoxGeometry(0.016, 0.22, 0.008);
const badgeGeo = new THREE.BoxGeometry(0.055, 0.078, 0.01);
const noseGeo = new THREE.BoxGeometry(0.022, 0.038, 0.028);

export function Visitor({
  position,
  rotationY = 0,
  lookAtTarget,
  role = "visitor",
  coatColor = "#5e6256",
  trouserColor = "#3b3e36",
  skinColor = "#d9c2a9",
  hairColor = "#2e2c28",
  reduced,
  low,
  inLobby = false,
  greetingOpen = false,
  onGreet,
  phaseOffset = 0,
  canInteract,
}: VisitorProps) {
  const computedRotationY = lookAtTarget
    ? Math.atan2(lookAtTarget[0] - position[0], lookAtTarget[1] - position[2])
    : rotationY;

  const rootRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForeArmRef = useRef<THREE.Group>(null);
  const greetTimer = useRef(0);
  const hasGreetedOnEntry = useRef(false);

  useEffect(() => {
    if (role !== "staff") return;
    if (inLobby && !hasGreetedOnEntry.current && !reduced) {
      hasGreetedOnEntry.current = true;
      greetTimer.current = 2.4;
    } else if (!inLobby) {
      hasGreetedOnEntry.current = false;
      greetTimer.current = 0;
    }
  }, [inLobby, role, reduced]);

  useFrame(({ clock }, delta) => {
    if (reduced || low) {
      if (rootRef.current) rootRef.current.position.y = position[1];
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = 0;
        headGroupRef.current.rotation.x = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.06;
        rightArmRef.current.rotation.z = -0.06;
      }
      if (rightForeArmRef.current) {
        rightForeArmRef.current.rotation.x = -0.18;
      }
      return;
    }

    const t = clock.getElapsedTime() + phaseOffset;
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.7) * 0.009;
    }

    if (role === "staff" && greetTimer.current > 0) {
      greetTimer.current = Math.max(0, greetTimer.current - delta);
      const progress = 1 - greetTimer.current / 2.4;
      const envelope = Math.sin(progress * Math.PI);
      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = envelope * 0.14;
        headGroupRef.current.rotation.y =
          Math.sin(progress * Math.PI * 2) * 0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.55 * envelope;
        rightArmRef.current.rotation.z = -0.22 * envelope;
      }
      if (rightForeArmRef.current) {
        rightForeArmRef.current.rotation.x =
          -0.85 * envelope + Math.sin(t * 6.5) * 0.15 * envelope;
      }
    } else {
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = Math.sin(t * 0.65) * 0.06;
        headGroupRef.current.rotation.x = -0.04 + Math.sin(t * 0.9) * 0.025;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.06 + Math.sin(t * 1.1) * 0.02;
        rightArmRef.current.rotation.z = -0.06;
      }
      if (rightForeArmRef.current) {
        rightForeArmRef.current.rotation.x = -0.18;
      }
    }
  });

  const interactiveProps =
    role === "staff" && onGreet
      ? {
          onClick: (e: { stopPropagation: () => void }) => {
            if (canInteract && !canInteract()) return;
            e.stopPropagation();
            if (!reduced) greetTimer.current = 2.0;
            onGreet();
          },
          onPointerOver: () => {
            document.body.style.cursor = "pointer";
          },
          onPointerOut: () => {
            document.body.style.cursor = "auto";
          },
        }
      : {};

  const cast = !low;

  return (
    <group
      ref={rootRef}
      position={position}
      rotation={[0, computedRotationY, 0]}
      {...interactiveProps}
    >
      {/* Shoes pointing forward (+Z) */}
      <mesh
        position={[-0.085, 0.035, 0.035]}
        geometry={shoeGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color="#2a2925" roughness={0.9} />
      </mesh>
      <mesh
        position={[0.085, 0.035, 0.035]}
        geometry={shoeGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color="#2a2925" roughness={0.9} />
      </mesh>

      {/* Legs */}
      <mesh
        position={[-0.085, 0.43, 0]}
        geometry={legGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color={trouserColor} roughness={0.88} />
      </mesh>
      <mesh
        position={[0.085, 0.43, 0]}
        geometry={legGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color={trouserColor} roughness={0.88} />
      </mesh>

      {/* Hips */}
      <mesh
        position={[0, 0.84, 0]}
        geometry={hipGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color={trouserColor} roughness={0.88} />
      </mesh>

      {/* Torso */}
      <mesh
        position={[0, 1.18, 0]}
        geometry={torsoGeo}
        castShadow={cast}
        receiveShadow={cast}
      >
        <meshStandardMaterial color={coatColor} roughness={0.85} />
      </mesh>

      {/* Front collar / lapel accent on chest (+Z) */}
      <mesh position={[0, 1.38, 0.102]}>
        <boxGeometry args={[0.1, 0.12, 0.006]} />
        <meshStandardMaterial color="#e8e2d4" roughness={0.85} />
      </mesh>

      {/* Staff Lanyard & Badge differentiator on front chest (+Z) */}
      {role === "staff" && (
        <group position={[0, 1.32, 0.105]}>
          <mesh
            position={[-0.028, 0.02, 0]}
            rotation={[0, 0, 0.22]}
            geometry={strapGeo}
          >
            <meshStandardMaterial color="#a34c34" roughness={0.75} />
          </mesh>
          <mesh
            position={[0.028, 0.02, 0]}
            rotation={[0, 0, -0.22]}
            geometry={strapGeo}
          >
            <meshStandardMaterial color="#a34c34" roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.11, 0.004]} geometry={badgeGeo}>
            <meshStandardMaterial color="#f6f2e6" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Left Arm */}
      <group position={[-0.22, 1.41, 0]} rotation={[0.05, 0, 0.06]}>
        <mesh
          position={[0, -0.14, 0]}
          geometry={upperArmGeo}
          castShadow={cast}
        >
          <meshStandardMaterial color={coatColor} roughness={0.85} />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[-0.16, 0, 0]}>
          <mesh
            position={[0, -0.12, 0]}
            geometry={foreArmGeo}
            castShadow={cast}
          >
            <meshStandardMaterial color={coatColor} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.27, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group
        ref={rightArmRef}
        position={[0.22, 1.41, 0]}
        rotation={[0.06, 0, -0.06]}
      >
        <mesh
          position={[0, -0.14, 0]}
          geometry={upperArmGeo}
          castShadow={cast}
        >
          <meshStandardMaterial color={coatColor} roughness={0.85} />
        </mesh>
        <group
          ref={rightForeArmRef}
          position={[0, -0.28, 0]}
          rotation={[-0.18, 0, 0]}
        >
          <mesh
            position={[0, -0.12, 0]}
            geometry={foreArmGeo}
            castShadow={cast}
          >
            <meshStandardMaterial color={coatColor} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.27, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Neck & Head */}
      <group ref={headGroupRef} position={[0, 1.47, 0]}>
        <mesh position={[0, 0.04, 0]} geometry={neckGeo} castShadow={cast}>
          <meshStandardMaterial color={skinColor} roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.165, 0]} geometry={headGeo} castShadow={cast}>
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Nose relief on the front face (+Z) so gaze direction is unmistakable */}
        <mesh position={[0, 0.16, 0.112]} geometry={noseGeo}>
          <meshStandardMaterial color={skinColor} roughness={0.78} />
        </mesh>
        {/* Hair cap covering the back (-Z) and crown of the head */}
        <mesh
          position={[0, 0.195, -0.028]}
          rotation={[-0.35, 0, 0]}
          scale={[1.02, 0.92, 0.96]}
          geometry={headGeo}
        >
          <meshStandardMaterial color={hairColor} roughness={0.92} />
        </mesh>
      </group>

      {/* Staff optional greeting speech bubble when selected */}
      {role === "staff" && greetingOpen && (
        <Html position={[0, 1.98, 0]} center>
          <div className="staff-greeting paper" role="status">
            <span>
              Selamat datang. Silakan lihat denah atau buka katalog museum.
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
