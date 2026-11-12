async function He(s){return(await(await fetch(s)).json()).map(l=>({name:l.img_name,width:l.width,height:l.height,fx:l.fx,fy:l.fy,position:l.position,rotation:l.rotation}))}var $e=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],ze=(s,t)=>s[0]*t[0]+s[1]*t[1]+s[2]*t[2],se=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],Se=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],Jt=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]],We=s=>se(s,1/Math.hypot(...s)),E=class s{constructor(t,l,e,a,m,u,r,d){this.position=t;this.right=l;this.down=e;this.forward=a;this.fx=m;this.fy=u;this.width=r;this.height=d}position;right;down;forward;fx;fy;width;height;static fromDataset(t){let l=e=>[t.rotation[0][e],t.rotation[1][e],t.rotation[2][e]];return new s([...t.position],l(0),l(1),l(2),t.fx,t.fy,t.width,t.height)}view(){let t=this.right,l=this.down,e=this.forward,a=this.position;return new Float32Array([t[0],l[0],e[0],0,t[1],l[1],e[1],0,t[2],l[2],e[2],0,-ze(t,a),-ze(l,a),-ze(e,a),1])}projection(t,l,e,a){let m=t/this.width,u=l/this.height,r=this.fx*m,d=Math.abs(m/u-1)<.01?this.fy*u:this.fy*m,y=a/(a-e),g=-a*e/(a-e);return new Float32Array([2*r/t,0,0,0,0,-2*d/l,0,0,0,0,y,1,0,0,g,0])}orbit(t,l,e,a){let m=(r,d,y)=>{let g=Math.cos(y),v=Math.sin(y);return Se(Se(se(r,g),se(Jt(d,r),v)),se(d,ze(d,r)*(1-g)))},u=(r,d)=>{this.position=Se(t,m($e(this.position,t),r,d)),this.right=m(this.right,r,d),this.down=m(this.down,r,d),this.forward=m(this.forward,r,d)};u(We(l),e),u(We(this.right),a)}zoom(t,l){this.position=Se(t,se($e(this.position,t),l))}};function bt(s){let t=[0,0,0,0,0,0,0,0,0],l=[0,0,0],e=[0,0,0];for(let r of s){let d=[r.rotation[0][2],r.rotation[1][2],r.rotation[2][2]];e=$e(e,[r.rotation[0][1],r.rotation[1][1],r.rotation[2][1]]);for(let y=0;y<3;++y)for(let g=0;g<3;++g){let v=(y===g?1:0)-d[y]*d[g];t[3*y+g]+=v,l[y]+=v*r.position[g]}}let a=r=>r[0]*(r[4]*r[8]-r[5]*r[7])-r[1]*(r[3]*r[8]-r[5]*r[6])+r[2]*(r[3]*r[7]-r[4]*r[6]),m=a(t);return{pivot:[0,1,2].map(r=>{let d=[...t];for(let y=0;y<3;++y)d[3*y+r]=l[y];return a(d)/m}),up:We(e)}}async function Xt(s,t,l){let e=await(await fetch(s)).blob(),a=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"});if(a.width!==t||a.height!==l)throw new Error(`${s}: unexpected size`);let u=new OffscreenCanvas(t,l).getContext("2d",{willReadFrequently:!0});return u.drawImage(a,0,0),a.close(),u.getImageData(0,0,t,l).data}function Kt(s,t,l){let e=Math.floor(t/2),a=0,m=0;for(let u=0;u<t;++u){let r=Math.floor(s/2**u)%2;u<2*e?u%2===0?a+=r*2**(u/2):m+=r*2**((u-1)/2):a+=r*2**e}return m*l+a}var oe=(s,t,l,e)=>t+s/(2**e-1)*(l-t);async function wt(s,t,l=!1){let e=await(await fetch(`${s}/meta.json`)).json();if(e.format!=="gaussian-splats-images-1")throw new Error(`${s}: unknown format ${e.format}`);let a=e.count,m=e.width,u=e.height,r=e.ranges,d=1;for(;2**d<Math.max(a,2);)++d;let y=new Uint32Array(a);for(let o=0;o<a;++o)y[o]=4*Kt(o,d,m);let g=(e.sh_degree+1)**2-1,v=["means_l","means_u","scales","quats","extra","sh0",...Array.from({length:g},(o,c)=>`shN_${String(c).padStart(2,"0")}`)],_=0,le=new Map;await Promise.all(v.map(async o=>{le.set(o,await Xt(`${s}/${o}.webp`,m,u)),t(`decoding images ${++_} / ${v.length}`)}));let q=o=>le.get(o),G=r.log_filter!==void 0,z={meta:e,count:a,positions:new Float32Array(3*a),opacities:new Float32Array(a),mip:G,float:null,quantized:null},ce=q("means_l"),M=q("means_u"),D=q("scales"),$=q("quats"),U=q("extra"),F=q("sh0");for(let o=0;o<a;++o){let c=y[o];for(let p=0;p<3;++p){let P=oe(ce[c+p]+256*M[c+p],r.position.lo[p],r.position.hi[p],16);z.positions[3*o+p]=Math.sign(P)*Math.expm1(Math.abs(P))}z.opacities[o]=Math.min(Math.max(U[c]/255,1e-6),1-1e-6)}let C=o=>e.sh_bits[o<3?0:o<8?1:2];if(l){let o={scaleWords:new Uint32Array(a),rotationWords:new Uint32Array(a),shBytes:new Uint8Array(48*a),scaleLo:[...r.log_scale.lo,G?r.log_filter.lo[0]:0],scaleStep:[0,1,2].map(c=>(r.log_scale.hi[c]-r.log_scale.lo[c])/255).concat(G?(r.log_filter.hi[0]-r.log_filter.lo[0])/255:0),shRange:new Float32Array(96)};for(let c=0;c<a;++c){let p=y[c];o.scaleWords[c]=(D[p]|D[p+1]<<8|D[p+2]<<16|(G?U[p+2]:0)<<24)>>>0,o.rotationWords[c]=(U[p+1]|$[p]<<8|$[p+1]<<16|$[p+2]<<24)>>>0;for(let P=0;P<3;++P)o.shBytes[48*c+P]=F[p+P]}for(let c=0;c<3;++c)o.shRange[c]=r.sh0.lo[c],o.shRange[48+c]=(r.sh0.hi[c]-r.sh0.lo[c])/255;for(let c=0;c<g;++c){let p=q(v[6+c]),P=2**C(c)-1;for(let b=0;b<3;++b)o.shRange[3*(c+1)+b]=r.shN.lo[3*c+b],o.shRange[48+3*(c+1)+b]=(r.shN.hi[3*c+b]-r.shN.lo[3*c+b])/P;for(let b=0;b<a;++b)for(let k=0;k<3;++k)o.shBytes[48*b+3*(c+1)+k]=p[y[b]+k]}return z.quantized=o,z}let T={logScales:new Float32Array(3*a),rotations:new Float32Array(4*a),sh:new Float32Array(48*a),filter3D:G?new Float32Array(a):null};for(let o=0;o<a;++o){let c=y[o];for(let p=0;p<3;++p)T.logScales[3*o+p]=oe(D[c+p],r.log_scale.lo[p],r.log_scale.hi[p],8),T.rotations[4*o+1+p]=$[c+p]/127.5-1,T.sh[48*o+p]=oe(F[c+p],r.sh0.lo[p],r.sh0.hi[p],8);T.rotations[4*o]=U[c+1]/127.5-1,T.filter3D&&(T.filter3D[o]=Math.exp(oe(U[c+2],r.log_filter.lo[0],r.log_filter.hi[0],8)))}for(let o=0;o<g;++o){let c=C(o),p=q(v[6+o]);for(let P=0;P<a;++P)for(let b=0;b<3;++b)T.sh[48*P+3*(o+1)+b]=oe(p[y[P]+b],r.shN.lo[3*o+b],r.shN.hi[3*o+b],c)}return z.float=T,z}var zt=`// Step 33a: every Gaussian's center as a one-pixel point with its base color (SH coefficient 0), as the C++ viewer's
// points mode (shaders/points.metal) without the point size. A check of the loader, the camera and the WebGPU setup.

struct Frame {
  viewProj: mat4x4f,
}

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> positions: array<vec4f>;   // xyz, alpha
@group(0) @binding(2) var<storage, read> colors: array<vec4f>;      // rgb

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
}

