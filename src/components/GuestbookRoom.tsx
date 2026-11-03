import { useEffect, useMemo } from "react";
import * as THREE from "three";

export interface GuestbookEntry {
  text: string;
}

function createGuestbookWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // 1. Base shaded warm taupe/olive canvas wall
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 1024);
  bgGrad.addColorStop(0, "#6f6657");
  bgGrad.addColorStop(0.5, "#786f60");
  bgGrad.addColorStop(1, "#61594b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Dramatic diagonal spotlight cone illuminating the wall (matching reference photo 2)
  // Note: Wall height is 7m (worldY = 0 at canvasY = 1024, worldY = 3.85 at canvasY = 460)
  ctx.save();
  ctx.translate(930, 760);
  ctx.rotate(-0.24);
  const spotGrad = ctx.createRadialGradient(20, -245, 18, -30, 40, 460);
  spotGrad.addColorStop(0, "rgba(255, 243, 216, 0.99)");
  spotGrad.addColorStop(0.36, "rgba(248, 222, 181, 0.94)");
  spotGrad.addColorStop(0.68, "rgba(218, 185, 138, 0.58)");
  spotGrad.addColorStop(0.86, "rgba(148, 128, 98, 0.18)");
  spotGrad.addColorStop(1, "rgba(110, 101, 86, 0)");
  ctx.fillStyle = spotGrad;
  ctx.scale(0.82, 1.38);
  ctx.beginPath();
  ctx.arc(0, 0, 520, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Subtle woven linen/canvas grain across the entire wall
  ctx.fillStyle = "rgba(35, 31, 24, 0.045)";
  for (let y = 0; y < 1024; y += 3) {
    ctx.fillRect(0, y, 2048, 1);
  }
  ctx.fillStyle = "rgba(255, 248, 232, 0.03)";
  for (let x = 0; x < 2048; x += 3) {
    ctx.fillRect(x, 0, 1, 1024);
  }

  // 4. Classic editorial serif headline "Thank you for visiting" & "SIGN THE GUESTBOOK"
  ctx.save();
  ctx.translate(1235, 628);
  ctx.rotate(0.035);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#141310";
  ctx.font = "400 92px Georgia, 'Times New Roman', serif";
  ctx.fillText("Thank you for visiting", 0, 0);

  ctx.fillStyle = "#26231c";
  ctx.font = "400 20px Inter, Arial, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("SIGN THE GUESTBOOK", -12, 78);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createParquetFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#9d7847";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankCols = 28;
  const plankRows = 8;
  const colW = 1024 / plankCols;
  const rowH = 1024 / plankRows;
  const palette = ["#a57e4b", "#967040", "#b08954", "#8e693b", "#ab834f"];

  for (let c = 0; c < plankCols; c++) {
    const stagger = (c % 3) * (rowH * 0.33);
    for (let r = -1; r <= plankRows; r++) {
      const y = r * rowH + stagger;
      ctx.fillStyle = palette[(c * 3 + r + 10) % palette.length];
      ctx.fillRect(c * colW, y, colW - 1.5, rowH - 1.5);
      ctx.strokeStyle = "rgba(58, 39, 18, 0.32)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(c * colW, y, colW - 1.5, rowH - 1.5);
    }
  }

  // Warm floor spotlight pool near the back wall & lectern
  const pool = ctx.createRadialGradient(440, 820, 30, 440, 820, 420);
  pool.addColorStop(0, "rgba(255, 232, 189, 0.48)");
  pool.addColorStop(0.55, "rgba(242, 208, 152, 0.22)");
  pool.addColorStop(1, "rgba(80, 56, 28, 0.18)");
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, 1024, 1024);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createGuestbookPageTexture(
  pageEntries: GuestbookEntry[],
  side: "left" | "right",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Warm archival paper tone with subtle inner spine shading
  const grad = ctx.createLinearGradient(
    side === "left" ? 0 : 768,
    0,
    side === "left" ? 768 : 0,
    0,
  );
  grad.addColorStop(0, "#d2c4a6");
  grad.addColorStop(0.86, "#cbbd9e");
  grad.addColorStop(1, "#b4a485");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 1024);

  // Horizontal ruled guestbook lines (8 lines per page)
  ctx.strokeStyle = "rgba(116, 104, 84, 0.48)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = 175 + i * 102;
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(704, y);
    ctx.stroke();
  }

  // Handwritten-style visitor signatures on alternate ruled lines
  ctx.fillStyle = "#26221b";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  pageEntries.slice(0, 4).forEach((entry, idx) => {
    const lineIdx = idx * 2 + 1;
    const y = 175 + lineIdx * 102 - 14;
    ctx.font =
      idx % 2 === 0
        ? "italic 400 32px Georgia, 'Times New Roman', serif"
        : "italic 400 34px Georgia, 'Times New Roman', serif";
    ctx.fillText(entry.text.slice(0, 34), 76, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function GuestbookRoom({ entries }: { entries: GuestbookEntry[] }) {
  const wallTexture = useMemo(() => createGuestbookWallTexture(), []);
  const floorTexture = useMemo(() => createParquetFloorTexture(), []);

  const leftKey = entries
    .slice(0, 4)
    .map((e) => e.text)
    .join("|");
  const rightKey = entries
    .slice(4, 8)
    .map((e) => e.text)
    .join("|");

  const leftPageTex = useMemo(
    () => createGuestbookPageTexture(entries.slice(0, 4), "left"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leftKey],
  );
  const rightPageTex = useMemo(
    () => createGuestbookPageTexture(entries.slice(4, 8), "right"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rightKey],
  );

  useEffect(() => {
    return () => {
      leftPageTex.dispose();
      rightPageTex.dispose();
    };
  }, [leftPageTex, rightPageTex]);

  return (
    <group>
      {/* Warm wooden parquet floor in Room 05 (z = -70 to z = -82), placed above outer slab y=0.055 */}
      <mesh
        position={[0, 0.068, -76]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[13.6, 12.2]} />
        <meshBasicMaterial map={floorTexture} toneMapped={false} />
      </mesh>

      {/* Atmospheric back wall with woven canvas grain, diagonal spotlight beam, and editorial headline */}
      <mesh position={[0, 3.5, -81.74]}>
        <planeGeometry args={[13.6, 7]} />
        <meshBasicMaterial map={wallTexture} toneMapped={false} />
      </mesh>

      {/* Side walls in Room 05 shaded in matching warm olive-taupe */}
      <mesh position={[-6.78, 3.5, -76]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12.2, 7]} />
        <meshBasicMaterial color="#6e6556" toneMapped={false} />
      </mesh>
      <mesh position={[6.78, 3.5, -76]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12.2, 7]} />
        <meshBasicMaterial color="#665d4f" toneMapped={false} />
      </mesh>

      {/* Foreground Open Guestbook & Sleek Black Pen (matching reference photo 2) */}
      <group
        position={[-0.64, 0.93, -78.58]}
        rotation={[0.44, 0.22, -0.05]}
        scale={[1.12, 1.12, 1.12]}
      >
        {/* Lectern pedestal column */}
        <mesh position={[0, -0.52, -0.18]}>
          <boxGeometry args={[0.24, 0.96, 0.22]} />
          <meshBasicMaterial color="#593c22" toneMapped={false} />
        </mesh>

        {/* Warm wooden book cover board */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.34, 0.036, 0.96]} />
          <meshBasicMaterial color="#7d532d" toneMapped={false} />
        </mesh>

        {/* Center book spine */}
        <mesh position={[0, 0.019, 0]}>
          <boxGeometry args={[0.038, 0.038, 0.95]} />
          <meshBasicMaterial color="#4e3219" toneMapped={false} />
        </mesh>

        {/* Left Cream Page with Ruled Lines & Signatures */}
        <group position={[-0.315, 0.024, 0]} rotation={[0, 0, -0.02]}>
          <mesh>
            <boxGeometry args={[0.58, 0.018, 0.86]} />
            <meshBasicMaterial color="#cbbd9e" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.58, 0.86]} />
            <meshBasicMaterial map={leftPageTex} toneMapped={false} />
          </mesh>
        </group>

        {/* Right Cream Page with Ruled Lines, Signatures & Black Pen */}
        <group position={[0.315, 0.024, 0]} rotation={[0, 0, 0.02]}>
          <mesh>
            <boxGeometry args={[0.58, 0.018, 0.86]} />
            <meshBasicMaterial color="#c6b899" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.58, 0.86]} />
            <meshBasicMaterial map={rightPageTex} toneMapped={false} />
          </mesh>

          {/* Sleek Black Pen resting diagonally on the bottom-right of the right page */}
          <group
            position={[0.15, 0.025, 0.24]}
            rotation={[Math.PI / 2, 0, -0.58]}
          >
            <mesh>
              <cylinderGeometry args={[0.014, 0.013, 0.36, 16]} />
              <meshBasicMaterial color="#111110" toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <coneGeometry args={[0.013, 0.048, 16]} />
              <meshBasicMaterial color="#1c1b18" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
