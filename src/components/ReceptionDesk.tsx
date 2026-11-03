import { Text as DreiText } from "@react-three/drei";
import { CatalogBook } from "./CatalogBook";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

export function ReceptionDesk({
  onOpenCatalog,
  inLobby,
  canInteract,
}: {
  onOpenCatalog: (trigger?: HTMLElement | null) => void;
  inLobby: boolean;
  canInteract: () => boolean;
}) {
  return (
    <group position={[3.45, 0, -1.75]} rotation={[0, -0.42, 0]}>
      {/* Main warm oak desk body */}
      <mesh position={[0, 0.51, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 1.02, 0.86]} />
        <meshStandardMaterial color="#8d6849" roughness={0.78} />
      </mesh>

      {/* Front vertical architectural wood slats */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh
          key={i}
          position={[-0.95 + i * 0.19, 0.51, 0.44]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.06, 0.96, 0.03]} />
          <meshStandardMaterial color="#735238" roughness={0.82} />
        </mesh>
      ))}

      {/* Warm limestone counter top */}
      <mesh position={[0, 1.045, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[2.24, 0.06, 0.94]} />
        <meshStandardMaterial color="#e8e2d3" roughness={0.75} />
      </mesh>

      {/* Recessed plinth base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.02, 0.08, 0.76]} />
        <meshStandardMaterial color="#423930" roughness={0.9} />
      </mesh>

      {/* Front sign plaque */}
      <mesh position={[-0.52, 0.72, 0.46]}>
        <boxGeometry args={[0.78, 0.22, 0.02]} />
        <meshStandardMaterial color="#f3efe3" roughness={0.85} />
      </mesh>
      <Text
        position={[-0.52, 0.75, 0.476]}
        fontSize={0.055}
        color="#a34c34"
        letterSpacing={0.08}
      >
        INFORMASI & KATALOG
      </Text>
      <Text position={[-0.52, 0.67, 0.476]} fontSize={0.042} color="#4d5145">
        RESEPSI RUANG KARYA
      </Text>

      {/* Minimalist warm desk lamp */}
      <group position={[0.72, 1.075, -0.15]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.04, 16]} />
          <meshStandardMaterial color="#4a493e" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.38, 12]} />
          <meshStandardMaterial color="#4a493e" roughness={0.6} />
        </mesh>
        <mesh
          position={[-0.04, 0.4, 0.04]}
          rotation={[0.25, 0, 0.2]}
          castShadow
        >
          <coneGeometry args={[0.14, 0.14, 18]} />
          <meshStandardMaterial color="#d8cfb8" roughness={0.7} />
        </mesh>
      </group>

      {/* Interactive Catalog Book on the desk */}
      <CatalogBook
        position={[-0.2, 1.075, 0.08]}
        rotation={[0, 0.12, 0]}
        onOpenCatalog={onOpenCatalog}
        inLobby={inLobby}
        canInteract={canInteract}
      />
    </group>
  );
}
