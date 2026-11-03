import { useState } from "react";
import { Html, Text as DreiText } from "@react-three/drei";
import { interiorRooms } from "../content";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

export function FloorPlanBoard({
  onInspect,
  inLobby,
  focused,
  canInteract,
}: {
  onInspect: (trigger?: HTMLElement | null) => void;
  inLobby: boolean;
  focused: boolean;
  canInteract: () => boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const orderedFromTop = [...interiorRooms].reverse();

  return (
    <group
      position={[-4.55, 2.25, -1.9]}
      rotation={[0, Math.PI * 0.33, 0]}
      onClick={(e) => {
        if (!canInteract()) return;
        e.stopPropagation();
        onInspect(null);
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Architectural partition wall panel supporting the floorplan board */}
      <mesh position={[-0.25, -0.35, -0.14]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 3.8, 0.18]} />
        <meshStandardMaterial color="#dfd8c8" roughness={0.88} />
      </mesh>

      {/* Outer wooden architectural frame */}
      <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 2.48, 0.08]} />
        <meshStandardMaterial
          color={hovered || focused ? "#7b5238" : "#6b4c35"}
          roughness={0.78}
        />
      </mesh>

      {/* Main matte board surface */}
      <mesh position={[0, 0, 0.005]} receiveShadow>
        <boxGeometry args={[3.22, 2.32, 0.02]} />
        <meshStandardMaterial color="#f3efe4" roughness={0.92} />
      </mesh>

      {/* Header bar */}
      <Text
        position={[-1.42, 0.92, 0.025]}
        anchorX="left"
        fontSize={0.09}
        color="#a34c34"
        letterSpacing={0.08}
      >
        DENAH MUSEUM · ORIENTASI RUANG
      </Text>
      <Text
        position={[-1.42, 0.72, 0.025]}
        anchorX="left"
        fontSize={0.175}
        color="#33372e"
      >
        Peta Ruang Karya
      </Text>

      {/* Left graphical schematic diagram of the 5 rooms (04 down to 00) */}
      <group position={[-0.9, -0.16, 0.02]}>
        <mesh position={[0, 0, -0.004]}>
          <planeGeometry args={[1.02, 1.52]} />
          <meshBasicMaterial color="#e4dfd1" />
        </mesh>
        {orderedFromTop.map((r, idx) => {
          const y = 0.56 - idx * 0.28;
          const isLobby = r.id === "lobby";
          return (
            <group key={r.id} position={[0, y, 0.004]}>
              <mesh>
                <planeGeometry args={[0.84, 0.21]} />
                <meshBasicMaterial color={isLobby ? "#a34c34" : "#f7f5ee"} />
              </mesh>
              <Text
                position={[0, 0, 0.005]}
                anchorX="center"
                anchorY="middle"
                fontSize={0.08}
                color={isLobby ? "#fff9eb" : "#44483d"}
              >
                {`${r.code} · ${r.short.toUpperCase()}`}
              </Text>
              {idx < orderedFromTop.length - 1 && (
                <mesh position={[0, -0.14, 0.002]}>
                  <planeGeometry args={[0.16, 0.07]} />
                  <meshBasicMaterial color="#8f8b7c" />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* Right directory list of rooms */}
      <group position={[-0.22, 0.4, 0.025]}>
        {interiorRooms.map((r, idx) => {
          const y = -idx * 0.275;
          const isLobby = r.id === "lobby";
          return (
            <group key={r.id} position={[0, y, 0]}>
              <Text
                position={[0, 0, 0]}
                anchorX="left"
                fontSize={0.105}
                color={isLobby ? "#a34c34" : "#33372e"}
              >
                {`${r.code} — ${r.title}`}
              </Text>
              <Text
                position={[0, -0.105, 0]}
                anchorX="left"
                fontSize={0.07}
                color="#6e7265"
              >
                {isLobby ? "ANDA DI SINI · Area Sambutan" : r.range}
              </Text>
            </group>
          );
        })}
      </group>

      {inLobby && (
        <Html position={[1.08, -0.92, 0.06]} center>
          <button
            type="button"
            className="scene-hotspot paper"
            aria-label="Lihat denah museum lebih jelas"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(e.currentTarget);
            }}
          >
            {focused ? "Buka daftar ruang" : "Perbesar denah"}
          </button>
        </Html>
      )}
    </group>
  );
}
