import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Text as DreiText, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { lobbyViewpoints, placements, stations } from "./content";
import type { AiVisual, LobbyViewpointId, Project } from "./content";
import { Lobby } from "./components/Lobby";
import { AiVisualRoom } from "./components/AiVisualRoom";
import { GuestbookRoom } from "./components/GuestbookRoom";
import type { GuestbookEntry } from "./components/GuestbookRoom";
import { Visitor } from "./components/Visitor";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

function Box({
  position,
  scale,
  color = "#d6d0c2",
  ...props
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} receiveShadow castShadow {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Box position={[0, 1.2, 0]} scale={[0.22, 2.4, 0.22]} color="#675a44" />
      <mesh position={[0, 3, 0]} castShadow>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshStandardMaterial color="#69765c" roughness={1} />
      </mesh>
    </group>
  );
}

function City() {
  return (
    <group>
      <Box position={[0, -0.36, -24]} scale={[240, 0.5, 240]} color="#b7b8aa" />
      <Box position={[0, -0.04, 21]} scale={[200, 0.12, 11]} color="#676c68" />
      <Box
        position={[-19, -0.04, -26]}
        scale={[9, 0.12, 130]}
        color="#676c68"
      />
      <Box position={[20, -0.04, -26]} scale={[9, 0.12, 130]} color="#676c68" />
      {Array.from({ length: 30 }, (_, i) => (
        <Box
          key={`road${i}`}
          position={[-85 + i * 6, 0.03, 21]}
          scale={[2.8, 0.01, 0.12]}
          color="#ded9bd"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Box
          key={`cross${i}`}
          position={[-9 + i * 0.85, 0.04, 21]}
          scale={[0.4, 0.02, 8]}
          color="#e8e5d9"
        />
      ))}
      <Box position={[0, -0.12, -34]} scale={[27, 0.35, 104]} color="#d3cebd" />
      {Array.from({ length: 22 }, (_, i) => {
        const x = i < 11 ? -30 - (i % 3) * 10 : 32 + (i % 3) * 11;
        const z = -82 + (i % 11) * 14;
        const h = 10 + ((i * 17) % 33);
        return (
          <group key={i}>
            <Box
              position={[x, h / 2, z]}
              scale={[7, h, 8]}
              color={["#909e9e", "#a7aaa3", "#c4c3b8", "#718787"][i % 4]}
            />
            <Box position={[x, h + 0.5, z]} scale={[5, 1, 6]} color="#c1c4bb" />
            {Array.from({ length: Math.floor(h / 3) }, (_, j) => (
              <Box
                key={j}
                position={[x, j * 3 + 2, z + 4.02]}
                scale={[6, 0.95, 0.04]}
                color="#657b7d"
              />
            ))}
          </group>
        );
      })}
      {/* Stylized Jakarta skyline cue, a fictional urban composition. */}
      <group position={[5, 0, -108]}>
        <Box position={[0, 2, 0]} scale={[9, 4, 9]} color="#d8d4bf" />
        <Box position={[0, 15, 0]} scale={[1.5, 24, 1.5]} color="#e6e0cc" />
        <mesh position={[0, 28, 0]}>
          <octahedronGeometry args={[1.4]} />
          <meshStandardMaterial
            color="#bb8b35"
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      </group>
      {[-12, 12].flatMap((x) =>
        [12, -4, -20, -36, -52, -68, -80].map((z) => (
          <Tree key={`${x}${z}`} x={x} z={z} />
        )),
      )}
      <group position={[8, 0.35, 22]}>
        <Box position={[0, 0.4, 0]} scale={[2, 1, 5]} color="#d7ded7" />
        <Box position={[0, 1, 0]} scale={[1.8, 0.55, 3]} color="#32556a" />
      </group>
      <group position={[-9, 0.35, 18]}>
        <Box position={[0, 0.4, 0]} scale={[1.8, 0.8, 3.6]} color="#ac5e43" />
        <Box position={[0, 1, 0]} scale={[1.5, 0.5, 2]} color="#556c72" />
      </group>
    </group>
  );
}