@vertex
fn pointVertex(@builtin(vertex_index) i: u32) -> VertexOut {
  var out: VertexOut;
  out.position = frame.viewProj * vec4f(positions[i].xyz, 1.0);
  if (positions[i].w < 0.1) {   // hide nearly transparent Gaussians, as the C++ point view
    out.position = vec4f(0.0, 0.0, -1.0, 1.0);
  }
  out.color = colors[i].rgb;
  return out;
}

@fragment
fn pointFragment(in: VertexOut) -> @location(0) vec4f {
  return vec4f(in.color, 1.0);
}
`;var St=`// Step 33b: stochastic splats, ported from the C++ viewer (shaders/splats.metal: splatPreprocess, splatQuadVertex,
// stochasticFragment; shaders/gaussian.h: projectGaussian, principalAxes; shaders/sh.h: evalSH). Same math, same
// constants, and the same random thresholds (PCG white noise, or the spatio-temporal blue noise of step 33f), so a
// frame with the same seed is the same random image. Mip-Splatting models: the 2D Mip filter and the 3D filter's
// opacity factor (step 33g). main.ts prepends the attribute bindings and their decoding (sceneScale, sceneRotation,
// coef): attributes_float.wgsl or, by default, attributes_quantized.wgsl (step 33h).
//   preprocess  one thread per Gaussian: project, cull, size the quad, evaluate SH; append to a compact quad list and
//               count it in the indirect draw arguments
//   quadVertex  the quad's corners at the center's depth (instanced triangle strip, 4 vertices)
//   stochasticFragment  alpha at the pixel; survives with probability alpha; the depth test keeps the nearest
//   stochasticMsaaFragment  step 33c: the same with four independent alpha tests per pixel (4x MSAA sample mask)

struct Frame {
  view: mat4x4f,          // world -> camera (x right, y down, z forward)
  proj: mat4x4f,          // camera -> clip, depth in [0, 1]
  cameraPos: vec4f,
  viewport: vec2f,        // pixels
  focal: vec2f,           // fx, fy in pixels
  count: u32,
  shDegree: u32,
  seed: u32,              // random seed of this sample
  blueNoise: u32,         // step 33f: 1 = per-primitive spatio-temporal blue noise, 0 = white noise
  mipFilter: u32,         // step 33g: 0 = none, Mip-Splatting model: 1 = volume ratio, 2 = area ratio (--mip-area)
  pad0: u32, pad1: u32, pad2: u32,
  qScaleLo: vec4f,        // step 33h, quantized scales: log-scale range per axis (xyz), the Mip filter's log f (w):
  qScaleStep: vec4f,      //   value = lo + step * byte
}

struct Quad {             // 64 bytes
  centerMajor: vec4f,     // center (pixels), major semi-axis (pixels)
  minorOpacityDepthId: vec4f,   // minor semi-axis length, opacity, clip depth, Gaussian id (bitcast)
  conic: vec4f,           // inverse 2D covariance (a, b, c)
  color: vec4f,
}

const kMinAlpha = 1.0 / 255.0;
const kMaxAlpha = 0.99;
const kLowPassVariance = 0.3;
const kMipFilterVariance = 0.1;   // step 33g: Mip-Splatting's 2D Mip filter
const kNearPlane = 0.2;
const SH_C0 = 0.28209479177387814;
const SH_C1 = 0.4886025119029199;
const SH_C2 = array<f32, 5>(1.0925484305920792, -1.0925484305920792, 0.31539156525252005, -1.0925484305920792,
                            0.5462742152960396);
const SH_C3 = array<f32, 7>(-0.5900435899266435, 2.890611442640554, -0.4570457994644658, 0.3731763325901154,
                            -0.4570457994644658, 1.445305721320277, -0.5900435899266435);

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> positions: array<vec4f>;   // xyz, opacity (activated)
// bindings 2-4 (and 8): scales, rotations, SH, from the attribute file main.ts prepends
@group(0) @binding(5) var<storage, read_write> quads: array<Quad>;
@group(0) @binding(6) var<storage, read_write> drawArgs: array<atomic<u32>, 4>;   // vertexCount, instanceCount, 0, 0

// Rotation matrix from a unit quaternion (w, x, y, z); WGSL matrices are built from columns, as Metal's.
fn quaternionToMatrix(q: vec4f) -> mat3x3f {
  let w = q.x; let x = q.y; let y = q.z; let z = q.w;
  return mat3x3f(vec3f(1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y)),
                 vec3f(2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)),
                 vec3f(2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y)));
}

fn evalSH(g: u32, dir: vec3f, degree: u32) -> vec3f {
  var result = SH_C0 * coef(g, 0u);
  if (degree > 0u) {
    let x = dir.x; let y = dir.y; let z = dir.z;
    result += -SH_C1 * y * coef(g, 1u) + SH_C1 * z * coef(g, 2u) - SH_C1 * x * coef(g, 3u);
    if (degree > 1u) {
      let xx = x * x; let yy = y * y; let zz = z * z; let xy = x * y; let yz = y * z; let xz = x * z;
      result += SH_C2[0] * xy * coef(g, 4u) + SH_C2[1] * yz * coef(g, 5u) +
                SH_C2[2] * (2.0 * zz - xx - yy) * coef(g, 6u) + SH_C2[3] * xz * coef(g, 7u) +
                SH_C2[4] * (xx - yy) * coef(g, 8u);
      if (degree > 2u) {
        result += SH_C3[0] * y * (3.0 * xx - yy) * coef(g, 9u) + SH_C3[1] * xy * z * coef(g, 10u) +
                  SH_C3[2] * y * (4.0 * zz - xx - yy) * coef(g, 11u) +
                  SH_C3[3] * z * (2.0 * zz - 3.0 * xx - 3.0 * yy) * coef(g, 12u) +
                  SH_C3[4] * x * (4.0 * zz - xx - yy) * coef(g, 13u) + SH_C3[5] * z * (xx - yy) * coef(g, 14u) +
                  SH_C3[6] * x * (xx - 3.0 * yy) * coef(g, 15u);
      }
    }
  }
  return max(result + 0.5, vec3f(0.0));
}

