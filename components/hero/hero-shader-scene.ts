// 첫 화면 셰이더 — 같은 구도의 사진 3장(도면 스케치 → 낮 공간 → 조명 켜진 저녁)을 진행도로 잇는다.
//   0.00~0.30  빈 종이에 도면이 그려진다 (사업 계획 = 선)
//   0.30~0.66  먹이 번지듯 도면이 실제 공간이 된다 (공간 설계 = 면)
//   0.70~1.00  밝은 조명부터 불이 켜진다 (오픈 후 = 빛)
// three.js 는 이 파일에서만 쓰고, hero 컴포넌트가 동적 import 한다(첫 화면 글·사진이 먼저 뜨게).
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSketch;
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform float uFocusX;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uPaper;

  // 값 노이즈 + fbm — 먹 번짐 경계용
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    // object-fit: cover + 초점(가로) 지정 + 아주 느린 줌 + 마우스 시차
    float screenAspect = uRes.x / uRes.y;
    float imgAspect = uImg.x / uImg.y;
    vec2 scale = screenAspect > imgAspect
      ? vec2(1.0, imgAspect / screenAspect)
      : vec2(screenAspect / imgAspect, 1.0);
    vec2 uv = (vUv - 0.5) * scale;
    uv.x += screenAspect > imgAspect ? 0.0 : (uFocusX - 0.5) * (1.0 - scale.x);
    float zoom = 1.06 - uProgress * 0.05;
    uv = uv / zoom + 0.5 + uMouse * vec2(0.010, 0.006);

    vec3 sketch = texture2D(uSketch, uv).rgb;
    vec3 day = texture2D(uDay, uv).rgb;
    vec3 night = texture2D(uNight, uv).rgb;

    // 1) 빈 종이 → 도면: 왼쪽 위에서 오른쪽 아래로 펜이 지나가듯, 경계는 노이즈로 흔들린다
    float n1 = fbm(uv * 4.0);
    float sweep = (uv.x * 0.6 + (1.0 - uv.y) * 0.4);
    float drawT = smoothstep(0.0, 0.30, uProgress) * 1.35;
    float drawn = smoothstep(drawT - 0.12, drawT, sweep + n1 * 0.25);
    vec3 col = mix(sketch, uPaper, drawn);

    // 2) 도면 → 낮 공간: 먹이 번지듯 퍼지는 경계, 경계에 옅은 먹빛
    float n2 = fbm(uv * 2.4 + vec2(uTime * 0.015, 0.0));
    float washT = smoothstep(0.30, 0.66, uProgress) * 1.25;
    float wash = smoothstep(washT - 0.10, washT, n2 + 0.08);
    float washMask = 1.0 - wash;
    float rim = smoothstep(0.0, 0.05, washT - n2 - 0.08) * (1.0 - smoothstep(0.05, 0.14, washT - n2 - 0.08));
    col = mix(col, day, washMask);
    col = mix(col, col * vec3(0.78, 0.72, 0.66), rim * 0.55 * step(0.001, washT));

    // 3) 낮 → 저녁: 밝은 곳(조명)부터 켜진다
    float lightT = smoothstep(0.70, 1.0, uProgress);
    float lum = luma(night);
    float on = smoothstep(1.0 - lightT * 1.6, 1.0 - lightT * 1.6 + 0.35, lum + lightT * 0.55);
    col = mix(col, night, clamp(on * lightT * 1.4, 0.0, 1.0));

    // 비네트 + 아주 옅은 필름 그레인
    vec2 d = vUv - 0.5;
    col *= 1.0 - dot(d, d) * 0.35;
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export type HeroShaderScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  start: () => void;
  stop: () => void;
  resize: () => void;
  dispose: () => void;
};

export async function createHeroShaderScene(
  canvas: HTMLCanvasElement,
  srcs: { sketch: string; day: string; night: string },
  opts: { focusX: number; paper: string }
): Promise<HeroShaderScene> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const loader = new THREE.TextureLoader();
  const load = (src: string) =>
    loader.loadAsync(src).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      return t;
    });
  const [sketch, day, night] = await Promise.all([load(srcs.sketch), load(srcs.day), load(srcs.night)]);
  const image = sketch.image as { width: number; height: number };

  const uniforms = {
    uSketch: { value: sketch },
    uDay: { value: day },
    uNight: { value: night },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(image.width, image.height) },
    uFocusX: { value: opts.focusX },
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPaper: { value: new THREE.Color(opts.paper) },
  };
  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  const scene = new THREE.Scene();
  scene.add(mesh);
  const camera = new THREE.Camera();

  let target = 0;
  const mouseTarget = new THREE.Vector2(0, 0);
  let raf = 0;
  let running = false;
  const clock = new THREE.Clock();

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    // 프레임 수가 아니라 시간 기준으로 따라간다 — 느린 휴대폰(30fps)에서도 같은 속도.
    const dt = Math.min(clock.getDelta(), 0.1);
    uniforms.uTime.value = clock.elapsedTime;
    const follow = 1 - Math.pow(1 - 0.09, dt * 60);
    uniforms.uProgress.value += (target - uniforms.uProgress.value) * follow;
    uniforms.uMouse.value.lerp(mouseTarget, 1 - Math.pow(1 - 0.05, dt * 60));
    renderer.render(scene, camera);
  }

  resize();
  return {
    setProgress(p) {
      target = Math.min(1, Math.max(0, p));
    },
    setPointer(x, y) {
      mouseTarget.set(x, y);
    },
    start() {
      if (running) return;
      running = true;
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      [sketch, day, night].forEach((t) => t.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
