import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

type V = [number, number, number];
const cube = new THREE.BoxGeometry(1, 1, 1);
const sphere = new THREE.SphereGeometry(1, 12, 8);
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 12);
const materials = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string) {
  if (!materials.has(color))
    materials.set(
      color,
      new THREE.MeshStandardMaterial({ color, roughness: 0.82 }),
    );
  return materials.get(color)!;
}
function Block({
  p,
  s,
  c,
  rotation = [0, 0, 0],
}: {
  p: V;
  s: V;
  c: string;
  rotation?: V;
}) {
  return (
    <mesh
      position={p}
      scale={s}
      rotation={rotation}
      geometry={cube}
      material={mat(c)}
      castShadow
      receiveShadow
    />
  );
}
function Ball({ p, s, c }: { p: V; s: V; c: string }) {
  return (
    <mesh
      position={p}
      scale={s}
      geometry={sphere}
      material={mat(c)}
      castShadow
    />
  );
}
function Rod({ a, b, r, c }: { a: V; b: V; r: number; c: string }) {
  const av = new THREE.Vector3(...a),
    bv = new THREE.Vector3(...b),
    d = bv.clone().sub(av);
  return (
    <mesh
      position={av.add(bv).multiplyScalar(0.5)}
      quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        d.clone().normalize(),
      )}
      scale={[r, d.length(), r]}
      geometry={cylinder}
      material={mat(c)}
      castShadow
    />
  );
}
function Label({
  p,
  text,
  size = 0.25,
  color = "#f4eddd",
  rotation = [0, 0, 0],
}: {
  p: V;
  text: string;
  size?: number;
  color?: string;
  rotation?: V;
}) {
  return (
    <Suspense fallback={null}>
      <Text
        position={p}
        rotation={rotation}
        font="/fonts/Syne-Regular.ttf"
        fontSize={size}
        color={color}
        anchorX="center"
        maxWidth={8}
      >
        {text}
      </Text>
    </Suspense>
  );
}

// Shared instancing keeps paving and facade details inexpensive.
function RepeatedBlocks({
  items,
  color,
}: {
  items: { p: V; s: V }[];
  color: string;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    items.forEach((v, i) => {
      dummy.position.set(...v.p);
      dummy.scale.set(...v.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      ref={ref}
      args={[cube, mat(color), items.length]}
      receiveShadow
    />
  );
}

function ShadeTree({
  x,
  z,
  seed = 0,
}: {
  x: number;
  z: number;
  seed?: number;
}) {
  return (
    <group position={[x, 0, z]}>
      <Block p={[0, 0.18, 0]} s={[2.6, 0.36, 2.6]} c="#8c8877" />
      <Block p={[0, 0.38, 0]} s={[2.3, 0.12, 2.3]} c="#69704e" />
      <Rod a={[0, 0.4, 0]} b={[0.15, 3.8, 0]} r={0.17} c="#6c5842" />
      {[-1, 1].map((sign) => (
        <Rod
          key={sign}
          a={[0.1, 2.5, 0]}
          b={[sign * 0.9, 4.2, 0.35]}
          r={0.09}
          c="#6c5842"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const a = i * 2.4 + seed;
        return (
          <Ball
            key={i}
            p={[
              Math.cos(a) * (i === 0 ? 0 : 1.1),
              4.4 + (i % 3) * 0.35,
              Math.sin(a) * 1.1,
            ]}
            s={[1.35, 0.95, 1.2]}
            c={["#526a3e", "#667e48", "#74864e"][i % 3]}
          />
        );
      })}
    </group>
  );
}
function Palm({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Rod a={[0, 0, 0]} b={[0.2, 5, 0]} r={0.12} c="#87745a" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <Rod a={[0.2, 4.9, 0]} b={[1.35, 5.5, 0]} r={0.035} c="#687b3c" />
            <mesh
              position={[1.2, 5.05, 0]}
              rotation={[0, 0, -0.3]}
              scale={[1.5, 0.12, 0.35]}
              geometry={sphere}
              material={mat("#60763e")}
            />
          </group>
        );
      })}
    </group>
  );
}

