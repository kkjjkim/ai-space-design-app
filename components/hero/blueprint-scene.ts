// 첫 화면 3D — "도면이 가게가 된다".
// 선으로만 그린 매장(바닥·벽·카운터·선반·조명·테이블)이 진행도(progress 0→1)에 따라
//   0.00~0.35  선이 하나씩 그려지고 (사업 계획 = 도면)
//   0.35~0.70  면·재질이 차오르고 (공간 설계)
//   0.70~1.00  조명이 켜져 운영 중인 가게가 된다 (오픈 후 매출)
// three.js 는 이 파일에서만 쓰고, 이 파일은 blueprint-hero 에서 동적 import 한다(첫 화면 글이 먼저 뜨게).
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

type Part = {
  mesh: THREE.Mesh;
  lines: LineSegments2;
  // 선이 나타나는 시점(0~0.35 안), 면이 차오르는 시점(0.35~0.7 안)
  lineAt: number;
  fillAt: number;
  baseColor: THREE.Color;
  litColor: THREE.Color;
};

const INK = new THREE.Color("#2a2520"); // 차콜 선
const PAPER = new THREE.Color("#efe9df"); // 도면 단계의 면 색

function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export type BlueprintScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  start: () => void;
  stop: () => void;
  resize: () => void;
  dispose: () => void;
};

