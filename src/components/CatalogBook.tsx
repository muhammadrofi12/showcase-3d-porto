import { useState } from "react";
import { Html, Text as DreiText } from "@react-three/drei";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

export function CatalogBook({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onOpenCatalog,
  inLobby,
  canInteract,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onOpenCatalog: (trigger?: HTMLElement | null) => void;
  inLobby: boolean;
  canInteract: () => boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        if (!canInteract()) return;
        e.stopPropagation();
        onOpenCatalog(null);
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
      {/* Generous invisible interaction hitbox around the book */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.74, 0.24, 0.56]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Angled wooden reading cradle */}
      <mesh
        position={[0, 0.025, 0]}
        rotation={[0.18, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.58, 0.03, 0.42]} />
        <meshStandardMaterial color="#6e4f37" roughness={0.8} />
      </mesh>

      {/* Open book cover & pages tilted toward visitor */}
      <group position={[0, 0.06, 0.01]} rotation={[0.18, 0, 0]}>
        <mesh position={[0, -0.012, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.022, 0.37]} />
          <meshStandardMaterial
            color={hovered ? "#b5553b" : "#9c4730"}
            roughness={0.72}
          />
        </mesh>
        <mesh
          position={[-0.128, 0.01, 0]}
          rotation={[0, 0, -0.04]}
          receiveShadow
        >
          <boxGeometry args={[0.24, 0.024, 0.34]} />
          <meshStandardMaterial color="#f8f5ec" roughness={0.9} />
        </mesh>
        <mesh
          position={[0.128, 0.01, 0]}
          rotation={[0, 0, 0.04]}
          receiveShadow
        >
          <boxGeometry args={[0.24, 0.024, 0.34]} />
          <meshStandardMaterial color="#f5f1e5" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.023, 0.03]}>
          <boxGeometry args={[0.016, 0.004, 0.36]} />
          <meshStandardMaterial color="#a34c34" roughness={0.7} />
        </mesh>
        <Text
          position={[-0.128, 0.026, -0.04]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.028}
          maxWidth={0.2}
          textAlign="center"
          color="#33372e"
        >
          KATALOG RUANG KARYA
        </Text>
        <Text
          position={[-0.128, 0.026, 0.06]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.018}
          maxWidth={0.2}
          textAlign="center"
          color="#a34c34"
        >
          EDISI 2026
        </Text>
        <Text
          position={[0.128, 0.026, -0.03]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.021}
          maxWidth={0.2}
          textAlign="center"
          color="#505448"
        >
          19 Proyek Software{"\n"}8 AI Product Visuals
        </Text>
      </group>

      {inLobby && (
        <Html position={[0, 0.28, 0]} center>
          <button
            type="button"
            className={`scene-hotspot book-hotspot paper ${hovered ? "active" : ""}`}
            aria-label="Buka katalog Ruang Karya"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCatalog(e.currentTarget);
            }}
          >
            Buka katalog
          </button>
        </Html>
      )}
    </group>
  );
}
