import * as THREE from "../vendor/three/three.module.js";
import { LammpsClient } from "../vendor/lammps.js/client.js";

const root = document.getElementById("polymer-sim");

if (root) {
  const canvas = document.getElementById("polymer-canvas");
  const statusEl = document.getElementById("sim-status");
  const stateEl = document.getElementById("sim-state");
  const rgEl = document.getElementById("sim-rg");
  const e2eEl = document.getElementById("sim-e2e");
  const stepEl = document.getElementById("sim-step");

  const inputUrl = root.dataset.inputUrl;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-13, 13, 10, -10, 0.1, 100);
  camera.position.set(0, 0, 24);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xf4f0e8, 1.25);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(0, 0, 12);
  const fill = new THREE.DirectionalLight(0x7ab2aa, 0.55);
  fill.position.set(-8, 10, 6);
  scene.add(ambient, key, fill);

  const boxGeometry = new THREE.BufferGeometry();
  const boxMaterial = new THREE.LineBasicMaterial({
    color: 0x2a5d57,
    transparent: true,
    opacity: 0.34,
  });
  const boxLines = new THREE.LineSegments(boxGeometry, boxMaterial);
  scene.add(boxLines);

  const guideGeometry = new THREE.PlaneGeometry(28, 28);
  const guideMaterial = new THREE.MeshBasicMaterial({
    color: 0xf5f1e9,
    transparent: true,
    opacity: 0.9,
  });
  const guidePlane = new THREE.Mesh(guideGeometry, guideMaterial);
  guidePlane.position.z = -0.8;
  scene.add(guidePlane);

  const beadGeometry = new THREE.SphereGeometry(0.34, 28, 20);
  const beadMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x72a79f,
    metalness: 0.06,
    roughness: 0.28,
    clearcoat: 0.45,
    clearcoatRoughness: 0.5,
  });
  const maxBeads = 64;
  const beads = new THREE.InstancedMesh(beadGeometry, beadMaterial, maxBeads);
  beads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(beads);

  const bondGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1, 14, 1, true);
  const bondMaterial = new THREE.MeshStandardMaterial({
    color: 0x4e7f7d,
    metalness: 0.02,
    roughness: 0.72,
    transparent: true,
    opacity: 0.82,
  });
  const maxBonds = 63;
  const bondMeshes = [];
  for (let i = 0; i < maxBonds; i += 1) {
    const mesh = new THREE.Mesh(bondGeometry, bondMaterial);
    mesh.visible = false;
    scene.add(mesh);
    bondMeshes.push(mesh);
  }

  const tmpMatrix = new THREE.Matrix4();
  const tmpPosition = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();
  const tmpStart = new THREE.Vector3();
  const tmpEnd = new THREE.Vector3();
  const tmpMid = new THREE.Vector3();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const beadColor = new THREE.Color();

  let beadCount = 0;
  let targetPositions = null;
  let displayPositions = null;
  let boxBuffer = null;
  let client = null;
  let rafId = 0;

  const resize = () => {
    const rect = root.querySelector(".simulation-stage").getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    const aspect = rect.width / rect.height;
    const width = 13;
    const height = width / aspect;
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
  };

  const formatNumber = (value) => value.toFixed(2);

  const classifyState = (rg, endToEnd) => {
    if (rg < 3.0 && endToEnd < 8.0) return "Compact";
    if (rg > 4.25 || endToEnd > 12.0) return "Extended";
    return "Fluctuating";
  };

  const updateMetrics = (positions, count) => {
    if (!positions || !count) return;

    let cx = 0;
    let cy = 0;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      cx += positions[idx];
      cy += positions[idx + 1];
    }
    cx /= count;
    cy /= count;

    let rg2 = 0;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const dx = positions[idx] - cx;
      const dy = positions[idx + 1] - cy;
      rg2 += dx * dx + dy * dy;
    }
    const rg = Math.sqrt(rg2 / count);

    const dx = positions[(count - 1) * 3] - positions[0];
    const dy = positions[(count - 1) * 3 + 1] - positions[1];
    const endToEnd = Math.sqrt(dx * dx + dy * dy);

    rgEl.textContent = formatNumber(rg);
    e2eEl.textContent = formatNumber(endToEnd);
    stateEl.textContent = classifyState(rg, endToEnd);
  };

  const updateBox = () => {
    if (!boxBuffer) return;
    boxGeometry.setAttribute("position", new THREE.Float32BufferAttribute(boxBuffer, 3));
    boxGeometry.computeBoundingSphere();
  };

  const computeBoxBuffer = (matrix, origin) => {
    if (!matrix?.length || !origin?.length) return null;
    const ax = matrix[0];
    const ay = matrix[1];
    const bx = matrix[3];
    const by = matrix[4];
    const ox = origin[0];
    const oy = origin[1];

    const corners = [
      [ox, oy, 0],
      [ox + ax, oy + ay, 0],
      [ox + ax + bx, oy + ay + by, 0],
      [ox + bx, oy + by, 0],
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];
    const data = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], idx) => {
      const off = idx * 6;
      data[off + 0] = corners[a][0];
      data[off + 1] = corners[a][1];
      data[off + 2] = 0;
      data[off + 3] = corners[b][0];
      data[off + 4] = corners[b][1];
      data[off + 5] = 0;
    });
    return data;
  };

  const renderChain = () => {
    if (!displayPositions || !targetPositions) return;

    for (let i = 0; i < displayPositions.length; i += 1) {
      displayPositions[i] += (targetPositions[i] - displayPositions[i]) * 0.18;
    }

    beads.count = beadCount;
    for (let i = 0; i < beadCount; i += 1) {
      const idx = i * 3;
      tmpMatrix.makeTranslation(displayPositions[idx], displayPositions[idx + 1], displayPositions[idx + 2]);
      beads.setMatrixAt(i, tmpMatrix);

      const t = beadCount > 1 ? i / (beadCount - 1) : 0;
      beadColor.setHSL(0.47 - t * 0.1, 0.36 + t * 0.08, 0.62 - t * 0.06);
      beads.setColorAt(i, beadColor);
    }
    beads.instanceMatrix.needsUpdate = true;
    if (beads.instanceColor) beads.instanceColor.needsUpdate = true;

    for (let i = 0; i < bondMeshes.length; i += 1) {
      const mesh = bondMeshes[i];
      if (i >= beadCount - 1) {
        mesh.visible = false;
        continue;
      }

      const startIdx = i * 3;
      const endIdx = (i + 1) * 3;
      tmpStart.set(displayPositions[startIdx], displayPositions[startIdx + 1], displayPositions[startIdx + 2]);
      tmpEnd.set(displayPositions[endIdx], displayPositions[endIdx + 1], displayPositions[endIdx + 2]);
      tmpMid.copy(tmpStart).add(tmpEnd).multiplyScalar(0.5);

      const direction = tmpEnd.clone().sub(tmpStart);
      const length = direction.length();
      direction.normalize();

      tmpQuat.setFromUnitVectors(yAxis, direction);
      tmpScale.set(1, length, 1);
      mesh.position.copy(tmpMid);
      mesh.quaternion.copy(tmpQuat);
      mesh.scale.copy(tmpScale);
      mesh.visible = true;
    }

    updateMetrics(displayPositions, beadCount);
  };

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    renderChain();
    renderer.render(scene, camera);
  };

  const boot = async () => {
    try {
      statusEl.textContent = "Fetching LAMMPS input...";
      const script = await fetch(inputUrl).then((res) => {
        if (!res.ok) {
          throw new Error("Could not load the polymer input file.");
        }
        return res.text();
      });

      statusEl.textContent = "Starting LAMMPS.js...";
      client = await LammpsClient.create({
        print: () => undefined,
        printErr: () => undefined,
      });
      client.start();
      resize();
      animate(0);

      client.runScriptAsync(
        script,
        async (data) => {
          if (data.particles) {
            beadCount = Math.min(data.particles.count, maxBeads);
            targetPositions = data.particles.positions.slice(0, beadCount * 3);
            if (!displayPositions || displayPositions.length !== targetPositions.length) {
              displayPositions = targetPositions.slice();
            }
          }

          if (data.box) {
            boxBuffer = computeBoxBuffer(data.box.matrix, data.box.origin);
            updateBox();
          }

          stepEl.textContent = `${Math.round(data.step)}`;
          if (statusEl.textContent !== "Running bead-spring polymer dynamics") {
            statusEl.textContent = "Running bead-spring polymer dynamics";
          }

          await new Promise(requestAnimationFrame);
        },
        {
          every: 12,
          copy: true,
        }
      ).then(() => {
        statusEl.textContent = "Simulation complete";
      }).catch((error) => {
        statusEl.textContent = "Simulation stopped";
        stateEl.textContent = "Runtime error";
        console.error(error);
      });
    } catch (error) {
      statusEl.textContent = "Simulation failed to initialize.";
      stateEl.textContent = "Unavailable";
      console.error(error);
    }
  };

  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
    client?.dispose();
    renderer.dispose();
  });

  boot();
}
