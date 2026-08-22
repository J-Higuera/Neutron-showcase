import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import StageCanvas from "./StageCanvas";

// The loan desk's empty pedestal: brass wireframe, patiently turning.
// Lives on the GL side so the desk's DOM ships in the shell chunk.

function Plinth({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += Math.min(dt, 0.1) * 0.35;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
  });
  return (
    <group ref={group} position={[0, -0.4, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.72, 0.8, 0.7, 24, 3]} />
        <meshBasicMaterial color={0x5b74ff} wireframe transparent opacity={0.26} />
      </mesh>
      <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.008, 8, 64]} />
        <meshBasicMaterial color={0x5b74ff} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color={0xeef1f7} wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

export default function PlinthView({ reduced }: { reduced: boolean }) {
  return (
    <StageCanvas zIndex={1}>
      <ambientLight intensity={0.5} />
      <Plinth reduced={reduced} />
    </StageCanvas>
  );
}