type Pose = "talk" | "phone" | "sit" | "ride";
function Citizen({
  p,
  yaw = 0,
  pose = "talk",
  shirt = "#b9825d",
  phase = 0,
  animate = false,
}: {
  p: V;
  yaw?: number;
  pose?: Pose;
  shirt?: string;
  phase?: number;
  animate?: boolean;
}) {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (head.current && animate)
      head.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.7 + phase) * 0.09;
  });
  const seated = pose === "sit" || pose === "ride";
  const hip = seated ? 0.55 : 0.87;
  const shoulder = hip + 0.49;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <Block p={[0, hip + 0.25, 0]} s={[0.4, 0.53, 0.23]} c={shirt} />
      <Block p={[0, hip - 0.03, 0]} s={[0.34, 0.16, 0.23]} c="#354047" />
      <group ref={head} position={[0, shoulder + 0.15, 0]}>
        <Rod a={[0, -0.08, 0]} b={[0, 0.02, 0]} r={0.05} c="#ae7d58" />
        <Ball p={[0, 0.12, 0]} s={[0.13, 0.16, 0.13]} c="#be8d65" />
        <Ball
          p={[0, 0.19, -0.025]}
          s={[0.135, 0.11, 0.13]}
          c={pose === "ride" ? "#26352f" : "#292923"}
        />
        <Block p={[0, 0.11, 0.126]} s={[0.035, 0.05, 0.03]} c="#b47e57" />
        {pose === "ride" && (
          <Block p={[0, 0.13, 0.12]} s={[0.22, 0.09, 0.045]} c="#607474" />
        )}
      </group>
      {[-1, 1].map((side) => {
        const knee: V = seated
          ? [side * 0.13, hip - 0.06, 0.37]
          : [side * 0.12, 0.46, side * 0.04];
        const foot: V = seated
          ? [side * 0.13, 0.08, 0.39]
          : [side * 0.13, 0.07, side * 0.06];
        return (
          <group key={side}>
            <Rod a={[side * 0.12, hip, 0]} b={knee} r={0.075} c="#354047" />
            <Rod a={knee} b={foot} r={0.06} c="#354047" />
            <Block
              p={[foot[0], foot[1], foot[2] + 0.07]}
              s={[0.14, 0.12, 0.26]}
              c="#292e2b"
            />
          </group>
        );
      })}
      {[-1, 1].map((side) => {
        const elbow: V =
          pose === "phone" && side === 1
            ? [0.34, shoulder - 0.16, 0.12]
            : [side * 0.27, shoulder - 0.24, 0.06];
        const hand: V =
          pose === "phone" && side === 1
            ? [0.16, shoulder + 0.16, 0.08]
            : pose === "ride"
              ? [side * 0.25, shoulder - 0.2, 0.43]
              : pose === "sit"
                ? [side * 0.15, hip + 0.04, 0.34]
                : [side * 0.28, shoulder - 0.33, 0.3];
        return (
          <group key={side}>
            <Rod a={[side * 0.23, shoulder, 0]} b={elbow} r={0.065} c={shirt} />
            <Rod a={elbow} b={hand} r={0.045} c="#be8d65" />
            <Ball p={hand} s={[0.055, 0.065, 0.05]} c="#be8d65" />
          </group>
        );
      })}
      {pose === "phone" && (
        <Block
          p={[0.15, shoulder + 0.17, 0.1]}
          s={[0.05, 0.18, 0.08]}
          c="#222c2c"
        />
      )}
    </group>
  );
}
function Bench({
  p,
  yaw = 0,
  occupied = false,
}: {
  p: V;
  yaw?: number;
  occupied?: boolean;
}) {
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      {[0, 1, 2].map((i) => (
        <Block
          key={i}
          p={[0, 0.52, -0.18 + i * 0.18]}
          s={[2.4, 0.09, 0.14]}
          c="#876345"
        />
      ))}
      <Block p={[0, 0.88, -0.27]} s={[2.4, 0.4, 0.08]} c="#8f6b48" />
      {[-0.9, 0.9].map((x) => (
        <Block key={x} p={[x, 0.25, 0]} s={[0.1, 0.5, 0.5]} c="#414e49" />
      ))}
      {occupied && <Citizen p={[-0.45, 0.07, 0]} pose="sit" shirt="#b8ad8c" />}
    </group>
  );
}