// Step 33g: Mip-Splatting (Yu et al. 2024), as the C++ viewer (shaders/gaussian.h, steps 28a/28c).
// The 3D filter's opacity factor, per view. scale4 = (s', f): the filtered scales s' = sqrt(s^2 + f^2) and the filter
// f. The filtered Gaussian is wider, so its peak opacity is lowered to keep its contribution:
//   mode 1 (Mip-Splatting): by the volume ratio sqrt(det S / det S') = prod s / s'
//   mode 2 (AAA-Gaussians, Steiner et al. 2025): by the area of the cross-section perpendicular to the view ray d,
//          sqrt(A / A'), A = sum_i (r_i . d)^2 prod_{j != i} s_j^2: a face-on disc stays as opaque, dimmed only edge-on.
fn mip3DFactor(mean: vec3f, scale4: vec4f, R: mat3x3f) -> f32 {
  let sp2 = scale4.xyz * scale4.xyz;
  let s2 = max(sp2 - scale4.w * scale4.w, vec3f(0.0));
  if (frame.mipFilter == 1u) { return sqrt(s2.x * s2.y * s2.z / (sp2.x * sp2.y * sp2.z)); }
  let d = normalize(mean - frame.cameraPos.xyz);
  let a = vec3f(dot(R[0], d), dot(R[1], d), dot(R[2], d));
  let a2 = a * a;
  let A = a2.x * s2.y * s2.z + a2.y * s2.x * s2.z + a2.z * s2.x * s2.y;
  let Ap = a2.x * sp2.y * sp2.z + a2.y * sp2.x * sp2.z + a2.z * sp2.x * sp2.y;
  return select(0.0, sqrt(A / Ap), Ap > 0.0);
}

// The 2D Mip filter's opacity factor for the 2D covariance s = (a, b, c) before the filter: the convolution with the
// 0.1 px^2 filter keeps the Gaussian's integral, so a Gaussian smaller than a pixel gets fainter instead of wider.
fn mipOpacityScale(s: vec3f) -> f32 {
  let det0 = s.x * s.z - s.y * s.y;
  let det1 = (s.x + kMipFilterVariance) * (s.z + kMipFilterVariance) - s.y * s.y;
  return select(sqrt(det0 / det1), 0.0, det0 <= 1e-6 || det1 <= 1e-6);
}

@compute @workgroup_size(256)
fn preprocess(@builtin(global_invocation_id) gid: vec3u) {
  let g = gid.x;
  if (g >= frame.count) { return; }
  let p = positions[g];
  var opacity = p.w;
  if (opacity < kMinAlpha) { return; }

  // 3D covariance R S S^T R^T
  let R = quaternionToMatrix(sceneRotation(g));
  let scale4 = sceneScale(g);
  let s = scale4.xyz;
  let M = mat3x3f(R[0] * s.x, R[1] * s.y, R[2] * s.z);
  let cov3D = M * transpose(M);

  // Projection (EWA): camera space, center in pixels, Jacobian clamped at 1.3x the field of view.
  let t = (frame.view * vec4f(p.xyz, 1.0)).xyz;
  if (t.z <= kNearPlane) { return; }
  let f = frame.focal;
  let center = f * t.xy / t.z + 0.5 * frame.viewport;
  let limit = 1.3 * 0.5 * frame.viewport / f;
  let txy = clamp(t.xy / t.z, -limit, limit) * t.z;
  let J0 = vec3f(f.x / t.z, 0.0, -f.x * txy.x / (t.z * t.z));
  let J1 = vec3f(0.0, f.y / t.z, -f.y * txy.y / (t.z * t.z));
  let Wt = transpose(mat3x3f(frame.view[0].xyz, frame.view[1].xyz, frame.view[2].xyz));
  let T0 = J0.x * Wt[0] + J0.y * Wt[1] + J0.z * Wt[2];
  let T1 = J1.x * Wt[0] + J1.y * Wt[1] + J1.z * Wt[2];
  let s2D = vec3f(dot(T0, cov3D * T0), dot(T0, cov3D * T1), dot(T1, cov3D * T1));
  var filter2D = kLowPassVariance;
  if (frame.mipFilter != 0u) {   // step 33g: the 2D Mip filter instead of the low-pass, and both filters' factors
    filter2D = kMipFilterVariance;
    opacity *= mipOpacityScale(s2D) * mip3DFactor(p.xyz, scale4, R);
    if (opacity < kMinAlpha) { return; }
  }
  let a = s2D.x + filter2D;
  let b = s2D.y;
  let c = s2D.z + filter2D;
  let det = a * c - b * b;
  if (det <= 0.0) { return; }

  // Quad: +-k sigmas along the ellipse's axes, where alpha falls to 1/255 (k = sqrt(2 ln(255 opacity))).
  let k = sqrt(2.0 * log(opacity / kMinAlpha));
  let mid = 0.5 * (a + c);
  let r = sqrt(max(0.25 * (a - c) * (a - c) + b * b, 0.0));
  let lambdaMajor = mid + r;
  let lambdaMinor = max(mid - r, 0.0);
  var axisMajor = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), a >= c);
  if (abs(b) > 1e-12) { axisMajor = normalize(vec2f(b, lambdaMajor - a)); }
  let major = k * sqrt(lambdaMajor) * axisMajor;
  let minorLen = k * sqrt(lambdaMinor);
  let extent = abs(major) + minorLen * abs(vec2f(-axisMajor.y, axisMajor.x));
  if (any(center + extent <= vec2f(0.0)) || any(center - extent >= frame.viewport)) { return; }

  let clipCenter = frame.proj * vec4f(0.0, 0.0, t.z, 1.0);
  let color = evalSH(g, normalize(p.xyz - frame.cameraPos.xyz), frame.shDegree);
  let slot = atomicAdd(&drawArgs[1], 1u);
  quads[slot] = Quad(vec4f(center, major), vec4f(minorLen, opacity, clipCenter.z / clipCenter.w, bitcast<f32>(g)),
                     vec4f(c, -b, a, 0.0) / det, vec4f(color, 1.0));
}

struct SplatOut {
  @builtin(position) position: vec4f,
  @location(0) @interpolate(flat) center: vec2f,
  @location(1) @interpolate(flat) conic: vec3f,
  @location(2) @interpolate(flat) opacity: f32,
  @location(3) @interpolate(flat) color: vec3f,
  @location(4) @interpolate(flat) id: u32,
}

@group(0) @binding(5) var<storage, read> quadsIn: array<Quad>;

