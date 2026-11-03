import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import SkyEnvironment, { celestialDirection } from "./SkyEnvironment";
import * as THREE from "three";
export function nightAmount(hour: number) {
  return THREE.MathUtils.smoothstep(hour, 17, 20);
}
export default function EnvironmentLighting({
  hour,
  low,
}: {
  hour: number;
  low: boolean;
}) {
  const { scene } = useThree();
  const night = nightAmount(hour);
  const sky = useMemo(() => {
    const keys: [number, string][] = [
      [6, "#cdb9a5"],
      [10, "#c4d7dc"],
      [15, "#b6cbd6"],
      [18, "#ac7971"],
      [20, "#28334e"],
      [22, "#101c32"],
    ];
    let i = 0;
    while (i < keys.length - 2 && hour > keys[i + 1][0]) i++;
    return new THREE.Color(keys[i][1]).lerp(
      new THREE.Color(keys[i + 1][1]),
      THREE.MathUtils.clamp(
        (hour - keys[i][0]) / (keys[i + 1][0] - keys[i][0]),
        0,
        1,
      ),
    );
  }, [hour]);
  useEffect(() => {
    scene.background = sky;
  }, [scene, sky]);
  const sun = celestialDirection(hour, false).multiplyScalar(95);
  return (
    <>
      <SkyEnvironment hour={hour} night={night} horizon={sky} />
      {/* Distance haze closes the finite city softly while keeping nearby exhibits clear. */}
      <fog attach="fog" args={[sky, 38, 138]} />
      <ambientLight intensity={0.35 + (1 - night) * 0.45} />
      <hemisphereLight
        args={[
          new THREE.Color("#f9efdb").lerp(new THREE.Color("#798db8"), night),
          "#6d7358",
          1.2 - night * 0.7,
        ]}
      />
      <directionalLight
        position={sun}
        color={hour > 16 ? "#ffc38c" : "#fff2d8"}
        intensity={(1 - night) * 2.4}
        castShadow={!low}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-camera-far={220}
        shadow-normalBias={0.05}
      />
      <directionalLight
        position={[-40, 60, 80]}
        color="#91b6ec"
        intensity={night * 0.55}
      />
    </>
  );
}