function Building() {
  return (
    <group>
      {/* Main gallery floor slab spanning z = 7 to z = -82 */}
      <Box
        position={[0, -0.12, -37.5]}
        scale={[14, 0.24, 89]}
        color="#c9c2b2"
      />
      {Array.from({ length: 44 }, (_, i) => (
        <Box
          key={i}
          position={[0, 0.012, 6 - i * 2]}
          scale={[13.7, 0.012, 0.018]}
          color="#b6ae9d"
        />
      ))}
      {/* Left, Right, and Back structural walls */}
      <Box
        position={[-7, 3.5, -37.5]}
        scale={[0.35, 7, 89]}
        color="#e5dfd1"
      />
      <Box position={[7, 3.5, -37.5]} scale={[0.35, 7, 89]} color="#e5dfd1" />
      <Box position={[0, 3.5, -82]} scale={[14, 7, 0.35]} color="#ded8ca" />

      {/* Entrance facade at z = 7 */}
      {[-4.75, 4.75].map((x) => (
        <Box
          key={x}
          position={[x, 3.5, 7]}
          scale={[4.5, 7, 0.45]}
          color="#e4ddce"
        />
      ))}
      <Box position={[0, 5.7, 7]} scale={[5, 2.6, 0.45]} color="#e4ddce" />

      {/* Roof & Skylight ceiling spanning Lobby through Guestbook Room */}
      {[-5.5, 5.5].map((x) => (
        <Box
          key={x}
          position={[x, 7.2, -37.5]}
          scale={[3.5, 0.35, 90]}
          color="#c6bfb0"
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <Box
          key={`roof${i}`}
          position={[0, 7.2, 6 - i * 8]}
          scale={[7.5, 0.35, 2.6]}
          color="#c6bfb0"
        />
      ))}
      {/* Skylight ceiling: open bright inset panels beneath the roof. */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i} position={[0, 6.96, 2 - i * 8]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[7, 5]} />
            <meshBasicMaterial color="#f3f2e8" side={THREE.DoubleSide} />
          </mesh>
          <Box
            position={[-3.6, -0.1, 0]}
            scale={[0.16, 0.25, 5.4]}
            color="#73746c"
          />
          <Box
            position={[3.6, -0.1, 0]}
            scale={[0.16, 0.25, 5.4]}
            color="#73746c"
          />
          <Box
            position={[0, -0.15, 2.7]}
            scale={[14, 0.3, 0.2]}
            color="#c5bdad"
          />
        </group>
      ))}

      {/* Partition portals between Room 01/02 (-24), Room 02/03 (-42), Room 03/04 (-56), and Room 04/05 (-70) */}
      {(
        [
          {
            z: -24,
            currentTitle: "01 — PRODUCTS & SYSTEMS",
            nextLabel: "02 — APPLIED EXPERIMENTS ↓",
          },
          {
            z: -42,
            currentTitle: "02 — APPLIED EXPERIMENTS",
            nextLabel: "03 — WEB & INTERFACE ↓",
          },
          {
            z: -56,
            currentTitle: "03 — WEB & INTERFACE",
            nextLabel: "04 — AI PRODUCT VISUALS ↓",
          },
          {
            z: -70,
            currentTitle: "04 — AI PRODUCT VISUALS",
            nextLabel: "05 — SIGN THE GUESTBOOK ↓",
          },
        ] as const
      ).map(({ z, currentTitle, nextLabel }) => (
        <group key={z}>
          {[-5.2, 5.2].map((x) => (
            <Box
              key={x}
              position={[x, 3.5, z]}
              scale={[3.6, 7, 0.25]}
              color="#e1dacb"
            />
          ))}
          <Box position={[0, 6, z]} scale={[7, 2, 0.25]} color="#ded7c9" />
          {/* Warm wooden portal arch trim matching Lobby portal */}
          <Box position={[-3.35, 2.5, z]} scale={[0.12, 5, 0.3]} color="#7d5c3f" />
          <Box position={[3.35, 2.5, z]} scale={[0.12, 5, 0.3]} color="#7d5c3f" />
          <Box position={[0, 5.02, z]} scale={[6.82, 0.12, 0.3]} color="#7d5c3f" />
          <Text
            position={[0, 6.12, z + 0.15]}
            fontSize={0.22}
            color="#3e4136"
            letterSpacing={0.07}
          >
            {currentTitle}
          </Text>
          <Text
            position={[0, 5.52, z + 0.15]}
            fontSize={0.095}
            color="#a34c34"
            letterSpacing={0.11}
          >
            {nextLabel}
          </Text>
        </group>
      ))}

      {/* Central gallery benches in Rooms 01, 02, and 03 */}
      {[-15, -33, -49].map((z) => (
        <group key={z}>
          <Box
            position={[0, 0.62, z]}
            scale={[1.4, 0.3, 4.4]}
            color="#b4ab96"
          />
          <Box
            position={[0, 0.25, z - 1.5]}
            scale={[1, 0.5, 0.3]}
            color="#8c887b"
          />
          <Box
            position={[0, 0.25, z + 1.5]}
            scale={[1, 0.5, 0.3]}
            color="#8c887b"
          />
        </group>
      ))}

      {/* Exterior entrance signage */}
      <Text
        position={[0, 5.1, 7.25]}
        fontSize={0.66}
        color="#4a493e"
        letterSpacing={0.04}
      >
        RUANG KARYA
      </Text>
      <Text
        position={[0, 4.35, 7.26]}
        fontSize={0.16}
        color="#686658"
        letterSpacing={0.12}
      >
        MUHAMMAD ROFI'UL ARHAM
      </Text>
      <Box
        position={[-4.7, 2.1, 7.3]}
        scale={[1.5, 2.6, 0.08]}
        color="#9e4a33"
      />
      <Text
        position={[-4.7, 2.5, 7.36]}
        fontSize={0.18}
        color="#fff4df"
        maxWidth={1.2}
        textAlign="center"
      >
        IDE. KODE. KARYA.
      </Text>
      <Text position={[-4.7, 1.55, 7.36]} fontSize={0.12} color="#fff4df">
        EST. 2026
      </Text>
    </group>
  );
}