@vertex
fn quadVertex(@builtin(vertex_index) vid: u32, @builtin(instance_index) iid: u32) -> SplatOut {
  let q = quadsIn[iid];
  let center = q.centerMajor.xy;
  let major = q.centerMajor.zw;
  let minor = q.minorOpacityDepthId.x * normalize(vec2f(-major.y, major.x));
  let corner = vec2f(select(-1.0, 1.0, (vid & 1u) != 0u), select(-1.0, 1.0, (vid & 2u) != 0u));
  let pixel = center + corner.x * major + corner.y * minor;
  var out: SplatOut;
  out.position = vec4f(2.0 * pixel.x / frame.viewport.x - 1.0, 1.0 - 2.0 * pixel.y / frame.viewport.y,
                       q.minorOpacityDepthId.z, 1.0);
  out.center = center;
  out.conic = q.conic.xyz;
  out.opacity = q.minorOpacityDepthId.y;
  out.color = q.color.rgb;
  out.id = bitcast<u32>(q.minorOpacityDepthId.w);
  return out;
}

// The C++ viewer's white noise: nested PCG hashes of (pixel, Gaussian, sample).
fn pcgHash(v: u32) -> u32 {
  let state = v * 747796405u + 2891336453u;
  let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn uniformRandom(pixel: vec2u, gaussian: u32, seed: u32) -> f32 {
  let h = pcgHash(pcgHash(pcgHash(pixel.x ^ (pixel.y << 16u)) + gaussian) + seed);
  return f32(h >> 8u) * (1.0 / 16777216.0);
}

// Step 33f: per-primitive spatio-temporal blue noise, as the C++ viewer (step 12; SteadySplats Sec. 4.3). A 128x128x64
// STBN volume (blue noise in space within each slice and in time along the slices):
//   * per Gaussian, an R2 low-discrepancy offset into the volume, so Gaussians overlapping at one pixel read different
//     texels (multipliers 2^32 / phi2 and 2^32 / phi2^2, phi2 = 1.3247..., the plastic number)
//   * per frame, the next slice; per 64-frame cycle, a golden-ratio Cranley-Patterson rotation (all values shifted by
//     the same amount mod 1), so cycles never repeat. The rotation keeps every threshold uniform: still unbiased.
@group(0) @binding(7) var stbn: texture_3d<f32>;   // R8Unorm, 128 x 128 x 64 (1 x 1 x 1 if the file is missing)

fn stbnShift(frame: u32) -> f32 {
  var u0 = 0x9e3779b9u;   // the same constant hash as the reference viewer
  u0 += u0 << 10u; u0 ^= u0 >> 6u; u0 += u0 << 3u; u0 ^= u0 >> 11u; u0 += u0 << 15u;
  return f32(u0 + (frame / 64u) * 0x9e3779b9u) / 4294967295.0;
}

fn blueNoiseThreshold(pixel: vec2u, gaussian: u32, frame: u32) -> f32 {
  let ox = (gaussian * 3242174889u) >> 25u;   // R2 sequence, 7 bits -> 0..127
  let oy = (gaussian * 2447445415u) >> 25u;
  let coord = vec3u((pixel.x + ox) & 127u, (pixel.y + oy) & 127u, frame & 63u);
  return fract(textureLoad(stbn, coord, 0).r + stbnShift(frame));
}

// The random threshold of a fragment for sample \`seed\`: blue or white noise.
fn threshold(pixel: vec2u, gaussian: u32, seed: u32) -> f32 {
  if (frame.blueNoise != 0u) { return blueNoiseThreshold(pixel, gaussian, seed); }
  return uniformRandom(pixel, gaussian, seed);
}

@fragment
fn stochasticFragment(in: SplatOut) -> @location(0) vec4f {
  let d = in.position.xy - in.center;   // in.position.xy: the pixel center (i + 0.5, j + 0.5)
  let power = -0.5 * (in.conic.x * d.x * d.x + in.conic.z * d.y * d.y) - in.conic.y * d.x * d.y;
  let alpha = min(kMaxAlpha, in.opacity * exp(power));
  if (alpha < kMinAlpha) { discard; }
  if (!(threshold(vec2u(in.position.xy), in.id, frame.seed) < alpha)) { discard; }
  return vec4f(in.color, 1.0);   // opaque: the depth test keeps the nearest surviving Gaussian
}

// Step 33c: four stochastic samples per pixel with 4x MSAA (stochastic transparency, Enderton et al. 2010), as the C++
// stochasticMsaaFragment. The shader runs once per pixel and primitive but makes one alpha test per subsample and
// returns them as the sample mask; the hardware depth-tests each subsample on its own, and the resolve averages the
// four: the noise of 4 samples per pixel. Subsample s uses seed 4 * seed + s, as the C++ viewer (with blue noise:
// four consecutive slices).
struct MsaaOut {
  @location(0) color: vec4f,
  @builtin(sample_mask) mask: u32,
}

@fragment
fn stochasticMsaaFragment(in: SplatOut) -> MsaaOut {
  let d = in.position.xy - in.center;
  let power = -0.5 * (in.conic.x * d.x * d.x + in.conic.z * d.y * d.y) - in.conic.y * d.x * d.y;
  let alpha = min(kMaxAlpha, in.opacity * exp(power));
  if (alpha < kMinAlpha) { discard; }
  let pixel = vec2u(in.position.xy);
  var mask = 0u;
  for (var s = 0u; s < 4u; s++) {
    if (threshold(pixel, in.id, 4u * frame.seed + s) < alpha) { mask |= 1u << s; }
  }
  if (mask == 0u) { discard; }
  return MsaaOut(vec4f(in.color, 1.0), mask);
}
`;var Pt=`// The Gaussians' scales, rotations and SH as float32 (main.ts prepends this or attributes_quantized.wgsl to
// splats.wgsl; ?float=1). 240 bytes per Gaussian with the positions.
@group(0) @binding(2) var<storage, read> scales: array<vec4f>;      // (s, 0); Mip: (s' = sqrt(s^2 + f^2), f)
@group(0) @binding(3) var<storage, read> rotations: array<vec4f>;   // unit quaternion (w, x, y, z)
@group(0) @binding(4) var<storage, read> sh: array<f32>;            // 48 per Gaussian, coefficient-major RGB

fn sceneScale(g: u32) -> vec4f { return scales[g]; }
fn sceneRotation(g: u32) -> vec4f { return rotations[g]; }

fn coef(g: u32, k: u32) -> vec3f {
  let i = 48u * g + 3u * k;
  return vec3f(sh[i], sh[i + 1u], sh[i + 2u]);
}
`;var At=`// Step 33h: the Gaussians' scales, rotations and SH quantized, decoded here, as the C++ viewer's --quantized
// (shaders/gaussian.h sceneScale / sceneRotation, shaders/sh.h QuantizedSH; steps 31a/31b). The bytes are our image
// format's (step 32a), uploaded as they are: 16 (positions + opacity) + 4 + 4 + 48 = 72 bytes per Gaussian.
@group(0) @binding(2) var<storage, read> scales: array<u32>;      // 3 x 8-bit log-scale, 8-bit log Mip filter
@group(0) @binding(3) var<storage, read> rotations: array<u32>;   // 8-bit w, x, y, z in [-1, 1]
@group(0) @binding(4) var<storage, read> sh: array<u32>;          // 48 bytes per Gaussian, coefficient-major RGB
@group(0) @binding(8) var<storage, read> shRange: array<f32>;     // lo[48], then step[48]: value = lo + step * byte

fn bytes4(w: u32) -> vec4f {
  return vec4f(f32(w & 255u), f32((w >> 8u) & 255u), f32((w >> 16u) & 255u), f32(w >> 24u));
}

// Returned as the float layout: (s' = sqrt(s^2 + f^2), f), f = 0 without the Mip filter.
fn sceneScale(g: u32) -> vec4f {
  let b = bytes4(scales[g]);
  let s = exp(frame.qScaleLo.xyz + frame.qScaleStep.xyz * b.xyz);
  var f = 0.0;
  if (frame.mipFilter != 0u) { f = exp(frame.qScaleLo.w + frame.qScaleStep.w * b.w); }
  return vec4f(sqrt(s * s + f * f), f);
}

fn sceneRotation(g: u32) -> vec4f { return normalize(bytes4(rotations[g]) / 127.5 - 1.0); }

fn shByte(i: u32) -> f32 { return f32((sh[i >> 2u] >> (8u * (i & 3u))) & 255u); }

fn coef(g: u32, k: u32) -> vec3f {
  let i = 3u * k;
  let b = 48u * g + i;
  return vec3f(shRange[i], shRange[i + 1u], shRange[i + 2u]) +
         vec3f(shRange[48u + i], shRange[49u + i], shRange[50u + i]) * vec3f(shByte(b), shByte(b + 1u), shByte(b + 2u));
}
`;var Mt=`// Step 33e: accumulation while the camera is still, as the C++ viewer's msaa-temporal mode (step 27g; StillAccumulator
// in src/render/accumulator.cpp, shaders/accumulate.metal). A running mean of the frames,
//   mean_n = mean_{n-1} + (sample_n - mean_{n-1}) / n,
// which converges to the exact image (no history weighting, no rejection). The first still frame starts from the last
// temporal image, counted as worth min(frames, 4) samples. One full-screen pass reads the previous mean (or that
// temporal image) and this frame's sample, and writes the canvas and the new mean (RGBA32Float, ping-pong).

struct Params {
  invCount: f32,   // 1 / n; 0 once enough samples are in (the mean is only shown)
  pad0: f32, pad1: f32, pad2: f32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var sample: texture_2d<f32>;     // this frame (resolved), RGBA16Float
@group(0) @binding(2) var previous: texture_2d<f32>;   // the mean so far, or the temporal image on the first still frame

struct PresentOut { @builtin(position) position: vec4f }

@vertex
fn presentVertex(@builtin(vertex_index) vid: u32) -> PresentOut {
  let p = vec2f(f32((vid << 1u) & 2u), f32(vid & 2u));   // full-screen triangle: (0,0), (2,0), (0,2)
  return PresentOut(vec4f(p * 2.0 - 1.0, 0.0, 1.0));
}

struct AccumulateOut {
  @location(0) present: vec4f,   // the canvas
  @location(1) mean: vec4f,      // the new mean
}

@fragment
fn accumulateFragment(in: PresentOut) -> AccumulateOut {
  let gid = vec2u(in.position.xy);
  let prev = textureLoad(previous, gid, 0).rgb;
  let mean = prev + (textureLoad(sample, gid, 0).rgb - prev) * params.invCount;
  return AccumulateOut(vec4f(mean, 1.0), vec4f(mean, 1.0));
}
`;var Ct=`// Step 33d: SteadySplats' temporal reuse on stochastic frames (1 sample or 4x MSAA), ported from the C++ viewer
// (shaders/spatial_reuse.metal: presentVertex, msaaTemporalFragment; src/render/msaa_temporal.cpp). One full-screen
// pass writes the screen and the next history at once:
//   backward reprojection of each pixel (its nearest depth) into the previous frame, Catmull-Rom history fetch,
//   YCoCg mean and deviation of the 3x3 neighborhood of the current frame, a box that widens when the pixel moved
//   little, soft rejection of history outside it, then an exponential moving average with weight historyWeight (0.7).
// main.ts prepends the depth binding and nearestDepth(): the depth texture is multisampled with 4x MSAA (WebGPU has no
// depth resolve, so the nearest of the four subsamples is taken here, as the C++ min-resolve) and plain without.

struct Params {
  invViewProj: mat4x4f,    // this frame's clip -> world
  prevViewProj: mat4x4f,   // world -> the previous frame's clip
  historyValid: u32,       // 0 on the first frame after a reset (and in the plain stochastic view)
  historyWeight: f32,      // nominal history weight delta-bar
  pad: vec2u,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var current: texture_2d<f32>;    // this frame (resolved), RGBA16Float
@group(0) @binding(2) var history: texture_2d<f32>;    // last frame's output, RGBA16Float
@group(0) @binding(4) var linearClamp: sampler;

struct PresentOut { @builtin(position) position: vec4f }

@vertex
fn presentVertex(@builtin(vertex_index) vid: u32) -> PresentOut {
  let p = vec2f(f32((vid << 1u) & 2u), f32(vid & 2u));   // full-screen triangle: (0,0), (2,0), (0,2)
  return PresentOut(vec4f(p * 2.0 - 1.0, 0.0, 1.0));
}

fn toYCoCg(c: vec3f) -> vec3f {
  let co = (c.r - c.b) * 0.5; let t = (c.r + c.b) * 0.25; let g2 = c.g * 0.5;
  return vec3f(g2 + t, co, g2 - t);
}

// History fetch with a 5-tap Catmull-Rom filter built from bilinear taps: sharper than bilinear, so repeated
// reprojection doesn't blur the image over time.
fn catmullRom(pixel: vec2f, size: vec2f) -> vec3f {
  let tc = floor(pixel - 0.5) + 0.5;
  let f = pixel - tc; let f2 = f * f;
  let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  let w1 = 1.0 + f2 * (-2.5 + 1.5 * f);
  let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  let w3 = f2 * (-0.5 + 0.5 * f);
  let w12 = w1 + w2;
  let tc12 = tc + w2 / max(w12, vec2f(1e-5));
  let tc0 = tc - 1.0; let tc3 = tc + 2.0;
  let wTop = w12.x * w0.y; let wLeft = w0.x * w12.y; let wCenter = w12.x * w12.y; let wRight = w3.x * w12.y;
  let wBottom = w12.x * w3.y;
  let c = textureSampleLevel(history, linearClamp, vec2f(tc12.x, tc0.y) / size, 0.0).rgb * wTop
        + textureSampleLevel(history, linearClamp, vec2f(tc0.x, tc12.y) / size, 0.0).rgb * wLeft
        + textureSampleLevel(history, linearClamp, tc12 / size, 0.0).rgb * wCenter
        + textureSampleLevel(history, linearClamp, vec2f(tc3.x, tc12.y) / size, 0.0).rgb * wRight
        + textureSampleLevel(history, linearClamp, vec2f(tc12.x, tc3.y) / size, 0.0).rgb * wBottom;
  return max(c / max(wTop + wLeft + wCenter + wRight + wBottom, 1e-5), vec3f(0.0));
}

struct TemporalOut {
  @location(0) present: vec4f,   // the canvas
  @location(1) history: vec4f,   // the next frame's history
}

@fragment
fn temporalFragment(in: PresentOut) -> TemporalOut {
  let dims = textureDimensions(current);
  let gid = vec2u(in.position.xy);
  let center = vec2f(gid) + 0.5;
  let size = vec2f(dims);
  let now = textureLoad(current, gid, 0).rgb;
  var outColor = now;
  if (params.historyValid != 0u) {
    let ndc = vec4f(2.0 * center.x / size.x - 1.0, 1.0 - 2.0 * center.y / size.y, nearestDepth(gid), 1.0);
    var world = params.invViewProj * ndc;
    world /= world.w;
    let prevClip = params.prevViewProj * world;
    let prevNdc = prevClip.xy / max(prevClip.w, 1e-8);
    let prevPixel = vec2f((prevNdc.x + 1.0) * 0.5 * size.x, (1.0 - prevNdc.y) * 0.5 * size.y);
    if (prevClip.w > 0.0 && all(prevPixel >= vec2f(2.0)) && all(prevPixel <= size - 2.0)) {
      let hist = catmullRom(prevPixel, size);
      var m1 = vec3f(0.0); var m2 = vec3f(0.0);
      for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
          let q = vec2u(clamp(vec2i(gid) + vec2i(dx, dy), vec2i(0), vec2i(dims) - 1));
          let y = toYCoCg(textureLoad(current, q, 0).rgb);
          m1 += y;
          m2 += y * y;
        }
      }
      let mu = m1 / 9.0;
      let sigma = sqrt(max(m2 / 9.0 - mu * mu, vec3f(0.0)));
      let v = length(center - prevPixel);
      let gamma = mix(4.0, 1.0, min(1.0, v / 4.0));
      let e = max(gamma * sigma, vec3f(0.01, 0.005, 0.005));
      let dist = abs(toYCoCg(hist) - mu) / e;
      let m = max(dist.x, max(dist.y, dist.z));
      outColor = mix(now, hist, params.historyWeight * min(1.0, 1.0 / m));
    }
  }
  return TemporalOut(vec4f(outColor, 1.0), vec4f(outColor, 1.0));
}
`;var sr=.28209479177387814,or=document.getElementById("status"),ne=s=>{or.textContent=s};function nr(s,t){let l=new Array(16).fill(0);for(let e=0;e<4;++e)for(let a=0;a<4;++a)for(let m=0;m<4;++m)l[4*e+a]+=s[4*m+a]*t[4*e+m];return l}function lr(s){let t=Array.from({length:4},(e,a)=>[0,1,2,3].map(m=>s[4*m+a]).concat([0,1,2,3].map(m=>m===a?1:0)));for(let e=0;e<4;++e){let a=e;for(let u=e+1;u<4;++u)Math.abs(t[u][e])>Math.abs(t[a][e])&&(a=u);[t[e],t[a]]=[t[a],t[e]];let m=t[e][e];for(let u=0;u<8;++u)t[e][u]/=m;for(let u=0;u<4;++u)if(u!==e){let r=t[u][e];for(let d=0;d<8;++d)t[u][d]-=r*t[e][d]}}let l=new Array(16);for(let e=0;e<4;++e)for(let a=0;a<4;++a)l[4*e+a]=t[a][4+e];return l}async function cr(){let s=new URLSearchParams(location.search);if(!navigator.gpu)throw new Error("WebGPU is not available in this browser");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("no WebGPU adapter");let l=t.features.has("timestamp-query"),e=await t.requestDevice({requiredFeatures:l?["timestamp-query"]:[],requiredLimits:{maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize}}),a=document.getElementById("view"),m=a.getContext("webgpu"),u=navigator.gpu.getPreferredCanvasFormat();m.configure({device:e,format:u,alphaMode:"opaque"});let r=s.get("model")??"../out/step32a/kitchen",d=performance.now(),y=s.get("float")!=="1",g=await wt(r,ne,y),v=await He(`${r}/cameras.json`),_=s.get("path")?await He(s.get("path")):null,le=(performance.now()-d)/1e3,q=i=>i.reduce((n,f)=>n+f,0),G=g.float,z=g.quantized,ce=`checksums: positions ${q(g.positions).toFixed(3)}, `+(G?`log-scales ${q(G.logScales).toFixed(3)}, SH ${q(G.sh).toFixed(3)}, `:"")+`opacity ${q(g.opacities).toFixed(3)}`;console.log(ce);let M=g.count,D=new Float32Array(4*M),$=new Float32Array(4*M);for(let i=0;i<M;++i){for(let n=0;n<3;++n){D[4*i+n]=g.positions[3*i+n];let f=G?G.sh[48*i+n]:z.shRange[n]+z.shRange[48+n]*z.shBytes[48*i+n];$[4*i+n]=Math.max(0,.5+sr*f)}D[4*i+3]=g.opacities[i]}let U=g.mip?g.meta.mip_area?2:1:0,F=(i,n)=>{let f=e.createBuffer({size:i.byteLength,usage:n|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(f,0,i),f},C=GPUBufferUsage.STORAGE,T=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,o=F(D,C),c=F($,C),p,P,b,k=null;if(z)p=F(z.scaleWords,C),P=F(z.rotationWords,C),b=F(z.shBytes,C),k=F(z.shRange,C);else{let i=G,n=new Float32Array(4*M),f=new Float32Array(4*M);for(let x=0;x<M;++x){let S=0;for(let A=0;A<4;++A)S+=i.rotations[4*x+A]**2;S=Math.sqrt(S)||1;for(let A=0;A<4;++A)f[4*x+A]=i.rotations[4*x+A]/S;for(let A=0;A<3;++A)n[4*x+A]=Math.exp(i.logScales[3*x+A]),i.filter3D&&(n[4*x+A]=Math.hypot(n[4*x+A],i.filter3D[x]));i.filter3D&&(n[4*x+3]=i.filter3D[x])}p=F(n,C),P=F(f,C),b=F(i.sh,C)}let Bt=[o,p,P,b].reduce((i,n)=>i+n.size,0),Ne=e.createBuffer({size:64*M,usage:C}),Pe=F(new Uint32Array([4,0,0,0]),C|GPUBufferUsage.INDIRECT),Ae=e.createBuffer({size:224,usage:T}),Ee=e.createBuffer({size:64,usage:T}),Ie=e.createBuffer({size:144,usage:T}),Me=await fetch("../assets/stbn/stbn_scalar_128x128x64.r8").then(i=>i.ok?i.arrayBuffer():null,()=>null),te=Me!==null&&Me.byteLength===16384*64,ue=te?[128,128,64]:[1,1,1],Ye=e.createTexture({size:ue,dimension:"3d",format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:Ye},te?Me:new Uint8Array(1),{bytesPerRow:ue[0],rowsPerImage:ue[1]},ue);let Qe=e.createBuffer({size:16,usage:T}),R=s.get("msaa")==="1"?1:4,I="rgba16float",Je=e.createShaderModule({code:zt}),Xe=e.createRenderPipeline({layout:"auto",vertex:{module:Je,entryPoint:"pointVertex"},fragment:{module:Je,entryPoint:"pointFragment",targets:[{format:I}]},primitive:{topology:"point-list"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"always"},multisample:{count:R}}),_t=e.createBindGroup({layout:Xe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ee}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:c}}]}),Ce=e.createShaderModule({code:(z?At:Pt)+St}),Ke=e.createComputePipeline({layout:"auto",compute:{module:Ce,entryPoint:"preprocess"}}),qt=e.createBindGroup({layout:Ke.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:P}},{binding:4,resource:{buffer:b}},{binding:5,resource:{buffer:Ne}},{binding:6,resource:{buffer:Pe}},...k?[{binding:8,resource:{buffer:k}}]:[]]}),Ze=e.createRenderPipeline({layout:"auto",vertex:{module:Ce,entryPoint:"quadVertex"},fragment:{module:Ce,entryPoint:R===4?"stochasticMsaaFragment":"stochasticFragment",targets:[{format:I}]},primitive:{topology:"triangle-strip"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:R}}),Ft=e.createBindGroup({layout:Ze.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:5,resource:{buffer:Ne}},{binding:7,resource:Ye.createView()}]}),Tt=R===4?`@group(0) @binding(3) var currentDepth: texture_depth_multisampled_2d;
       fn nearestDepth(p: vec2u) -> f32 {
         return min(min(textureLoad(currentDepth, p, 0), textureLoad(currentDepth, p, 1)),
                    min(textureLoad(currentDepth, p, 2), textureLoad(currentDepth, p, 3)));
       }
`:`@group(0) @binding(3) var currentDepth: texture_depth_2d;
       fn nearestDepth(p: vec2u) -> f32 { return textureLoad(currentDepth, p, 0); }
`,et=e.createShaderModule({code:Tt+Ct}),tt=e.createRenderPipeline({layout:"auto",vertex:{module:et,entryPoint:"presentVertex"},fragment:{module:et,entryPoint:"temporalFragment",targets:[{format:u},{format:I}]},primitive:{topology:"triangle-list"}}),Gt=e.createSampler({magFilter:"linear",minFilter:"linear"}),rt=e.createShaderModule({code:Mt}),Be=GPUShaderStage.FRAGMENT,at=e.createBindGroupLayout({entries:[{binding:0,visibility:Be,buffer:{type:"uniform"}},{binding:1,visibility:Be,texture:{sampleType:"unfilterable-float"}},{binding:2,visibility:Be,texture:{sampleType:"unfilterable-float"}}]}),Rt=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[at]}),vertex:{module:rt,entryPoint:"presentVertex"},fragment:{module:rt,entryPoint:"accumulateFragment",targets:[{format:u},{format:"rgba32float"}]},primitive:{topology:"triangle-list"}}),Vt=4,Dt=1024,{pivot:it,up:Ut}=bt(v),V=Number(s.get("camera")??0)%v.length,B=E.fromDataset(_?_[0]:v[V]),_e=s.get("mode"),O=_e==="points",L=_e!=="stochastic"&&_e!=="splats",kt=Number(s.get("history")??.7),Y=te&&s.get("noise")!=="white",st=s.get("seed"),Q=!1,qe=0,ot="",W=0,Fe=!1,Te=0,Ge=0;a.addEventListener("pointerdown",i=>{Fe=!0,Te=i.clientX,Ge=i.clientY}),window.addEventListener("pointerup",()=>{Fe=!1}),window.addEventListener("pointermove",i=>{Fe&&(B.orbit(it,Ut,-(i.clientX-Te)*.005,-(i.clientY-Ge)*.005),Te=i.clientX,Ge=i.clientY)}),a.addEventListener("wheel",i=>{i.preventDefault(),B.zoom(it,Math.exp(i.deltaY*.001))},{passive:!1}),window.addEventListener("keydown",i=>{i.key==="ArrowRight"||i.key==="ArrowLeft"?(V=(V+(i.key==="ArrowRight"?1:v.length-1))%v.length,B=E.fromDataset(v[V]),Q=!1):i.key==="p"||i.key==="P"?(O=!O,Q=!1):(i.key==="b"||i.key==="B")&&te?Y=!Y:(i.key==="t"||i.key==="T")&&(L=!L,Q=!1)});let Ot=[0,1,2].map(i=>v.reduce((n,f)=>n+f.position[i],0)/v.length),nt=v.reduce((i,n)=>i+Math.hypot(...n.position.map((f,x)=>f-Ot[x])),0)/v.length,lt=0,ct=0,pe=null,fe,J,re=[],me=[],ut=[],de=0,Re=0,Lt=(i,n)=>{for(let S of[pe,fe,J,...re,...me])S?.destroy();let f=GPUTextureUsage.RENDER_ATTACHMENT,x=GPUTextureUsage.TEXTURE_BINDING;pe=R===1?null:e.createTexture({size:[i,n],format:I,sampleCount:R,usage:f}),fe=e.createTexture({size:[i,n],format:"depth32float",sampleCount:R,usage:f|x}),J=e.createTexture({size:[i,n],format:I,usage:f|x}),re=[0,1].map(()=>e.createTexture({size:[i,n],format:I,usage:f|x})),me=[0,1].map(()=>e.createTexture({size:[i,n],format:"rgba32float",usage:f|x})),ut=[0,1].map(S=>e.createBindGroup({layout:tt.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ie}},{binding:1,resource:J.createView()},{binding:2,resource:re[S^1].createView()},{binding:3,resource:fe.createView()},{binding:4,resource:Gt}]})),lt=i,ct=n,Q=!1},H=Number(s.get("bench")??0),pt=(s.get("size")??"").split("x").map(Number),X=pt[0]||1600,ae=pt[1]||Math.round(X*v[V].height/v[V].width),Ve=H>0?e.createTexture({size:[X,ae],format:u,usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,ft=[],he=0,mt=performance.now(),ge=0,ie=l?e.createQuerySet({type:"timestamp",count:2}):null,De=l?e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}):null,dt=[],Ue=0,ye=0,ke=0,Oe=()=>{let i=he;_&&(B=E.fromDataset(_[Math.min(i,_.length-1)])),Ve&&(B=E.fromDataset(v[V]),i&1&&(B.position[0]+=1e-4));let n,f;if(Ve)n=X,f=ae;else{let h=window.devicePixelRatio||1;n=Math.max(1,Math.round(a.clientWidth*h)),f=Math.max(1,Math.round(a.clientHeight*h)),(n!==a.width||f!==a.height)&&(a.width=n,a.height=f)}(n!==lt||f!==ct)&&Lt(n,f);let x=(Ve??m.getCurrentTexture()).createView(),S=B.projection(n,f,.0025*nt,250*nt),A=B.view(),xe=nr(S,A),Le=n/B.width,gt=f/B.height,$t=B.fx*Le,Wt=Math.abs(Le/gt-1)<.01?B.fy*gt:B.fy*Le,yt=[...A,n,f,O?1:0,L?1:0,Y?1:0].join(","),Ht=yt!==ot;ot=yt;let K=L&&!O&&!Ht;K||(W=0);let xt=K&&W===0?re[de^1]:null;xt&&(W=Math.min(qe,Vt));let vt=!K||W<Dt,Nt=K?1+W:st!==null?Number(st):i+1,N=e.createCommandEncoder(),Z={r:0,g:0,b:0,a:1},je=!0,ve=h=>{if(!ie||!je&&!h)return;let w={querySet:ie};return je&&(w.beginningOfPassWriteIndex=0),h&&(w.endOfPassWriteIndex=1),je=!1,w};if(vt){if(O)e.queue.writeBuffer(Ee,0,new Float32Array(xe));else{let w=new ArrayBuffer(224),j=new Float32Array(w),ee=new Uint32Array(w);j.set(A,0),j.set(S,16),j.set([...B.position,1],32),j.set([n,f,$t,Wt],36),ee.set([M,g.meta.sh_degree,Nt,Y?1:0,U],40),z&&(j.set(z.scaleLo,48),j.set(z.scaleStep,52)),e.queue.writeBuffer(Ae,0,w),e.queue.writeBuffer(Pe,0,new Uint32Array([4,0,0,0]));let we=N.beginComputePass({timestampWrites:ve(!1)});we.setPipeline(Ke),we.setBindGroup(0,qt),we.dispatchWorkgroups(Math.ceil(M/256)),we.end()}let h=N.beginRenderPass({colorAttachments:[pe?{view:pe.createView(),resolveTarget:J.createView(),loadOp:"clear",storeOp:"discard",clearValue:Z}:{view:J.createView(),loadOp:"clear",storeOp:"store",clearValue:Z}],depthStencilAttachment:{view:fe.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"},timestampWrites:ve(!1)});O?(h.setPipeline(Xe),h.setBindGroup(0,_t),h.draw(M)):(h.setPipeline(Ze),h.setBindGroup(0,Ft),h.drawIndirect(Pe,0)),h.end()}if(K){e.queue.writeBuffer(Qe,0,new Float32Array([vt?1/++W:0,0,0,0]));let h=e.createBindGroup({layout:at,entries:[{binding:0,resource:{buffer:Qe}},{binding:1,resource:J.createView()},{binding:2,resource:(xt??me[Re^1]).createView()}]}),w=N.beginRenderPass({colorAttachments:[{view:x,loadOp:"clear",storeOp:"store",clearValue:Z},{view:me[Re].createView(),loadOp:"clear",storeOp:"store",clearValue:Z}],timestampWrites:ve(!0)});w.setPipeline(Rt),w.setBindGroup(0,h),w.draw(3),w.end(),Re^=1}else{let h=L&&!O&&Q,w=new Float32Array(36),j=new Uint32Array(w.buffer);w.set(lr(xe),0),w.set(h?ft:xe,16),j[32]=h?1:0,w[33]=kt,e.queue.writeBuffer(Ie,0,w);let ee=N.beginRenderPass({colorAttachments:[{view:x,loadOp:"clear",storeOp:"store",clearValue:Z},{view:re[de].createView(),loadOp:"clear",storeOp:"store",clearValue:Z}],timestampWrites:ve(!0)});ee.setPipeline(tt),ee.setBindGroup(0,ut[de]),ee.draw(3),ee.end(),qe=h?qe+1:1,de^=1,ft=xe,Q=!0}let be;if(ie&&De&&(be=dt.pop()??e.createBuffer({size:16,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),N.resolveQuerySet(ie,0,2,De,0),N.copyBufferToBuffer(De,0,be,0,16)),e.queue.submit([N.finish()]),be){let h=be;h.mapAsync(GPUMapMode.READ).then(()=>{let w=new BigUint64Array(h.getMappedRange());w[1]>w[0]&&(Ue+=Number(w[1]-w[0])/1e6,++ye),h.unmap(),dt.push(h),ye===30&&(ke=Ue/ye,Ue=0,ye=0)})}if(++he%30===0){let h=performance.now();ge=3e4/(h-mt),mt=h}let Et=`${ge.toFixed(0)} fps (${ge>0?(1e3/ge).toFixed(1):"-"} ms per frame`+(ie?`, GPU ${ke>0?ke.toFixed(2):"-"} ms`:", GPU time unavailable")+")",It=O?"points":`stochastic splats, ${R} sample${R>1?"s":""} per pixel, ${Y?"blue":"white"} noise`+(K?`, still: ${W} frames averaged`:L?", temporal reuse":""),Yt=["",", Mip-Splatting",", Mip-Splatting (area)"][U],Qt=`${(Bt/1e6).toFixed(0)} MB on the GPU, ${z?"quantized":"float"}`;ne(`${M.toLocaleString()} Gaussians${Yt} (${It}; ${Qt}), loaded in ${le.toFixed(1)} s from ${r}
`+(_?`path frame ${Math.min(i,_.length-1)+1} / ${_.length}`:`camera ${V} (${v[V].name})`)+`, ${n} x ${f}, ${Et}
drag: orbit, wheel: zoom, left/right: dataset cameras, P: points, T: temporal reuse, B: blue / white noise
`+(te?"":`blue noise unavailable (assets/stbn missing)
`)+ce)},ht=()=>{if(Oe(),_&&he===_.length){window.__ready=!0;return}!_&&he===2&&(window.__ready=!0),requestAnimationFrame(ht)};H>0?await jt():requestAnimationFrame(ht);async function jt(){ne(`benchmark: ${H} frames at ${X} x ${ae}...`),await new Promise(S=>setTimeout(S,500));for(let S=0;S<5;++S)Oe();await e.queue.onSubmittedWorkDone();let i=performance.now();for(let S=0;S<H;++S)Oe();await e.queue.onSubmittedWorkDone();let n=(performance.now()-i)/H,f={model:r,msaa:R,quantized:!!z,blueNoise:Y,temporal:L,width:X,height:ae,frames:H,ms:n,gaussians:M,userAgent:navigator.userAgent};window.__bench=f,ne(`benchmark: ${H} frames at ${X} x ${ae}, ${R}x MSAA${L?" + temporal":""}, ${z?"quantized":"float"}: ${n.toFixed(2)} ms/frame (${(1e3/n).toFixed(0)} fps)
${r}`),window.__ready=!0;let x=s.get("report");if(x){let S=await(await fetch(x,{method:"POST",body:JSON.stringify(f)})).text();S.trim()&&(location.href=S.trim())}}}cr().catch(s=>{ne(`error: ${s.message??s}`),console.error(s)});
