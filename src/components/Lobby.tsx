import { Text as DreiText } from "@react-three/drei";
import { FloorPlanBoard } from "./FloorPlanBoard";
import { ReceptionDesk } from "./ReceptionDesk";
import { Visitor } from "./Visitor";
import type { LobbyViewpointId } from "../content";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

export function Lobby({
  inLobby,
  lobbyView,
  reduced,
  low,
  greetingOpen,
  onGreetStaff,
  onInspectBoard,
  onOpenCatalog,
  canInteract,
}: {
  inLobby: boolean;
  lobbyView: LobbyViewpointId;
  reduced: boolean;
  low: boolean;
  greetingOpen: boolean;
  onGreetStaff: () => void;
  onInspectBoard: (trigger?: HTMLElement | null) => void;
  onOpenCatalog: (trigger?: HTMLElement | null) => void;
  canInteract: () => boolean;
}) {
  return (
    <group>
      {/* Warm wood flooring for the Lobby area (z = 7 down to z = -6) */}
      <mesh position={[0, 0.008, 0.5]} receiveShadow>
        <boxGeometry args={[13.6, 0.016, 12.8]} />
        <meshStandardMaterial color="#b99974" roughness={0.82} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <mesh
          key={`plank-${i}`}
          position={[-6.3 + i * 0.74, 0.018, 0.5]}
          receiveShadow
        >
          <boxGeometry args={[0.025, 0.004, 12.7]} />
          <meshStandardMaterial color="#987856" roughness={0.9} />
        </mesh>
      ))}

      {/* Back wall of Lobby (z = -6) with museum identity, welcome message & portal to Room 01 */}
      <group position={[0, 0, -6]}>
        <mesh position={[-4.9, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 7, 0.28]} />
          <meshStandardMaterial color="#e4ddd0" roughness={0.88} />
        </mesh>
        <mesh position={[4.9, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 7, 0.28]} />
          <meshStandardMaterial color="#e4ddd0" roughness={0.88} />
        </mesh>
        <mesh position={[0, 5.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 2.5, 0.28]} />
          <meshStandardMaterial color="#dfd8c9" roughness={0.86} />
        </mesh>
        {/* Warm wooden portal casing */}
        <mesh position={[-2.82, 2.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 4.5, 0.34]} />
          <meshStandardMaterial color="#7d5c3f" roughness={0.8} />
        </mesh>
        <mesh position={[2.82, 2.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 4.5, 0.34]} />
          <meshStandardMaterial color="#7d5c3f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.78, 0.14, 0.34]} />
          <meshStandardMaterial color="#7d5c3f" roughness={0.8} />
        </mesh>

        {/* Museum identity and welcome inscription on lobby header */}
        <Text
          position={[0, 6.15, 0.16]}
          fontSize={0.44}
          color="#3a3d33"
          letterSpacing={0.06}
        >
          RUANG KARYA
        </Text>
        <Text
          position={[0, 5.62, 0.16]}
          fontSize={0.135}
          color="#656859"
          letterSpacing={0.04}
        >
          Selamat datang di museum portofolio digital & eksplorasi ruang.
        </Text>
        <Text
          position={[0, 5.05, 0.16]}
          fontSize={0.105}
          color="#a34c34"
          letterSpacing={0.12}
        >
          01 — PRODUCTS & SYSTEMS ↓
        </Text>
      </group>

      {/* Warm accent lighting focused on Lobby identity, FloorPlanBoard & ReceptionDesk */}
      <pointLight
        position={[0, 5.9, 1.2]}
        intensity={26}
        distance={15}
        decay={2}
        color="#fff0d4"
      />
      <pointLight
        position={[-4.2, 4.6, -1.2]}
        intensity={18}
        distance={11}
        decay={2}
        color="#fff4de"
      />
      <pointLight
        position={[3.5, 4.4, -1.0]}
        intensity={18}
        distance={11}
        decay={2}
        color="#ffefd4"
      />

      {/* 3D FloorPlanBoard on Left Side */}
      <FloorPlanBoard
        onInspect={onInspectBoard}
        inLobby={inLobby}
        focused={lobbyView === "board"}
        canInteract={canInteract}
      />

      {/* ReceptionDesk + CatalogBook on Right Side */}
      <ReceptionDesk
        onOpenCatalog={onOpenCatalog}
        inLobby={inLobby}
        canInteract={canInteract}
      />

      {/* Staff member behind the reception desk facing incoming visitors */}
      <Visitor
        position={[3.85, 0, -2.65]}
        lookAtTarget={[0, 4.5]}
        role="staff"
        coatColor="#3e473b"
        trouserColor="#2b2e28"
        reduced={reduced}
        low={low}
        inLobby={inLobby}
        greetingOpen={greetingOpen}
        onGreet={onGreetStaff}
        canInteract={canInteract}
      />

      {/* Visitor 1 standing near the FloorPlanBoard looking directly at the board */}
      <Visitor
        position={[-2.95, 0, -2.95]}
        lookAtTarget={[-4.55, -1.9]}
        role="visitor"
        coatColor="#6c695d"
        trouserColor="#3d3c36"
        reduced={reduced}
        low={low}
        phaseOffset={1.3}
      />
    </group>
  );
}