function Artwork({
  index,
  onSelect,
  active,
  canInteract,
}: {
  index: number;
  onSelect: (p: Project, trigger?: HTMLElement | null) => void;
  active: boolean;
  canInteract: () => boolean;
}) {
  const { project, x, z } = placements[index];
  const texture = useTexture(project.cover);
  texture.colorSpace = THREE.SRGBColorSpace;
  const aspect = texture.image.width / texture.image.height;
  const width = Math.min(4.4, 3.1 * aspect),
    height = width / aspect;
  return (
    <group
      position={[x, 3, z]}
      rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      <Box
        position={[0, 0, -0.045]}
        scale={[width + 0.18, height + 0.18, 0.1]}
        color="#49493f"
      />
      <mesh
        position={[0, 0, 0.02]}
        onClick={(e) => {
          if (!canInteract()) return;
          e.stopPropagation();
          onSelect(project, null);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <Text
        position={[-width / 2, -height / 2 - 0.3, 0.05]}
        anchorX="left"
        fontSize={0.13}
        color="#4e4c42"
        maxWidth={4}
      >
        {project.title.split(" — ")[0]}
      </Text>
      <Text
        position={[-width / 2, -height / 2 - 0.55, 0.05]}
        anchorX="left"
        fontSize={0.09}
        color="#716d5e"
      >
        {project.year} · {project.categories[0]}
      </Text>
      {active && (
        <Html
          position={[width / 2 + 0.35, 0, 0.12]}
          center
          distanceFactor={9}
          occlude
        >
          <button
            className="art-marker"
            aria-label={`Lihat ${project.title}`}
            onClick={(e) => onSelect(project, e.currentTarget)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        </Html>
      )}
    </group>
  );
}

function Rig({
  station,
  lobbyView,
  snapCount,
  reduced,
  drag,
}: {
  station: number;
  lobbyView: LobbyViewpointId;
  snapCount: number;
  reduced: boolean;
  drag: { x: number; y: number };
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 1, -10));
  const current =
    station === 1 && lobbyView !== "wide"
      ? lobbyViewpoints[lobbyView]
      : stations[station];
  const previousStation = useRef(-100);
  const previousSnap = useRef(0);

  useEffect(() => {
    // Direct map jumps or multi-station jumps must snap cleanly while eyes are closed.
    if (
      Math.abs(station - previousStation.current) > 1 ||
      snapCount !== previousSnap.current
    ) {
      camera.position.set(...(current.position as [number, number, number]));
      look.current.set(...(current.look as [number, number, number]));
      camera.lookAt(look.current);
    }
    previousStation.current = station;
    previousSnap.current = snapCount;
  }, [station, snapCount, current, camera]);

  useFrame((_, delta) => {
    const p = new THREE.Vector3(...current.position);
    const l = new THREE.Vector3(...current.look);
    const offset = l.clone().sub(p);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), drag.x);
    l.copy(p).add(offset);
    l.y += drag.y;
    const a = reduced ? 1 : 1 - Math.exp(-delta * 2.8);
    camera.position.lerp(p, a);
    look.current.lerp(l, a);
    camera.lookAt(look.current);
  });
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export default function Scene({
  station,
  lobbyView,
  snapCount = 0,
  greetingOpen,
  guestbookEntries,
  onGreetStaff,
  onInspectBoard,
  onOpenCatalog,
  onSelect,
  onSelectVisual,
  reduced,
  low,
  onReady,
  paused,
}: {
  station: number;
  lobbyView: LobbyViewpointId;
  snapCount?: number;
  greetingOpen: boolean;
  guestbookEntries: GuestbookEntry[];
  onGreetStaff: () => void;
  onInspectBoard: (trigger?: HTMLElement | null) => void;
  onOpenCatalog: (trigger?: HTMLElement | null) => void;
  onSelect: (p: Project, trigger?: HTMLElement | null) => void;
  onSelectVisual: (v: AiVisual, trigger?: HTMLElement | null) => void;
  reduced: boolean;
  low: boolean;
  onReady: () => void;
  paused: boolean;
}) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragDistance = useRef(0);
  const [hidden, setHidden] = useState(document.hidden);

  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);

  useEffect(() => setDrag({ x: 0, y: 0 }), [station, lobbyView]);

  const canInteract = useCallback(() => dragDistance.current <= 6, []);
  const currentStation = stations[station];

  return (
    <div
      className="canvas-shell"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
        dragDistance.current = 0;
      }}
      onPointerMove={(e) => {
        if (start.current && e.buttons === 1) {
          const dx = e.clientX - start.current.x,
            dy = e.clientY - start.current.y;
          dragDistance.current += Math.hypot(dx, dy);
          if (Math.abs(dx) + Math.abs(dy) > 4)
            setDrag((v) => ({
              x: Math.max(-0.65, Math.min(0.65, v.x - dx * 0.003)),
              y:
                e.pointerType === "touch"
                  ? 0
                  : Math.max(-1.5, Math.min(1.5, v.y + dy * 0.008)),
            }));
          start.current = { x: e.clientX, y: e.clientY };
        }
      }}
      onPointerUp={() => {
        start.current = null;
      }}
      onPointerLeave={() => {
        start.current = null;
      }}
    >
      <Canvas
        frameloop={paused || hidden ? "never" : "always"}
        shadows={!low}
        dpr={low ? 1 : [1, 1.5]}
        camera={{ position: [31, 22, 42], fov: 48, near: 0.1, far: 250 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#d7d9cf");
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            window.dispatchEvent(new Event("gallery-context-lost"));
          });
        }}
      >
        <fog attach="fog" args={["#d7d9cf", 65, 195]} />
        <ambientLight intensity={1.15} />
        <hemisphereLight args={["#fcf8ec", "#9c977f", 1.6]} />
        <directionalLight
          position={[15, 35, 20]}
          intensity={2.5}
          castShadow={!low}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={45}
          shadow-camera-bottom={-95}
          shadow-normalBias={0.05}
        />
        {[-14, -33, -49].map((z) => (
          <pointLight
            key={z}
            position={[0, 5.8, z]}
            intensity={32}
            distance={18}
            decay={2}
            color="#fff1d7"
          />
        ))}
        <City />
        <Suspense fallback={null}>
          <Building />
          <Lobby
            inLobby={currentStation.room === 1}
            lobbyView={lobbyView}
            reduced={reduced}
            low={low}
            greetingOpen={greetingOpen}
            onGreetStaff={onGreetStaff}
            onInspectBoard={onInspectBoard}
            onOpenCatalog={onOpenCatalog}
            canInteract={canInteract}
          />
          {/* Visitor 2 in Room 01 looking directly at Artwork 02 (Rekyndness on Right Wall) */}
          <Visitor
            position={[4.25, 0, -16.8]}
            lookAtTarget={[6.72, -15]}
            role="visitor"
            coatColor="#586157"
            trouserColor="#33362f"
            reduced={reduced}
            low={low}
            phaseOffset={0.8}
          />
          {/* Visitor 3 in Room 02 looking directly at Artwork 05 (TalkBuddy AI on Left Wall) */}
          <Visitor
            position={[-4.25, 0, -34.8]}
            lookAtTarget={[-6.72, -33]}
            role="visitor"
            coatColor="#6e6456"
            trouserColor="#3a3932"
            reduced={reduced}
            low={low}
            phaseOffset={2.2}
          />
        </Suspense>
        {placements.map((_, i) => (
          <Suspense key={i} fallback={null}>
            <Artwork
              index={i}
              onSelect={onSelect}
              active={currentStation.project === i}
              canInteract={canInteract}
            />
          </Suspense>
        ))}
        <Suspense fallback={null}>
          <AiVisualRoom
            activeInRoom={currentStation.room === 5}
            reduced={reduced}
            low={low}
            onSelectVisual={onSelectVisual}
            canInteract={canInteract}
          />
          <GuestbookRoom entries={guestbookEntries} />
        </Suspense>
        <Rig
          station={station}
          lobbyView={lobbyView}
          snapCount={snapCount}
          reduced={reduced}
          drag={drag}
        />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
