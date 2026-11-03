import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Art-directed paths: the slider represents atmosphere, not an astronomical clock.
export function celestialDirection(hour: number, moon = hour >= 19) {
  const daylight = THREE.MathUtils.clamp((hour - 6) / 12, 0, 1);
  const azimuth = moon ? -2.3 + (hour - 19) * 0.18 : -2.8 + daylight * 2.6;
  const elevation = moon
    ? 0.18 + Math.max(0, hour - 18) * 0.12
    : 0.06 + Math.sin(daylight * Math.PI) * 0.95;
  return new THREE.Vector3(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimuth) * Math.cos(elevation),
  );
}

const vertexShader = `
varying vec3 vDirection;
void main() {
  vDirection = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const fragmentShader = `
uniform vec3 horizon;
uniform vec3 sunDirection;
uniform vec3 moonDirection;
uniform float night;
uniform float sunset;
varying vec3 vDirection;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  float n = 0.0, amplitude = 0.5;
  for(int i=0; i<4; i++) {
    n += amplitude * noise(p);
    p = mat2(1.6,-1.2,1.2,1.6) * p + 9.7;
    amplitude *= 0.5;
  }
  return n;
}
void main() {
  vec3 dir = normalize(vDirection);
  vec3 zenith = mix(horizon * vec3(0.48,0.66,0.9), vec3(0.009,0.018,0.045), night);
  vec3 color = mix(horizon, zenith, smoothstep(0.0,0.85,dir.y));
  float sunDistance = length(dir-sunDirection);
  float sunDisc = 1.0-smoothstep(0.016,0.020,sunDistance);
  float sunHalo = exp(-sunDistance*22.0)*0.4 + exp(-sunDistance*6.0)*0.06;
  color += (sunDisc*vec3(1.0,0.86,0.60) + sunHalo*vec3(1.0,0.62,0.30))*(1.0-night);

  float moonDistance = length(dir-moonDirection);
  float moonDisc = 1.0-smoothstep(0.023,0.026,moonDistance);
  vec3 right = normalize(cross(moonDirection,vec3(0,1,0)));
  vec3 up = cross(right,moonDirection);
  vec2 moonUv = vec2(dot(dir,right),dot(dir,up))/0.025;
  float craters = fbm(moonUv*4.0);
  vec3 moonColor = vec3(0.76,0.81,0.88)*(0.68+craters*0.45);
  color += exp(-moonDistance*20.0)*vec3(0.08,0.11,0.17)*night;
  color = mix(color, moonColor, moonDisc*night);

  vec2 starGrid = vec2(atan(dir.x,dir.z)*190.0,asin(clamp(dir.y,-1.0,1.0))*190.0);
  vec2 cell = floor(starGrid);
  vec2 starCenter = vec2(hash(cell+3.0),hash(cell+9.0))*0.6+0.2;
  float star = (1.0-smoothstep(0.035,0.19,length(fract(starGrid)-starCenter)))
    * step(0.992,hash(cell))*smoothstep(0.03,0.25,dir.y);
  color += star*night*vec3(0.82,0.89,1.0)*(1.0-moonDisc);

  // A seamless cloud plane projected across the dome; no external assets or animated noise.
  vec2 cloudUv = dir.xz / (max(dir.y,0.0)+0.25)*2.4;
  float cloud = smoothstep(0.48,0.72,fbm(cloudUv+vec2(12,5)));
  cloud *= smoothstep(0.01,0.2,dir.y)*0.53;
  vec3 cloudColor = mix(vec3(0.86,0.88,0.87),vec3(0.78,0.48,0.36),sunset);
  cloudColor = mix(cloudColor,vec3(0.055,0.075,0.12),night);
  color = mix(color,cloudColor,cloud);
  gl_FragColor = vec4(color,1.0);
  #include <colorspace_fragment>
}`;

export default function SkyEnvironment({
  hour,
  night,
  horizon,
}: {
  hour: number;
  night: number;
  horizon: THREE.Color;
}) {
  const dome = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      horizon: { value: horizon },
      sunDirection: { value: celestialDirection(hour, false) },
      moonDirection: { value: celestialDirection(hour, true) },
      night: { value: night },
      sunset: { value: THREE.MathUtils.smoothstep(hour, 15, 18) * (1 - night) },
    }),
    [hour, night, horizon],
  );
  useFrame(({ camera }) => {
    dome.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={dome} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[220, 32, 20]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}
