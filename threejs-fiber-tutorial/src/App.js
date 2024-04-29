import "./App.css";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import { config, useSpring, animated } from "@react-spring/three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';  // 正しいパスと仮定

// TextGeometryをReact Three Fiberの使用可能なコンポーネントに拡張
extend({ TextGeometry });

function Box({ position, col, url, txt }) {
  const meshRef = useRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => (meshRef.current.rotation.x += 0.01));

  const { scale } = useSpring({
    scale: clicked ? 2 : 1,
    config: config.wobbly,
  });

  const font = useMemo(() => new FontLoader().parse(helvetikerFont), []);

  return (
    <>
      <animated.mesh
        position={position}
        ref={meshRef}
        onClick={() => { setClicked(!clicked); window.location.href = url; }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? col : "orange"} />
      </animated.mesh>
      {hovered && (
        <mesh position={[position[0]-0.5, position[1] + 1.5, position[2]]}>
          <textGeometry args={[txt, { font, size: 0.5, height: 0.1 }]} />
          <meshStandardMaterial color={col} />
        </mesh>
      )}
    </>
  );
}

function Text({ position, col, txt }) {
  const font = useMemo(() => new FontLoader().parse(helvetikerFont), []);
  return (
    <mesh position={position}>
      <textGeometry args={[txt, { font, size: 1, height: 0.1 }]} />
      <meshStandardMaterial color={col} />
    </mesh>
  );
}

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas>
          <Text position={[-2, 2, 0]} col="#000000" txt="bearl" />

          <Box position={[-1, 0, 0]} col = "#00ff00" url="https://qiita.com/bearl27" txt="qiita" />
          <Box position={[1, 0, 0]} col="#000000" url="https://github.com/bearl27" txt="github" />
          <Box position={[3.2, 0, 0]} col="#aaaaff" url="https://twitter.com/bearl_develop" txt="twitter" />
          <ambientLight intensity={1.0} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={1.0} />
          <directionalLight color="#ffffff" position={[0, 10, 0]} intensity={2.0} />
        </Canvas>
      </div>
    </>
  );
}

export default App;