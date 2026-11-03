import EnvironmentLighting, {
  nightAmount,
} from "./components/EnvironmentLighting";
import CityEnvironment from "./components/CityEnvironment";
import { celestialDirection } from "./components/SkyEnvironment";
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
      <Box position={[-7, 3.5, -37.5]} scale={[0.35, 7, 89]} color="#e5dfd1" />
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
          <Box
            position={[-3.35, 2.5, z]}
            scale={[0.12, 5, 0.3]}
            color="#7d5c3f"
          />
          <Box
            position={[3.35, 2.5, z]}
            scale={[0.12, 5, 0.3]}
            color="#7d5c3f"
          />
          <Box
            position={[0, 5.02, z]}
            scale={[6.82, 0.12, 0.3]}
            color="#7d5c3f"
          />
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
    const direction = new THREE.Spherical().setFromVector3(offset);
    direction.phi = THREE.MathUtils.clamp(
      direction.phi + drag.y,
      0.18,
      Math.PI - 0.18,
    );
    offset.setFromSpherical(direction);
    l.copy(p).add(offset);
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
  hour,
  monasView,
  skyView,
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
  hour: number;
  monasView: number;
  skyView: { id: number; hour: number } | null;
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

  useEffect(() => {
    if (!monasView || station !== 0) return;
    const p = new THREE.Vector3(...stations[0].position);
    const original = new THREE.Vector3(...stations[0].look).sub(p);
    const target = new THREE.Vector3(0, 18, 88).sub(p);
    setDrag({
      x: Math.atan2(target.x, target.z) - Math.atan2(original.x, original.z),
      y:
        new THREE.Spherical().setFromVector3(target).phi -
        new THREE.Spherical().setFromVector3(original).phi,
    });
  }, [monasView]);
  useEffect(() => {
    if (!skyView || station !== 0) return;
    const original = new THREE.Vector3(...stations[0].look).sub(
      new THREE.Vector3(...stations[0].position),
    );
    const target = celestialDirection(skyView.hour);
    setDrag({
      x: Math.atan2(target.x, target.z) - Math.atan2(original.x, original.z),
      y:
        new THREE.Spherical().setFromVector3(target).phi -
        new THREE.Spherical().setFromVector3(original).phi,
    });
  }, [skyView]);
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
              x: (v.x - dx * 0.003) % (Math.PI * 2),
              y:
                e.pointerType === "touch"
                  ? v.y
                  : Math.max(-1, Math.min(1, v.y + dy * 0.004)),
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
        <EnvironmentLighting hour={hour} low={low} />
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
        <CityEnvironment
          night={nightAmount(hour)}
          low={low}
          reduced={reduced}
          active={station === 0 && !paused && !hidden}
        />
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