function Wheel({ x, z, r = 0.34 }: { x: number; z: number; r?: number }) {
  return (
    <group position={[x, r, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh geometry={cylinder} scale={[r, 0.2, r]} material={mat("#202727")} />
      <mesh
        geometry={cylinder}
        scale={[r * 0.56, 0.215, r * 0.56]}
        material={mat("#adb4b0")}
      />
    </group>
  );
}
function Car({ color = "#dedbd0" }: { color?: string }) {
  return (
    <group>
      <RoundedBox
        args={[1.85, 0.62, 4.25]}
        radius={0.19}
        smoothness={2}
        position={[0, 0.72, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.36} metalness={0.22} />
      </RoundedBox>
      <Block p={[0, 0.43, 0]} s={[1.7, 0.13, 4]} c="#293534" />
      <RoundedBox
        args={[1.6, 0.75, 2.25]}
        radius={0.21}
        smoothness={2}
        position={[0, 1.27, -0.2]}
        castShadow
      >
        <meshStandardMaterial
          color="#527078"
          transparent
          opacity={0.62}
          roughness={0.19}
          metalness={0.25}
        />
      </RoundedBox>
      <Block p={[0, 1.68, -0.3]} s={[1.57, 0.11, 1.85]} c={color} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            p={[side * 0.79, 1.29, -0.27]}
            s={[0.07, 0.73, 0.09]}
            c={color}
          />
          <Block
            p={[side * 0.94, 1.18, 0.55]}
            s={[0.23, 0.14, 0.25]}
            c={color}
          />
          <Block
            p={[side * 0.55, 0.81, 2.14]}
            s={[0.47, 0.18, 0.04]}
            c="#f4e6bf"
          />
          <Block
            p={[side * 0.6, 0.8, -2.14]}
            s={[0.38, 0.16, 0.04]}
            c="#a53e2d"
          />
          <Wheel x={side * 0.91} z={1.28} />
          <Wheel x={side * 0.91} z={-1.25} />
        </group>
      ))}
      <Block p={[0, 0.62, 2.15]} s={[0.65, 0.16, 0.035]} c="#292d2c" />
      <Block p={[0, 0.88, 2.14]} s={[0.62, 0.17, 0.04]} c="#364442" />
      <Citizen p={[-0.38, 0.43, 0.02]} pose="ride" shirt="#b5aa8d" />
    </group>
  );
}
function Motorcycle() {
  return (
    <group>
      <Wheel x={0} z={0.72} r={0.29} />
      <Wheel x={0} z={-0.7} r={0.29} />
      <Rod a={[0, 0.3, -0.7]} b={[0, 0.6, 0.15]} r={0.09} c="#3d4647" />
      <Rod a={[0, 0.3, 0.72]} b={[0, 1, 0.53]} r={0.04} c="#969e96" />
      <Block p={[0, 0.62, -0.12]} s={[0.38, 0.24, 1.03]} c="#314f50" />
      <Block p={[0, 0.79, -0.2]} s={[0.4, 0.12, 0.72]} c="#282f2d" />
      <Block p={[0, 0.86, 0.55]} s={[0.42, 0.38, 0.22]} c="#697e70" />
      <Block p={[0, 0.95, 0.68]} s={[0.27, 0.13, 0.03]} c="#fae6b0" />
      <Rod a={[-0.32, 1.1, 0.52]} b={[0.32, 1.1, 0.52]} r={0.027} c="#333c37" />
      <Citizen p={[0, 0.32, -0.16]} pose="ride" shirt="#3c8058" />
    </group>
  );
}
function Traffic({
  kind,
  offset,
  lane,
  direction,
  color,
  moving,
}: {
  kind: "car" | "motor";
  offset: number;
  lane: number;
  direction: number;
  color?: string;
  moving: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const progress = useRef(offset);
  useFrame((_, dt) => {
    if (moving && ref.current) {
      progress.current = (progress.current + Math.min(dt, 0.05) * 3.1) % 180;
      ref.current.position.x = direction * (progress.current - 90);
    }
  });
  return (
    <group
      ref={ref}
      name={`traffic-${kind}`}
      position={[direction * (offset - 90), 0.04, lane]}
      rotation={[0, (direction * Math.PI) / 2, 0]}
    >
      {kind === "car" ? <Car color={color} /> : <Motorcycle />}
    </group>
  );
}

function Building({
  x,
  z,
  w,
  d,
  h,
  index,
}: {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  index: number;
}) {
  const windows = useMemo(() => {
    const list: { p: V; s: V }[] = [];
    for (let y = 3; y < h - 1; y += 2.7)
      for (let a = -w / 2 + 1; a < w / 2; a += 1.8) {
        list.push({ p: [a, y, d / 2 + 0.03], s: [1.25, 1.65, 0.06] });
        list.push({ p: [a, y, -d / 2 - 0.03], s: [1.25, 1.65, 0.06] });
      }
    for (let y = 3; y < h - 1; y += 2.7)
      for (let a = -d / 2 + 1; a < d / 2; a += 1.8)
        list.push({
          p: [x < 0 ? w / 2 + 0.03 : -w / 2 - 0.03, y, a],
          s: [0.06, 1.65, 1.25],
        });
    return list;
  }, [w, d, h, x]);
  return (
    <group position={[x, 0, z]}>
      <Block
        p={[0, h / 2, 0]}
        s={[w, h, d]}
        c={["#c4bba6", "#c5c9c2", "#a1b5b4", "#b7b2a5"][index % 4]}
      />
      <RepeatedBlocks
        items={windows}
        color={index % 2 ? "#657f83" : "#789494"}
      />
      <Block p={[0, h + 0.18, 0]} s={[w + 0.4, 0.36, d + 0.4]} c="#b6b7aa" />
      <Block p={[0, h + 0.9, 0]} s={[w * 0.5, 1.5, d * 0.5]} c="#8b9992" />
      {Array.from({ length: Math.floor(h / 8) }, (_, i) => (
        <Block
          key={i}
          p={[0, 2 + i * 8, d / 2 + 0.25]}
          s={[w + 0.3, 0.25, 0.5]}
          c="#d7d3c5"
        />
      ))}
      <Block p={[0, 1, d / 2 + 0.12]} s={[w * 0.7, 2, 0.2]} c="#526463" />
    </group>
  );
}
function Shop({
  x,
  title,
  color,
}: {
  x: number;
  title: string;
  color: string;
}) {
  return (
    <group position={[x, 0, 37]} rotation={[0, Math.PI, 0]}>
      <Block p={[0, 2.8, 0]} s={[9, 5.6, 7]} c={color} />
      <Block p={[0, 2.2, 3.55]} s={[7, 3.5, 0.1]} c="#526665" />
      <Block p={[0, 3.9, 4.2]} s={[9.4, 0.2, 2]} c="#956444" />
      <Block p={[0, 4.6, 3.58]} s={[8, 0.9, 0.1]} c="#354b43" />
      <Label p={[0, 4.6, 3.66]} text={title} size={0.38} />
      <Block p={[0, 5.8, 0]} s={[9.5, 0.4, 7.5]} c="#785b48" />
      {[-2.5, 0, 2.5].map((x) => (
        <Block key={x} p={[x, 1.6, 3.68]} s={[0.1, 3.1, 0.1]} c="#cec3a7" />
      ))}
    </group>
  );
}
function StreetLamp({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Rod a={[0, 0, 0]} b={[0, 6, 0]} r={0.07} c="#4b5752" />
      <Rod a={[0, 6, 0]} b={[0, 6.3, 1.8]} r={0.06} c="#4b5752" />
      <Block p={[0, 6.28, 1.9]} s={[0.4, 0.12, 0.85]} c="#e8e0bd" />
    </group>
  );
}

function MonasPark({ night }: { night: number }) {
  const flame = useMemo(() => {
    const geo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.7, 0.2),
        new THREE.Vector2(1.05, 1),
        new THREE.Vector2(0.8, 2),
        new THREE.Vector2(0.45, 3),
        new THREE.Vector2(0, 4.4),
      ],
      18,
    );
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) + Math.sin(y * 0.65) * y * 0.17);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  return (
    <group name="monas-park" position={[0, 0, 88]}>
      <Block p={[0, -0.13, 0]} s={[105, 0.3, 95]} c="#818e62" />
      <Block p={[0, 0.05, 0]} s={[38, 0.15, 34]} c="#c6bfab" />
      <Block p={[0, 0.03, -31]} s={[9, 0.12, 35]} c="#d1c8b2" />
      <Block p={[0, 0.03, 30]} s={[9, 0.12, 28]} c="#d1c8b2" />
      <Block p={[0, 0.03, 0]} s={[100, 0.1, 7]} c="#c6bfab" />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <group key={`${x}${z}`}>
            <Block p={[x * 29, 0.03, z * 25]} s={[24, 0.18, 29]} c="#70884f" />
            <Block p={[x * 42, 0.09, z * 24]} s={[1, 0.3, 30]} c="#4e703f" />
            <Block p={[x * 29, 0.09, z * 40]} s={[27, 0.3, 1]} c="#4e703f" />
          </group>
        )),
      )}
      <Block p={[-30, 0.1, 0]} s={[17, 0.3, 8]} c="#a59c87" />
      <Block p={[-30, 0.27, 0]} s={[15.8, 0.025, 6.8]} c="#658f8e" />
      {[0, 1, 2, 3].map((i) => (
        <Block
          key={i}
          p={[0, 0.18 + i * 0.23, 0]}
          s={[23 - i * 2, 0.3, 23 - i * 2]}
          c={i % 2 ? "#c8c0ab" : "#d7cfb9"}
        />
      ))}
      <Block p={[0, 2.1, 0]} s={[10, 2.5, 10]} c="#c6bea8" />
      <mesh
        position={[0, 4.1, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[9.4, 4.4, 2.3, 4]} />
        <meshStandardMaterial color="#ded7c2" roughness={0.65} />
      </mesh>
      <Block p={[0, 5.35, 0]} s={[13.7, 0.35, 13.7]} c="#e4ddc8" />
      <mesh position={[0, 20.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[1.18, 1.9, 30, 4]} />
        <meshStandardMaterial color="#e8e3d2" roughness={0.55} />
      </mesh>
      <Block p={[0, 35.6, 0]} s={[4.3, 0.55, 4.3]} c="#d6ccb5" />
      <Block p={[0, 36.3, 0]} s={[2.8, 0.9, 2.8]} c="#ac9c7b" />
      <mesh position={[0, 37, 0]} geometry={flame} castShadow>
        <meshStandardMaterial
          color="#d5a333"
          metalness={0.65}
          roughness={0.3}
          emissive="#b76c16"
          emissiveIntensity={night * 0.35}
        />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 0.4, 37, 0]}
          scale={[0.5, 0.8, 0.6]}
          rotation={[0, x * 0.9, x * 0.2]}
          geometry={flame}
        >
          <meshStandardMaterial
            color="#e4b94e"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      <Label
        p={[0, 1.9, -5.06]}
        rotation={[0, Math.PI, 0]}
        text="MONUMEN NASIONAL"
        size={0.4}
        color="#635b46"
      />
      {[-46, 46].flatMap((x) =>
        [-36, -18, 0, 18, 36].map((z, i) => (
          <ShadeTree key={`${x}${z}`} x={x} z={z} seed={i} />
        )),
      )}
      {[-34, -17, 17, 34].flatMap((x) =>
        [-44, 44].map((z) => <ShadeTree key={`${x}${z}`} x={x} z={z} />),
      )}
      {[-9, 9].map((x) => (
        <group key={x}>
          <Bench
            p={[x, 0.14, -25]}
            yaw={x < 0 ? Math.PI / 2 : -Math.PI / 2}
            occupied
          />
          <StreetLamp x={x} z={-16} />
        </group>
      ))}
      <Citizen p={[-5, 0.12, -24]} yaw={0.4} shirt="#baa17d" />
      <Citizen p={[-4, 0.12, -23]} yaw={-2.3} shirt="#5c7887" />
      <pointLight
        position={[0, 12, -10]}
        color="#ffce88"
        intensity={night * 150}
        distance={45}
        decay={2}
      />
    </group>
  );
}

