import { Suspense, type ComponentType } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

type V = [number, number, number];
type PersonProps = {
  p: V;
  yaw?: number;
  pose?: "talk" | "phone" | "sit";
  shirt?: string;
  animate?: boolean;
  phase?: number;
};
const box = new THREE.BoxGeometry(1, 1, 1);
const ball = new THREE.SphereGeometry(1, 10, 6);
const tube = new THREE.CylinderGeometry(1, 1, 1, 10);
const surfaces = new Map<string, THREE.MeshStandardMaterial>();
function surface(color: string, glow = false) {
  const key = `${color}:${glow}`;
  if (!surfaces.has(key))
    surfaces.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.72,
        emissive: glow ? color : "#000000",
        emissiveIntensity: glow ? 1.3 : 0,
      }),
    );
  return surfaces.get(key)!;
}
function Part({
  p,
  s,
  c = "#e3ddce",
  glow = false,
  shape = "box",
}: {
  p: V;
  s: V;
  c?: string;
  glow?: boolean;
  shape?: "box" | "ball" | "tube";
}) {
  return (
    <mesh
      position={p}
      scale={s}
      geometry={shape === "ball" ? ball : shape === "tube" ? tube : box}
      material={surface(c, glow)}
      castShadow={!glow}
      receiveShadow
      dispose={null}
    />
  );
}
function Sign({
  p,
  text,
  size = 0.36,
  color = "#fff1d1",
  rotation = 0,
}: {
  p: V;
  text: string;
  size?: number;
  color?: string;
  rotation?: number;
}) {
  return (
    <Suspense fallback={null}>
      <Text
        position={p}
        rotation={[0, rotation, 0]}
        font="/fonts/Syne-Regular.ttf"
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={7.5}
        textAlign="center"
      >
        {text}
      </Text>
    </Suspense>
  );
}
function Cable({ a, b }: { a: V; b: V }) {
  const av = new THREE.Vector3(...a),
    bv = new THREE.Vector3(...b),
    direction = bv.clone().sub(av);
  return (
    <mesh
      position={av.add(bv).multiplyScalar(0.5)}
      quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize(),
      )}
      scale={[0.025, direction.length(), 0.025]}
      geometry={tube}
      material={surface("#393c38")}
      dispose={null}
    />
  );
}
function Festoon({ z, width = 21 }: { z: number; width?: number }) {
  const points = Array.from(
    { length: 13 },
    (_, i) =>
      [
        -width / 2 + (i * width) / 12,
        5.8 - Math.sin((i / 12) * Math.PI) * 0.65,
        z,
      ] as V,
  );
  return (
    <group>
      {[-1, 1].map((side) => (
        <Part
          key={side}
          p={[(side * width) / 2, 2.9, z]}
          s={[0.075, 5.8, 0.075]}
          c="#55483b"
          shape="tube"
        />
      ))}
      {points.slice(1).map((p, i) => (
        <Cable key={i} a={points[i]} b={p} />
      ))}
      {points.map((p, i) => (
        <Part
          key={i}
          p={[p[0], p[1] - 0.12, p[2]]}
          s={[0.105, 0.15, 0.105]}
          c="#ffd38d"
          shape="ball"
          glow
        />
      ))}
    </group>
  );
}
function DiningTable({
  p,
  Person,
  occupied = true,
}: {
  p: V;
  Person: ComponentType<PersonProps>;
  occupied?: boolean;
}) {
  return (
    <group position={p}>
      <Part p={[0, 0.82, 0]} s={[0.85, 0.12, 0.85]} shape="tube" c="#ae8053" />
      <Part p={[0, 0.4, 0]} s={[0.09, 0.8, 0.09]} shape="tube" c="#443e35" />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.25, 0, 0]}>
          <Part p={[0, 0.43, 0]} s={[0.56, 0.12, 0.56]} c="#b69063" />
          <Part
            p={[0, 0.2, 0]}
            s={[0.07, 0.4, 0.07]}
            shape="tube"
            c="#443e35"
          />
          {occupied && (
            <Person
              p={[0, 0.02, 0]}
              yaw={(-side * Math.PI) / 2}
              pose="sit"
              shirt={side > 0 ? "#ba815e" : "#657f83"}
            />
          )}
        </group>
      ))}
      {occupied && (
        <>
          <Part
            p={[0.25, 0.94, 0]}
            s={[0.12, 0.08, 0.12]}
            shape="tube"
            c="#ede4cc"
          />
          <Part
            p={[-0.28, 1, 0]}
            s={[0.07, 0.24, 0.07]}
            shape="tube"
            c="#b2c5b4"
          />
        </>
      )}
    </group>
  );
}
function FoodStall({
  p,
  yaw,
  title,
  color,
  Person,
}: {
  p: V;
  yaw: number;
  title: string;
  color: string;
  Person: ComponentType<PersonProps>;
}) {
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <Part p={[0, 0.16, 0]} s={[6, 0.24, 4.5]} c="#927454" />
      <Part p={[0, 1.8, -1.95]} s={[5.6, 3.25, 0.12]} c={color} />
      {[-2.8, 2.8].flatMap((x) =>
        [-1.9, 1.9].map((z) => (
          <Part
            key={`${x}${z}`}
            p={[x, 1.85, z]}
            s={[0.075, 3.4, 0.075]}
            shape="tube"
            c="#cfbf9e"
          />
        )),
      )}
      <mesh
        position={[0, 4.05, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[1, 0.7, 0.76]}
        castShadow
      >
        <coneGeometry args={[4.35, 1.7, 4]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Part p={[0, 3.45, 2]} s={[6, 0.65, 0.1]} c={color} />
      <Sign p={[0, 3.45, 2.07]} text={title} size={0.42} />
      <Part p={[0, 1, 1.25]} s={[5.3, 1.55, 0.85]} c="#c89e70" />
      <Part p={[0, 1.83, 1.25]} s={[5.5, 0.12, 1]} c="#e8d4b1" />
      <Part
        p={[-1.6, 2.11, 1.1]}
        s={[0.32, 0.48, 0.32]}
        shape="tube"
        c="#899796"
      />
      <Part
        p={[-1.6, 2.37, 1.1]}
        s={[0.35, 0.06, 0.35]}
        shape="tube"
        c="#d3d4be"
      />
      {[0, 0.6, 1.2].map((x) => (
        <Part
          key={x}
          p={[x, 1.96, 1.35]}
          s={[0.17, 0.1, 0.17]}
          shape="tube"
          c="#efe4cb"
        />
      ))}
      <Part p={[0, 3.08, 1.4]} s={[3.6, 0.06, 0.08]} c="#ffdc99" glow />
      <Person p={[0.4, 0.3, 0.05]} shirt="#bda976" />
      <Person p={[-0.5, 0.3, 2.8]} yaw={Math.PI} shirt="#678490" />
    </group>
  );
}
function FoodBazaar({
  Person,
  low,
  level,
}: {
  Person: ComponentType<PersonProps>;
  low: boolean;
  level: number;
}) {
  const stalls = [
    "SATE NUSANTARA",
    "BAKSO HANGAT",
    "NASI GORENG",
    "SIOMAY BANDUNG",
    "MARTABAK",
    "ES & JAJANAN",
  ];
  return (
    <group name="food-bazaar" position={[-29, 0.16, 63]}>
      <Part p={[0, 0, 0]} s={[23, 0.12, 27]} c="#756b54" />
      {stalls.map((title, i) => (
        <FoodStall
          key={title}
          p={[i < 3 ? -7.9 : 7.9, 0, -8 + (i % 3) * 8]}
          yaw={i < 3 ? Math.PI / 2 : -Math.PI / 2}
          title={title}
          color={["#984f37", "#496c59", "#b08644"][i % 3]}
          Person={Person}
        />
      ))}
      {[-7, 0, 7].map((z) => (
        <DiningTable key={z} p={[0, 0.1, z]} Person={Person} />
      ))}
      {[-11, 11].map((z) => (
        <Festoon key={z} z={z} />
      ))}
      <Part p={[0, 4.7, -12.9]} s={[12, 0.9, 0.2]} c="#5f4835" />
      <Sign
        p={[0, 4.7, -13.04]}
        text="BAZAR KULINER"
        size={0.65}
        rotation={Math.PI}
      />
      <Sign p={[0, 4.7, -12.77]} text="BAZAR KULINER" size={0.65} />
      {[-1, 1].map((side) => (
        <Person
          key={side}
          p={[side * 2.8, 0.1, -10]}
          yaw={side}
          shirt={side > 0 ? "#c4a381" : "#817a96"}
        />
      ))}
      <pointLight
        position={[0, 5, 0]}
        color="#ffd5a0"
        intensity={level * (low ? 300 : 550)}
        distance={26}
        decay={2}
      />
    </group>
  );
}
function DemoScreen({
  p,
  accent,
  width = 3.3,
}: {
  p: V;
  accent: string;
  width?: number;
}) {
  return (
    <group position={p}>
      <Part p={[0, 0, 0]} s={[width, 1.9, 0.16]} c="#151f2d" />
      <Part p={[0, 0, 0.09]} s={[width - 0.2, 1.68, 0.025]} c="#294e65" glow />
      <Part
        p={[-width * 0.29, 0, 0.11]}
        s={[width * 0.25, 1.4, 0.015]}
        c={accent}
        glow
      />
      {[0, 1, 2].map((i) => (
        <Part
          key={i}
          p={[width * 0.12, 0.48 - i * 0.43, 0.12]}
          s={[width * 0.45, 0.15, 0.02]}
          c={i === 0 ? "#e6eddf" : "#82b4c0"}
          glow
        />
      ))}
    </group>
  );
}
function TechBooth({
  p,
  yaw,
  title,
  accent,
  index,
  Person,
}: {
  p: V;
  yaw: number;
  title: string;
  accent: string;
  index: number;
  Person: ComponentType<PersonProps>;
}) {
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <Part p={[0, 0.22, 0]} s={[8, 0.3, 7]} c="#d3d9d6" />
      <Part p={[0, 0.4, 3.38]} s={[7.9, 0.06, 0.08]} c={accent} glow />
      <Part p={[0, 2.6, -3.1]} s={[7.8, 4.4, 0.18]} c="#e0e3db" />
      <Part p={[-2.85, 2.6, -2.97]} s={[1.8, 4.3, 0.08]} c={accent} />
      <Part p={[3.8, 2.3, -1.6]} s={[0.16, 3.8, 3]} c="#afbcbf" />
      {[-3.8, 3.8].flatMap((x) =>
        [-3.1, 3.1].map((z) => (
          <Part
            key={`${x}${z}`}
            p={[x, 2.6, z]}
            s={[0.13, 4.5, 0.13]}
            c="#485b67"
          />
        )),
      )}
      {[-3.1, 3.1].map((z) => (
        <Part key={z} p={[0, 4.8, z]} s={[8, 0.18, 0.2]} c="#485b67" />
      ))}
      {[-3.8, 3.8].map((x) => (
        <Part key={x} p={[x, 4.8, 0]} s={[0.2, 0.18, 6.4]} c="#485b67" />
      ))}
      <Part p={[0, 4.45, 3.13]} s={[7.8, 0.65, 0.14]} c="#243f50" />
      <Sign p={[0, 4.47, 3.22]} text={title} size={0.43} />
      <Part p={[0, 4.1, 3.25]} s={[7.7, 0.045, 0.05]} c={accent} glow />
      <Sign p={[-2.85, 3.85, -2.86]} text={`0${index + 1}`} size={0.65} />
      <Sign p={[-2.85, 2.8, -2.86]} text="RUANG\nKARYA" size={0.27} />
      <DemoScreen p={[0.65, 2.8, -2.84]} accent={accent} />
      <Part p={[-1.7, 1.03, 1.8]} s={[3.3, 1.3, 1.05]} c="#edf0e9" />
      <Part p={[-1.7, 1.72, 1.8]} s={[3.5, 0.1, 1.16]} c="#8fadae" />
      <Part p={[-1.7, 1.1, 2.34]} s={[2.4, 0.5, 0.025]} c={accent} />
      <Sign p={[-1.7, 1.1, 2.37]} text="COBA DEMO" size={0.23} />
      {[-2.4, -0.9].map((x) => (
        <group key={x}>
          <Part p={[x, 1.81, 1.8]} s={[0.8, 0.06, 0.5]} c="#34434e" />
          <Part p={[x, 2.09, 1.62]} s={[0.8, 0.55, 0.05]} c="#7dbdc6" glow />
        </group>
      ))}
      <Part p={[2.25, 1.05, 1.1]} s={[0.8, 1.3, 0.7]} c="#bbc7c8" />
      <DemoScreen p={[2.25, 2.2, 1.05]} accent={accent} width={1.4} />
      <Person p={[-1.5, 0.4, 0.6]} shirt="#4c7280" />
      <Person p={[-1.7, 0.4, 2.8]} yaw={Math.PI} shirt="#c7a87b" />
    </group>
  );
}
function TechExpo({
  Person,
  level,
  low,
}: {
  Person: ComponentType<PersonProps>;
  level: number;
  low: boolean;
}) {
  return (
    <group name="technology-expo" position={[29, 0.16, 63]}>
      <Part p={[0, 0.02, 0]} s={[23, 0.15, 27]} c="#3d5263" />
      <Part p={[0, 0.11, 0]} s={[2.7, 0.035, 26]} c="#b2bdba" />
      {[
        {
          p: [-5.9, 0, 7] as V,
          yaw: Math.PI,
          title: "WEB & MOBILE",
          accent: "#467dba",
        },
        {
          p: [5.9, 0, 7] as V,
          yaw: Math.PI,
          title: "AI LAB",
          accent: "#5f9d93",
        },
        {
          p: [-5.9, 0, -7] as V,
          yaw: 0,
          title: "SMART SYSTEMS",
          accent: "#6e79ab",
        },
        {
          p: [5.9, 0, -7] as V,
          yaw: 0,
          title: "CREATIVE STUDIO",
          accent: "#b58c5d",
        },
      ].map((booth, i) => (
        <TechBooth key={booth.title} {...booth} index={i} Person={Person} />
      ))}
      {[-10, 10].map((x) => (
        <Part key={x} p={[x, 3.1, -12.7]} s={[0.2, 6, 0.2]} c="#526c7a" />
      ))}
      <Part p={[0, 5.9, -12.7]} s={[20, 0.95, 0.25]} c="#243f50" />
      <Sign
        p={[0, 5.92, -12.86]}
        text="MALAM TEKNOLOGI"
        size={0.66}
        rotation={Math.PI}
      />
      <Sign p={[0, 5.92, -12.54]} text="MALAM TEKNOLOGI" size={0.66} />
      <Part p={[0, 5.36, -12.7]} s={[20, 0.07, 0.3]} c="#87c9e2" glow />
      <Person p={[1, 0.3, -1.5]} pose="phone" shirt="#a27f64" />
      <Person p={[-3, 0.3, 1]} yaw={0.8} shirt="#9aaf9d" />
      <Person p={[-2, 0.3, 2]} yaw={-2.3} shirt="#b08e71" />
      <pointLight
        position={[0, 6.2, 0]}
        color="#b5d9ff"
        intensity={level * (low ? 180 : 260)}
        distance={27}
        decay={2}
      />
    </group>
  );
}
function FoodShops({
  Person,
  level,
  low,
  open,
}: {
  Person: ComponentType<PersonProps>;
  level: number;
  low: boolean;
  open: boolean;
}) {
  return (
    <group
      name="monas-food-shops"
      position={[65, 0, 82]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <Part p={[0, 0.02, 2.7]} s={[38, 0.15, 15]} c="#b2aa96" />
      {["BAKSO PAK RO", "SATE NUSANTARA", "MARTABAK KOTA", "KOPI SENJA"].map(
        (title, i) => (
          <group key={title} position={[-13.5 + i * 9, 0, 0]}>
            <Part
              p={[0, 4, 0]}
              s={[8.7, 8, 7]}
              c={["#b09d80", "#b1b6a5", "#c2aa84", "#9caaa3"][i]}
            />
            <Part p={[0, 1.9, 3.54]} s={[7.7, 3.4, 0.1]} c="#3e4c46" />
            {!open && (
              <group name="closed-shop-shutter">
                <Part p={[0, 1.9, 3.64]} s={[7.5, 3.35, 0.1]} c="#8e9690" />
                {Array.from({ length: 12 }, (_, row) => (
                  <Part
                    key={row}
                    p={[0, 0.4 + row * 0.26, 3.71]}
                    s={[7.5, 0.045, 0.035]}
                    c="#6f7b75"
                  />
                ))}
                <Part p={[0, 2.2, 3.77]} s={[2.4, 0.65, 0.07]} c="#354d43" />
                <Sign p={[0, 2.2, 3.83]} text="BUKA 18.00" size={0.26} />
              </group>
            )}
            {[-2.2, 2.2].map((x) => (
              <group key={x}>
                <Part
                  p={[x, 5.9, 3.53]}
                  s={[2.1, 2.2, 0.12]}
                  c={open ? "#d3b97b" : "#718e91"}
                  glow={open}
                />
                <Part p={[x, 5.9, 3.61]} s={[0.08, 2.2, 0.08]} c="#677368" />
              </group>
            ))}
            <Part
              p={[0, 3.8, 4.2]}
              s={[8.8, 0.2, 2.2]}
              c={["#667b55", "#ab6846", "#a68948", "#4f7067"][i]}
            />
            <Part p={[0, 4.4, 3.64]} s={[8, 0.8, 0.16]} c="#354d43" />
            <Sign p={[0, 4.4, 3.75]} text={title} size={0.4} />
            <Part
              p={[0, 3.47, 4.2]}
              s={[6, 0.06, 0.1]}
              c={open ? "#ffd99a" : "#cccbb9"}
              glow={open}
            />
            {open && (
              <>
                <Part p={[0, 1.1, 3.9]} s={[4.5, 1.55, 0.9]} c="#b38a5e" />
                <Part p={[0, 1.93, 3.9]} s={[4.7, 0.12, 1.05]} c="#d8cbb0" />
                <Part
                  p={[-1.3, 2.2, 3.85]}
                  s={[0.35, 0.45, 0.35]}
                  c="#9eada6"
                  shape="tube"
                />
                <Person p={[1, 0, 2.6]} shirt="#978066" />
              </>
            )}
            <DiningTable p={[0, 0.15, 7]} Person={Person} occupied={open} />
            <Part p={[0, 8.15, 0]} s={[9, 0.3, 7.4]} c="#79654d" />
          </group>
        ),
      )}
      {open &&
        [-9, 9].map((x) => (
          <pointLight
            key={x}
            position={[x, 5, 5]}
            color="#ffd599"
            intensity={level * (low ? 170 : 250)}
            distance={29}
            decay={2}
          />
        ))}
    </group>
  );
}

export default function NightMarket({
  hour,
  night,
  low,
  Person,
}: {
  hour: number;
  night: number;
  low: boolean;
  Person: ComponentType<PersonProps>;
}) {
  const open = hour >= 18;
  const level = 0.4 + night * 0.6;
  return (
    <group name="monas-night-event">
      {open && (
        <>
          <FoodBazaar Person={Person} low={low} level={level} />
          <TechExpo Person={Person} low={low} level={level} />
        </>
      )}
      <FoodShops Person={Person} low={low} level={level} open={open} />
    </group>
  );
}