export function createBlueprintScene(canvas: HTMLCanvasElement): BlueprintScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const lookAt = new THREE.Vector3(0, 1.0, -0.6);

  const root = new THREE.Group();
  scene.add(root);

  // ── 빛 ──────────────────────────────────────────────
  const hemi = new THREE.HemisphereLight("#fff8ee", "#d9cbb6", 1.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff4e2", 1.4);
  sun.position.set(6, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  // ── 부품 만들기 ──────────────────────────────────────
  const parts: Part[] = [];
  const disposables: { dispose: () => void }[] = [];
  const lineMaterials: LineMaterial[] = [];
  let order = 0;
  const TOTAL = 26; // 대략적인 부품 수 — 선·면 등장 간격 계산용

  function add(
    geometry: THREE.BufferGeometry,
    position: [number, number, number],
    lit: string,
    opts: { rotationY?: number; castShadow?: boolean; receiveShadow?: boolean; parent?: THREE.Object3D } = {}
  ) {
    const i = order++;
    const material = new THREE.MeshStandardMaterial({
      color: PAPER.clone(),
      roughness: 0.82,
      metalness: 0,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (opts.rotationY) mesh.rotation.y = opts.rotationY;
    mesh.castShadow = opts.castShadow ?? true;
    mesh.receiveShadow = opts.receiveShadow ?? true;

    // 기본 선은 1px 고정이라 너무 가늘다 → 픽셀 굵기를 줄 수 있는 LineSegments2 사용.
    const edges = new THREE.EdgesGeometry(geometry, 20);
    const lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const lineMaterial = new LineMaterial({ color: INK, linewidth: 1.4, transparent: true, opacity: 0 });
    lineMaterials.push(lineMaterial);
    const lines = new LineSegments2(lineGeometry, lineMaterial);
    mesh.add(lines);
    (opts.parent ?? root).add(mesh);

    disposables.push(geometry, material, edges, lineGeometry, lineMaterial);
    parts.push({
      mesh,
      lines,
      lineAt: 0.02 + (i / TOTAL) * 0.26,
      fillAt: 0.36 + (i / TOTAL) * 0.24,
      baseColor: PAPER.clone(),
      litColor: new THREE.Color(lit),
    });
    return mesh;
  }

  // 바닥·벽 (앞쪽이 트인 단면 모형)
  add(new THREE.BoxGeometry(8, 0.12, 6), [0, -0.06, 0], "#b08a63", { castShadow: false }); // 오크 바닥
  add(new THREE.BoxGeometry(8, 3.4, 0.14), [0, 1.7, -3], "#e9dccb", { castShadow: false }); // 뒷벽
  add(new THREE.BoxGeometry(0.14, 3.4, 6), [-4, 1.7, 0], "#e3d3bf", { castShadow: false }); // 옆벽
  add(new THREE.BoxGeometry(3.2, 0.02, 2.2), [-1.2, 0.01, 0.6], "#8c6f55", { castShadow: false }); // 러그

  // 뒷벽 선반 3단 + 간판 패널
  for (let s = 0; s < 3; s++) {
    add(new THREE.BoxGeometry(2.6, 0.06, 0.36), [-1.9, 1.0 + s * 0.6, -2.75], "#6f5440");
  }
  add(new THREE.BoxGeometry(1.8, 0.7, 0.06), [1.6, 2.55, -2.9], "#2d2823");

  // 카운터 (몸통 + 상판)
  add(new THREE.BoxGeometry(3.0, 1.0, 0.8), [1.5, 0.5, -1.7], "#3a332c");
  add(new THREE.BoxGeometry(3.2, 0.06, 0.95), [1.5, 1.03, -1.7], "#d8cbb8");

  // 펜던트 조명 3개 (줄 + 갓) — 켜질 때 전구가 빛난다
  const bulbs: THREE.Mesh[] = [];
  const lamps: THREE.PointLight[] = [];
  for (let l = 0; l < 3; l++) {
    const x = 0.6 + l * 0.9;
    add(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 4), [x, 2.8, -1.7], "#2a2520", { castShadow: false });
    add(new THREE.ConeGeometry(0.22, 0.26, 24, 1, true), [x, 2.1, -1.7], "#b8925a", { castShadow: false });
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: "#fff3d6",
      emissive: new THREE.Color("#ffcf8a"),
      emissiveIntensity: 0,
    });
    const bulbGeometry = new THREE.SphereGeometry(0.07, 16, 12);
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(x, 1.98, -1.7);
    bulb.visible = false;
    root.add(bulb);
    bulbs.push(bulb);
    disposables.push(bulbGeometry, bulbMaterial);
    const lamp = new THREE.PointLight("#ffc98a", 0, 5, 1.6);
    lamp.position.set(x, 1.85, -1.7);
    root.add(lamp);
    lamps.push(lamp);
  }

  // 원형 테이블 2개 + 의자
  const tables: [number, number][] = [
    [-1.9, 0.9],
    [-0.4, 0.2],
  ];
  for (const [tx, tz] of tables) {
    add(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32), [tx, 0.74, tz], "#d9c7ae");
    add(new THREE.CylinderGeometry(0.05, 0.08, 0.72, 12), [tx, 0.36, tz], "#2f2924");
    for (let c = 0; c < 2; c++) {
      const a = c * Math.PI + 0.5;
      add(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 20), [tx + Math.cos(a) * 0.75, 0.46, tz + Math.sin(a) * 0.75], "#7d5e45");
    }
  }

  // 큰 화분
  add(new THREE.CylinderGeometry(0.32, 0.26, 0.6, 20), [-3.3, 0.3, -2.3], "#c9b59a");
  add(new THREE.IcosahedronGeometry(0.6, 1), [-3.3, 1.15, -2.3], "#5d6b4c");

  // ── 카메라 배치 (화면 비율에 맞게 멀어짐) ───────────────
  function placeCamera() {
    const { clientWidth: w, clientHeight: h } = canvas;
    const aspect = Math.max(w, 1) / Math.max(h, 1);
    camera.aspect = aspect;
    // 세로 화면(휴대폰)에선 더 멀리서 봐야 매장 전체가 들어온다.
    const distance = aspect < 0.8 ? 33 : aspect < 1.2 ? 29 : 25;
    const dir = new THREE.Vector3(0.62, 0.48, 0.62).normalize();
    camera.position.copy(lookAt).addScaledVector(dir, distance);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    lineMaterials.forEach((m) => m.resolution.set(w, h));
  }

  // ── 상태 ──────────────────────────────────────────
  let target = 0;
  let current = 0;
  const pointer = new THREE.Vector2(0, 0);
  const tilt = new THREE.Vector2(0, 0);
  let raf = 0;
  let running = false;

  function apply(p: number) {
    for (const part of parts) {
      const lineIn = smooth(part.lineAt, part.lineAt + 0.06, p);
      const fill = smooth(part.fillAt, part.fillAt + 0.1, p);
      const mat = part.mesh.material as THREE.MeshStandardMaterial;
      // 면이 차오르면 선은 은은한 윤곽으로만 남는다(건축 모형 느낌)
      (part.lines.material as LineMaterial).opacity = lineIn * (1 - fill * 0.78);
      mat.opacity = fill;
      mat.visible = fill > 0.001;
      mat.color.copy(part.baseColor).lerp(part.litColor, smooth(0.5, 0.85, p));
      mat.depthWrite = fill > 0.95;
      part.mesh.castShadow = fill > 0.95;
    }
    const lightUp = smooth(0.72, 0.95, p);
    bulbs.forEach((b) => {
      b.visible = p > 0.62;
      (b.material as THREE.MeshStandardMaterial).emissiveIntensity = lightUp * 3.2;
    });
    lamps.forEach((l) => (l.intensity = lightUp * 6));
    // 낮 빛은 줄이고 실내 조명이 주인공이 되게
    hemi.intensity = 1.6 - lightUp * 0.75;
    sun.intensity = 1.4 - lightUp * 0.9;
    renderer.toneMappingExposure = 1.05 + lightUp * 0.1;
    // 진행에 따라 카메라가 살짝 다가간다
    root.position.y = -0.1 * p;
    root.scale.setScalar(1 + p * 0.06);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    current += (target - current) * 0.08;
    tilt.x += (pointer.x - tilt.x) * 0.05;
    tilt.y += (pointer.y - tilt.y) * 0.05;
    root.rotation.y = tilt.x * 0.12;
    root.rotation.x = tilt.y * 0.04;
    apply(current);
    renderer.render(scene, camera);
  }

  placeCamera();
  apply(0);

  return {
    setProgress(p) {
      target = Math.min(1, Math.max(0, p));
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize: placeCamera,
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