export default function CityEnvironment({
  low,
  reduced,
  active,
  night,
}: {
  low: boolean;
  reduced: boolean;
  active: boolean;
  night: number;
}) {
  useEffect(() => {
    for (const color of [
      "#657f83",
      "#789494",
      "#e8e0bd",
      "#f4e6bf",
      "#fae6b0",
    ]) {
      const m = mat(color);
      m.emissive.set("#f2ba68");
      m.emissiveIntensity = night * (color === "#e8e0bd" ? 2 : 0.7);
    }
  }, [night]);
  const paving = useMemo(
    () =>
      Array.from({ length: 28 }, (_, x) =>
        Array.from({ length: 7 }, (_, z) => ({
          p: [-13 + x, 0.06, 8 + z] as V,
          s: [0.96, 0.06, 0.96] as V,
        })),
      ).flat(),
    [],
  );
  const curbs = useMemo(
    () =>
      Array.from({ length: 102 }, (_, i) => ({
        p: [-90 + i * 1.8, 0.12, 15.35] as V,
        s: [1.74, 0.24, 0.35] as V,
      })),
    [],
  );
  const motion = active && !reduced && !low;
  return (
    <group name="jakarta-neighborhood">
      {/* Carry terrain and roads beyond the fog cutoff so their ends never form a hard horizon. */}
      <Block p={[0, -0.4, 0]} s={[800, 0.5, 800]} c="#a1aa8b" />
      <Block p={[0, -0.04, 21]} s={[480, 0.12, 11.3]} c="#4b5251" />
      {[-19.5, 21].map((x) => (
        <Block key={x} p={[x, -0.04, -102]} s={[8, 0.12, 237]} c="#59605b" />
      ))}
      <Block p={[0, -0.12, -34]} s={[29, 0.35, 103]} c="#c6bda7" />
      <RepeatedBlocks items={paving} color="#c9c2b0" />
      <RepeatedBlocks items={curbs} color="#e2ded0" />
      <Block p={[0, 0.01, 29]} s={[480, 0.25, 4.5]} c="#b5b19f" />
      <Block p={[0, 0.15, 28]} s={[200, 0.025, 0.34]} c="#c9a34f" />
      {Array.from({ length: 33 }, (_, i) => (
        <Block
          key={i}
          p={[-94 + i * 6, 0.035, 21]}
          s={[2.7, 0.012, 0.13]}
          c="#dfdfcc"
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Block
          key={`z${i}`}
          p={[-4.5 + i, 0.04, 21]}
          s={[0.55, 0.015, 10]}
          c="#e2e1d6"
        />
      ))}
      {[-12, 12].flatMap((x) =>
        [1, -16, -34, -52, -72].map((z, i) => (
          <ShadeTree key={`${x}${z}`} x={x} z={z} seed={i} />
        )),
      )}
      {[-10, 10].map((x) => (
        <Palm key={x} x={x} z={12} />
      ))}
      {[
        [-9, 10],
        [9, 10],
        [-12, -9],
        [12, -9],
      ].map(([x, z], i) => (
        <Bench
          key={i}
          p={[x, 0.1, z]}
          yaw={i % 2 ? -Math.PI / 2 : Math.PI / 2}
          occupied={i < 2}
        />
      ))}
      {[-13, 14].flatMap((x) =>
        [-4, -28, -58].map((z) => <StreetLamp key={`${x}${z}`} x={x} z={z} />),
      )}
      {Array.from({ length: 12 }, (_, i) => (
        <Building
          key={i}
          x={i < 6 ? -35 : 42}
          z={-78 + (i % 6) * 16}
          w={11 + (i % 3) * 2}
          d={12}
          h={i % 3 === 0 ? 28 : i % 3 === 1 ? 18 : 35}
          index={i}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <Building
          key={`sky${i}`}
          x={-65 + i * 25}
          z={-112}
          w={13}
          d={13}
          h={25 + ((i * 7) % 25)}
          index={i}
        />
      ))}
      {[
        [-51, "WARUNG NUSANTARA", "#c4b193"],
        [-39, "KOPI KOTA", "#c8c1ac"],
        [43, "TOKO BUKU", "#b6bca8"],
        [55, "RUANG KREATIF", "#cdbda4"],
      ].map(([x, title, color]) => (
        <Shop
          key={x}
          x={Number(x)}
          title={String(title)}
          color={String(color)}
        />
      ))}
      {/* A small public-transport shelter, separate from the gallery entrance. */}
      <group position={[24, 0, 29]}>
        <Block p={[0, 3.1, 0]} s={[7, 0.2, 2.5]} c="#556f67" />
        {[-3, 3].map((x) => (
          <Block key={x} p={[x, 1.5, 0]} s={[0.12, 3, 0.12]} c="#59675f" />
        ))}
        <Block p={[0, 1.5, 1]} s={[6, 2.6, 0.06]} c="#9fb4ad" />
        <Label
          p={[0, 2.7, -1.27]}
          rotation={[0, Math.PI, 0]}
          text="HALTE · GALERI KOTA"
          size={0.22}
        />
        <Bench p={[0, 0, 0.3]} yaw={Math.PI} occupied />
      </group>
      <Citizen
        p={[-8.3, 0.12, 7.8]}
        yaw={0.7}
        shirt="#a96c4e"
        animate={motion}
      />
      <Citizen
        p={[-7.5, 0.12, 9.1]}
        yaw={-2.1}
        shirt="#627d84"
        animate={motion}
        phase={2}
      />
      <Citizen
        p={[-9.2, 0.12, 9.5]}
        yaw={2.4}
        shirt="#8c9066"
        animate={motion}
        phase={4}
      />
      <Citizen
        p={[9.4, 0.12, 5.5]}
        yaw={-1.1}
        pose="phone"
        shirt="#d2b38a"
        animate={motion}
      />
      <Citizen p={[11, 0.12, -8]} yaw={0.4} shirt="#768a68" animate={motion} />
      <Citizen
        p={[11.8, 0.12, -6.7]}
        yaw={-2.6}
        shirt="#ae7864"
        animate={motion}
        phase={3}
      />
      <Citizen
        p={[21.8, 0.17, 28.6]}
        yaw={2.8}
        pose="phone"
        shirt="#687f93"
        animate={motion}
      />
      {[25, 79, 135].map((offset, i) => (
        <Traffic
          key={`car${i}`}
          kind="car"
          offset={offset}
          lane={18.2}
          direction={1}
          color={["#e4dfcf", "#537f91", "#9c5343"][i]}
          moving={motion}
        />
      ))}
      {[42, 115].map((offset, i) => (
        <Traffic
          key={`op${i}`}
          kind="car"
          offset={offset}
          lane={23.8}
          direction={-1}
          color={["#bfc7c0", "#c4b287"][i]}
          moving={motion}
        />
      ))}
      {[58, 145].map((offset, i) => (
        <Traffic
          key={`bike${i}`}
          kind="motor"
          offset={offset}
          lane={25.5}
          direction={-1}
          moving={motion}
        />
      ))}
      <Traffic
        kind="motor"
        offset={102}
        lane={16.3}
        direction={1}
        moving={motion}
      />
      <MonasPark night={night} />
      {Array.from({ length: 8 }, (_, i) => (
        <Building
          key={`park-sky${i}`}
          x={-98 + i * 28}
          z={153 + (i % 2) * 8}
          w={14}
          d={12}
          h={15 + ((i * 7) % 19)}
          index={i + 2}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <ShadeTree key={`park-edge${i}`} x={-88 + i * 13.5} z={137} seed={i} />
      ))}
      {[-12, 12].map((x) => (
        <pointLight
          key={x}
          position={[x, 5, 6]}
          color="#ffcf8e"
          intensity={night * 35}
          distance={18}
          decay={2}
        />
      ))}
    </group>
  );
}
