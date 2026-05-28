import React, { useEffect, useRef } from 'react';

const VS = `
attribute vec2 pos;
void main() { gl_Position = vec4(pos, 0.0, 1.0); }
`;

const FS = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_click;
uniform float u_ct;

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  float t = u_time * 0.13;

  // 6 control points — colors hand-picked to match the warm peach/mauve reference
  vec2 p0 = vec2(0.14, 0.82); vec3 c0 = vec3(0.88, 0.66, 0.50);  // peach (low-left)
  vec2 p1 = vec2(0.30, 0.18); vec3 c1 = vec3(0.36, 0.20, 0.38);  // deep purple
  vec2 p2 = vec2(0.75, 0.22); vec3 c2 = vec3(0.58, 0.32, 0.45);  // mauve
  vec2 p3 = vec2(0.88, 0.78); vec3 c3 = vec3(0.32, 0.18, 0.30);  // wine
  vec2 p4 = vec2(0.55, 0.55); vec3 c4 = vec3(0.72, 0.45, 0.52);  // rose (mouse-driven)
  vec2 p5 = vec2(0.40, 0.92); vec3 c5 = vec3(0.55, 0.30, 0.40);  // plum

  // Gentle drift
  p0 += vec2(sin(t*0.7)*0.045, cos(t*0.9)*0.035);
  p1 += vec2(cos(t*0.8)*0.04,  sin(t*1.1)*0.035);
  p2 += vec2(sin(t*0.9)*0.04,  cos(t*0.7)*0.04);
  p3 += vec2(cos(t*1.1)*0.045, sin(t*0.8)*0.03);
  p5 += vec2(sin(t*1.2)*0.04,  cos(t*0.6)*0.04);

  // Mouse drags the central point
  p4 = mix(p4, u_mouse, 0.85);

  // Click saturates colors
  float sat = 1.0 + exp(-u_ct*2.0) * 0.45;

  // Shepard's inverse-distance weighted blend
  vec3  col = vec3(0.0);
  float wsum = 0.0;
  float pw = 2.4;

  float d;
  d = length((uv - p0)*vec2(ar,1.0)); float w0 = 1.0/pow(d + 0.07, pw); col += c0*w0; wsum += w0;
  d = length((uv - p1)*vec2(ar,1.0)); float w1 = 1.0/pow(d + 0.07, pw); col += c1*w1; wsum += w1;
  d = length((uv - p2)*vec2(ar,1.0)); float w2 = 1.0/pow(d + 0.07, pw); col += c2*w2; wsum += w2;
  d = length((uv - p3)*vec2(ar,1.0)); float w3 = 1.0/pow(d + 0.07, pw); col += c3*w3; wsum += w3;
  d = length((uv - p4)*vec2(ar,1.0)); float w4 = 1.0/pow(d + 0.06, pw); col += c4*w4; wsum += w4;
  d = length((uv - p5)*vec2(ar,1.0)); float w5 = 1.0/pow(d + 0.07, pw); col += c5*w5; wsum += w5;

  col /= wsum;

  // Bump saturation around mean luma
  float l = dot(col, vec3(0.3, 0.59, 0.11));
  col = mix(vec3(l), col, sat);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const MeshGradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL is not supported in this browser.');
      return;
    }

    const mkShader = (src: string, type: number) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s), '\n---\n', src);
        return null;
      }
      return s;
    };

    const mkProgram = (vsSrc: string, fsSrc: string) => {
      const vs = mkShader(vsSrc, gl.VERTEX_SHADER);
      const fs = mkShader(fsSrc, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      
      const p = gl.createProgram();
      if (!p) return null;
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    };

    const program = mkProgram(VS, FS);
    if (!program) return;

    const locations = {
      aPos: gl.getAttribLocation(program, 'pos'),
      uRes: gl.getUniformLocation(program, 'u_res'),
      uTime: gl.getUniformLocation(program, 'u_time'),
      uMouse: gl.getUniformLocation(program, 'u_mouse'),
      uClick: gl.getUniformLocation(program, 'u_click'),
      uCt: gl.getUniformLocation(program, 'u_ct'),
    };

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const shaderStart = performance.now();
    const rawMouse = [0.5, 0.55];
    const smMouse = [0.5, 0.55];
    const clickPos = [0.5, 0.55];
    let clickTime = 999;
    let lastTs = 0;

    const setMouse = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      rawMouse[0] = (cx - r.left) / r.width;
      rawMouse[1] = 1.0 - (cy - r.top) / r.height;
    };

    const fireClick = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      clickPos[0] = (cx - r.left) / r.width;
      clickPos[1] = 1.0 - (cy - r.top) / r.height;
      clickTime = 0;
    };

    const handleMouseMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY);
    const handleMouseDown = (e: MouseEvent) => fireClick(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        fireClick(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    let animId: number;

    const render = (ts: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      clickTime = Math.min(clickTime + dt, 999);

      // Smooth mouse easing
      const lf = 1.0 - Math.pow(0.08, dt * 10);
      smMouse[0] += (rawMouse[0] - smMouse[0]) * lf;
      smMouse[1] += (rawMouse[1] - smMouse[1]) * lf;

      const elapsed = (ts - shaderStart) / 1000;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(locations.aPos);
      gl.vertexAttribPointer(locations.aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(locations.uRes, canvas.width, canvas.height);
      gl.uniform1f(locations.uTime, elapsed);
      gl.uniform2f(locations.uMouse, smMouse[0], smMouse[1]);
      gl.uniform2f(locations.uClick, clickPos[0], clickPos[1]);
      gl.uniform1f(locations.uCt, clickTime);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
};
