import { useState } from "react";
import { Html, Text as DreiText, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { aiVisuals } from "../content";
import type { AiVisual } from "../content";
import { Visitor } from "./Visitor";

const Text = (props: React.ComponentProps<typeof DreiText>) => (
  <DreiText font="/fonts/Syne-Regular.ttf" {...props} />
);

const SHELF_Y = [3.65, 2.22, 0.79];

function ShelfVisualItem({
  visual,
  onSelectVisual,
  activeInRoom,
  canInteract,
}: {
  visual: AiVisual;
  onSelectVisual: (v: AiVisual, trigger?: HTMLElement | null) => void;
  activeInRoom: boolean;
  canInteract: () => boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(visual.texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  const aspect = visual.aspect || 1;
  const imgHeight = aspect >= 1 ? 0.88 : 0.94;
  const imgWidth =
    aspect >= 1 ? Math.min(1.22, imgHeight * aspect) : imgHeight * aspect;
  const boardWidth = Math.max(0.86, imgWidth + 0.14);
  const boardHeight = Math.max(1.02, imgHeight + 0.12);

  const shelfY = SHELF_Y[visual.shelf] ?? 0.79;
  const xPos =
    visual.shelf < 2
      ? [-2.55, 0, 2.55][visual.slot] || 0
      : [-1.45, 1.45][visual.slot] || 0;
  const yCenter = shelfY + 0.04 + boardHeight / 2;
  const numLabel = String(visual.order).padStart(2, "0");

  return (
    <group
      position={[xPos, yCenter, 0.22]}
      onClick={(e) => {
        if (!canInteract()) return;
        e.stopPropagation();
        onSelectVisual(visual, null);
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
      {/* Thin dark outer frame */}
      <mesh position={[0, 0, -0.025]} castShadow receiveShadow>
        <boxGeometry args={[boardWidth + 0.06, boardHeight + 0.06, 0.04]} />
        <meshStandardMaterial
          color={hovered ? "#a34c34" : "#3f3e36"}
          roughness={0.78}
        />
      </mesh>

      {/* Warm neutral mat / backing board (bidang penyangga) to preserve aspect ratio */}
      <mesh position={[0, 0, -0.002]} receiveShadow>
        <boxGeometry args={[boardWidth, boardHeight, 0.016]} />
        <meshStandardMaterial color="#f4f0e4" roughness={0.9} />
      </mesh>

      {/* Original aspect-ratio visual print (un-tonemapped sRGB so lighting never blows out colors) */}
      <mesh position={[0, 0.02, 0.01]}>
        <planeGeometry args={[imgWidth, imgHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Small number & title plaque on bottom margin of the backing board */}
      <Text
        position={[-boardWidth / 2 + 0.06, -boardHeight / 2 + 0.042, 0.012]}
        anchorX="left"
        anchorY="middle"
        fontSize={0.052}
        color="#4a4d41"
      >
        {`${numLabel} · ${visual.title}`}
      </Text>

      {activeInRoom && (
        <Html
          position={[boardWidth / 2 - 0.04, -boardHeight / 2 + 0.08, 0.05]}
          center
          distanceFactor={8.5}
        >
          <button
            type="button"
            className="art-marker ai-marker"
            aria-label={`Lihat ${visual.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectVisual(visual, e.currentTarget);
            }}
          >
            {numLabel}
          </button>
        </Html>
      )}
    </group>
  );
}

export function AiVisualRoom({
  activeInRoom,
  reduced,
  low,
  onSelectVisual,
  canInteract,
}: {
  activeInRoom: boolean;
  reduced: boolean;
  low: boolean;
  onSelectVisual: (v: AiVisual, trigger?: HTMLElement | null) => void;
  canInteract: () => boolean;
}) {
  return (
    <group>
      {/* Warm wood floor inset in Room 04 (z = -56 to z = -70) */}
      <mesh position={[0, 0.064, -63]} receiveShadow>
        <boxGeometry args={[13.6, 0.016, 13.6]} />
        <meshStandardMaterial color="#b99974" roughness={0.84} />
      </mesh>

      {/* 3-Tier Shelf Assembly mounted on Left Wall of Room 04 (x = -6.78, z = -63) */}
      <group position={[-6.76, 0, -63]} rotation={[0, Math.PI / 2, 0]}>
        {/* Feature display wall backdrop behind the shelves */}
        <mesh position={[0, 3.3, -0.14]} receiveShadow>
          <boxGeometry args={[9.4, 6.2, 0.08]} />
          <meshStandardMaterial color="#d8d0be" roughness={0.9} />
        </mesh>

        {/* Room 04 Header above top shelf */}
        <Text
          position={[0, 5.65, -0.04]}
          fontSize={0.34}
          color="#3a3d33"
          letterSpacing={0.06}
        >
          AI PRODUCT VISUALS
        </Text>
        <Text
          position={[0, 5.25, -0.04]}
          fontSize={0.11}
          color="#6a6d5e"
          letterSpacing={0.08}
        >
          04 — KOLEKSI EKSPLORASI VISUAL PRODUK BERBANTUAN AI
        </Text>

        {/* Three horizontal wooden shelves (3-3-2 display) */}
        {SHELF_Y.map((y, idx) => (
          <group key={`shelf-${idx}`} position={[0, y, 0.19]}>
            {/* Main warm oak shelf plank */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[7.6, 0.075, 0.42]} />
              <meshStandardMaterial color="#876243" roughness={0.76} />
            </mesh>
            {/* Front lip molding */}
            <mesh position={[0, 0.048, 0.18]} castShadow receiveShadow>
              <boxGeometry args={[7.6, 0.025, 0.03]} />
              <meshStandardMaterial color="#6d4e34" roughness={0.8} />
            </mesh>
            {/* Wooden support brackets */}
            {[-3.1, 0, 3.1].map((bx) => (
              <mesh
                key={bx}
                position={[bx, -0.09, -0.06]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[0.08, 0.11, 0.28]} />
                <meshStandardMaterial color="#5e432d" roughness={0.85} />
              </mesh>
            ))}
          </group>
        ))}

        {/* All 8 unique AI visuals arranged 3-3-2 on the shelves */}
        {aiVisuals.map((visual) => (
          <ShelfVisualItem
            key={visual.id}
            visual={visual}
            onSelectVisual={onSelectVisual}
            activeInRoom={activeInRoom}
            canInteract={canInteract}
          />
        ))}
      </group>

      {/* Warm non-shadow accent lights aimed at the shelf wall */}
      <pointLight
        position={[-1.2, 5.8, -63]}
        intensity={28}
        distance={16}
        decay={2}
        color="#fff1d7"
      />
      <pointLight
        position={[-4.2, 4.9, -60.4]}
        intensity={14}
        distance={9}
        decay={2}
        color="#ffefd2"
      />
      <pointLight
        position={[-4.2, 4.9, -65.6]}
        intensity={14}
        distance={9}
        decay={2}
        color="#ffefd2"
      />

      {/* Visitor 4 standing to the right side of the shelf, looking directly at the AI visuals */}
      <Visitor
        position={[-5.15, 0.07, -65.35]}
        lookAtTarget={[-6.76, -63.1]}
        role="visitor"
        coatColor="#756958"
        trouserColor="#353730"
        reduced={reduced}
        low={low}
        phaseOffset={3.1}
      />
    </group>
  );
}
