async function $e(a){return(await(await fetch(a)).json()).map(l=>({name:l.img_name,width:l.width,height:l.height,fx:l.fx,fy:l.fy,position:l.position,rotation:l.rotation}))}var Le=(a,t)=>[a[0]-t[0],a[1]-t[1],a[2]-t[2]],we=(a,t)=>a[0]*t[0]+a[1]*t[1]+a[2]*t[2],oe=(a,t)=>[a[0]*t,a[1]*t,a[2]*t],ze=(a,t)=>[a[0]+t[0],a[1]+t[1],a[2]+t[2]],Kt=(a,t)=>[a[1]*t[2]-a[2]*t[1],a[2]*t[0]-a[0]*t[2],a[0]*t[1]-a[1]*t[0]],je=a=>oe(a,1/Math.hypot(...a)),I=class a{constructor(t,l,i,e,u,p,r,d){this.position=t;this.right=l;this.down=i;this.forward=e;this.fx=u;this.fy=p;this.width=r;this.height=d}position;right;down;forward;fx;fy;width;height;static fromDataset(t){let l=i=>[t.rotation[0][i],t.rotation[1][i],t.rotation[2][i]];return new a([...t.position],l(0),l(1),l(2),t.fx,t.fy,t.width,t.height)}view(){let t=this.right,l=this.down,i=this.forward,e=this.position;return new Float32Array([t[0],l[0],i[0],0,t[1],l[1],i[1],0,t[2],l[2],i[2],0,-we(t,e),-we(l,e),-we(i,e),1])}projection(t,l,i,e){let u=t/this.width,p=l/this.height,r=this.fx*u,d=Math.abs(u/p-1)<.01?this.fy*p:this.fy*u,g=e/(e-i),P=-e*i/(e-i);return new Float32Array([2*r/t,0,0,0,0,-2*d/l,0,0,0,0,g,1,0,0,P,0])}orbit(t,l,i,e){let u=(r,d,g)=>{let P=Math.cos(g),b=Math.sin(g);return ze(ze(oe(r,P),oe(Kt(d,r),b)),oe(d,we(d,r)*(1-P)))},p=(r,d)=>{this.position=ze(t,u(Le(this.position,t),r,d)),this.right=u(this.right,r,d),this.down=u(this.down,r,d),this.forward=u(this.forward,r,d)};p(je(l),i),p(je(this.right),e)}zoom(t,l){this.position=ze(t,oe(Le(this.position,t),l))}};function bt(a){let t=[0,0,0,0,0,0,0,0,0],l=[0,0,0],i=[0,0,0];for(let r of a){let d=[r.rotation[0][2],r.rotation[1][2],r.rotation[2][2]];i=Le(i,[r.rotation[0][1],r.rotation[1][1],r.rotation[2][1]]);for(let g=0;g<3;++g)for(let P=0;P<3;++P){let b=(g===P?1:0)-d[g]*d[P];t[3*g+P]+=b,l[g]+=b*r.position[P]}}let e=r=>r[0]*(r[4]*r[8]-r[5]*r[7])-r[1]*(r[3]*r[8]-r[5]*r[6])+r[2]*(r[3]*r[7]-r[4]*r[6]),u=e(t);return{pivot:[0,1,2].map(r=>{let d=[...t];for(let g=0;g<3;++g)d[3*g+r]=l[g];return e(d)/u}),up:je(i)}}async function Zt(a,t,l){let i=await(await fetch(a)).blob(),e=await createImageBitmap(i,{colorSpaceConversion:"none",premultiplyAlpha:"none"});if(e.width!==t||e.height!==l)throw new Error(`${a}: unexpected size`);let p=new OffscreenCanvas(t,l).getContext("2d",{willReadFrequently:!0});return p.drawImage(e,0,0),e.close(),p.getImageData(0,0,t,l).data}function er(a,t,l){let i=Math.floor(t/2),e=0,u=0;for(let p=0;p<t;++p){let r=Math.floor(a/2**p)%2;p<2*i?p%2===0?e+=r*2**(p/2):u+=r*2**((p-1)/2):e+=r*2**i}return u*l+e}var ne=(a,t,l,i)=>t+a/(2**i-1)*(l-t);async function wt(a,t,l=!1){let i=await(await fetch(`${a}/meta.json`)).json();if(i.format!=="gaussian-splats-images-1")throw new Error(`${a}: unknown format ${i.format}`);let e=i.count,u=i.width,p=i.height,r=i.ranges,d=1;for(;2**d<Math.max(e,2);)++d;let g=new Uint32Array(e);for(let o=0;o<e;++o)g[o]=4*er(o,d,u);let P=(i.sh_degree+1)**2-1,b=["means_l","means_u","scales","quats","extra","sh0",...Array.from({length:P},(o,c)=>`shN_${String(c).padStart(2,"0")}`)],C=0,B=new Map;await Promise.all(b.map(async o=>{B.set(o,await Zt(`${a}/${o}.webp`,u,p)),t(`decoding images ${++C} / ${b.length}`)}));let V=o=>B.get(o),D=r.log_filter!==void 0,T={meta:i,count:e,positions:new Float32Array(3*e),opacities:new Float32Array(e),mip:D,float:null,quantized:null},A=V("means_l"),ce=V("means_u"),M=V("scales"),O=V("quats"),L=V("extra"),re=V("sh0");for(let o=0;o<e;++o){let c=g[o];for(let f=0;f<3;++f){let z=ne(A[c+f]+256*ce[c+f],r.position.lo[f],r.position.hi[f],16);T.positions[3*o+f]=Math.sign(z)*Math.expm1(Math.abs(z))}T.opacities[o]=Math.min(Math.max(L[c]/255,1e-6),1-1e-6)}let F=o=>i.sh_bits[o<3?0:o<8?1:2];if(l){let o={scaleWords:new Uint32Array(e),rotationWords:new Uint32Array(e),shBytes:new Uint8Array(48*e),scaleLo:[...r.log_scale.lo,D?r.log_filter.lo[0]:0],scaleStep:[0,1,2].map(c=>(r.log_scale.hi[c]-r.log_scale.lo[c])/255).concat(D?(r.log_filter.hi[0]-r.log_filter.lo[0])/255:0),shRange:new Float32Array(96)};for(let c=0;c<e;++c){let f=g[c];o.scaleWords[c]=(M[f]|M[f+1]<<8|M[f+2]<<16|(D?L[f+2]:0)<<24)>>>0,o.rotationWords[c]=(L[f+1]|O[f]<<8|O[f+1]<<16|O[f+2]<<24)>>>0;for(let z=0;z<3;++z)o.shBytes[48*c+z]=re[f+z]}for(let c=0;c<3;++c)o.shRange[c]=r.sh0.lo[c],o.shRange[48+c]=(r.sh0.hi[c]-r.sh0.lo[c])/255;for(let c=0;c<P;++c){let f=V(b[6+c]),z=2**F(c)-1;for(let x=0;x<3;++x)o.shRange[3*(c+1)+x]=r.shN.lo[3*c+x],o.shRange[48+3*(c+1)+x]=(r.shN.hi[3*c+x]-r.shN.lo[3*c+x])/z;for(let x=0;x<e;++x)for(let U=0;U<3;++U)o.shBytes[48*x+3*(c+1)+U]=f[g[x]+U]}return T.quantized=o,T}let w={logScales:new Float32Array(3*e),rotations:new Float32Array(4*e),sh:new Float32Array(48*e),filter3D:D?new Float32Array(e):null};for(let o=0;o<e;++o){let c=g[o];for(let f=0;f<3;++f)w.logScales[3*o+f]=ne(M[c+f],r.log_scale.lo[f],r.log_scale.hi[f],8),w.rotations[4*o+1+f]=O[c+f]/127.5-1,w.sh[48*o+f]=ne(re[c+f],r.sh0.lo[f],r.sh0.hi[f],8);w.rotations[4*o]=L[c+1]/127.5-1,w.filter3D&&(w.filter3D[o]=Math.exp(ne(L[c+2],r.log_filter.lo[0],r.log_filter.hi[0],8)))}for(let o=0;o<P;++o){let c=F(o),f=V(b[6+o]);for(let z=0;z<e;++z)for(let x=0;x<3;++x)w.sh[48*z+3*(o+1)+x]=ne(f[g[z]+x],r.shN.lo[3*o+x],r.shN.hi[3*o+x],c)}return T.float=w,T}var zt=`// Step 33a: every Gaussian's center as a one-pixel point with its base color (SH coefficient 0), as the C++ viewer's
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
`;var nr=.28209479177387814,lr=document.getElementById("status"),le=a=>{lr.textContent=a};function cr(a,t){let l=new Array(16).fill(0);for(let i=0;i<4;++i)for(let e=0;e<4;++e)for(let u=0;u<4;++u)l[4*i+e]+=a[4*u+e]*t[4*i+u];return l}function ur(a){let t=Array.from({length:4},(i,e)=>[0,1,2,3].map(u=>a[4*u+e]).concat([0,1,2,3].map(u=>u===e?1:0)));for(let i=0;i<4;++i){let e=i;for(let p=i+1;p<4;++p)Math.abs(t[p][i])>Math.abs(t[e][i])&&(e=p);[t[i],t[e]]=[t[e],t[i]];let u=t[i][i];for(let p=0;p<8;++p)t[i][p]/=u;for(let p=0;p<4;++p)if(p!==i){let r=t[p][i];for(let d=0;d<8;++d)t[p][d]-=r*t[i][d]}}let l=new Array(16);for(let i=0;i<4;++i)for(let e=0;e<4;++e)l[4*i+e]=t[e][4+i];return l}async function pr(){let a=new URLSearchParams(location.search);if(!navigator.gpu)throw new Error("WebGPU is not available in this browser");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("no WebGPU adapter");let l=navigator.userAgent.includes("Firefox"),i=t.features.has("timestamp-query")&&!l,e=await t.requestDevice({requiredFeatures:i?["timestamp-query"]:[],requiredLimits:{maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize}}),u=document.getElementById("view"),p=u.getContext("webgpu"),r=navigator.gpu.getPreferredCanvasFormat();p.configure({device:e,format:r,alphaMode:"opaque"});let d=a.get("model")??"../out/step32a/kitchen",g=performance.now(),P=a.get("float")!=="1",b=await wt(d,le,P),C=await $e(`${d}/cameras.json`),B=a.get("path")?await $e(a.get("path")):null,V=(performance.now()-g)/1e3,D=s=>s.reduce((n,m)=>n+m,0),T=b.float,A=b.quantized,ce=`checksums: positions ${D(b.positions).toFixed(3)}, `+(T?`log-scales ${D(T.logScales).toFixed(3)}, SH ${D(T.sh).toFixed(3)}, `:"")+`opacity ${D(b.opacities).toFixed(3)}`;console.log(ce);let M=b.count,O=new Float32Array(4*M),L=new Float32Array(4*M);for(let s=0;s<M;++s){for(let n=0;n<3;++n){O[4*s+n]=b.positions[3*s+n];let m=T?T.sh[48*s+n]:A.shRange[n]+A.shRange[48+n]*A.shBytes[48*s+n];L[4*s+n]=Math.max(0,.5+nr*m)}O[4*s+3]=b.opacities[s]}let re=b.mip?b.meta.mip_area?2:1:0,F=(s,n)=>{let m=e.createBuffer({size:s.byteLength,usage:n|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(m,0,s),m},w=GPUBufferUsage.STORAGE,o=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,c=F(O,w),f=F(L,w),z,x,U,Se=null;if(A)z=F(A.scaleWords,w),x=F(A.rotationWords,w),U=F(A.shBytes,w),Se=F(A.shRange,w);else{let s=T,n=new Float32Array(4*M),m=new Float32Array(4*M);for(let y=0;y<M;++y){let v=0;for(let S=0;S<4;++S)v+=s.rotations[4*y+S]**2;v=Math.sqrt(v)||1;for(let S=0;S<4;++S)m[4*y+S]=s.rotations[4*y+S]/v;for(let S=0;S<3;++S)n[4*y+S]=Math.exp(s.logScales[3*y+S]),s.filter3D&&(n[4*y+S]=Math.hypot(n[4*y+S],s.filter3D[y]));s.filter3D&&(n[4*y+3]=s.filter3D[y])}z=F(n,w),x=F(m,w),U=F(s.sh,w)}let Bt=[c,z,x,U].reduce((s,n)=>s+n.size,0),He=e.createBuffer({size:64*M,usage:w}),Pe=F(new Uint32Array([4,0,0,0]),w|GPUBufferUsage.INDIRECT),Ae=e.createBuffer({size:224,usage:o}),We=e.createBuffer({size:64,usage:o}),Ee=e.createBuffer({size:144,usage:o}),Me=await fetch("../assets/stbn/stbn_scalar_128x128x64.r8").then(s=>s.ok?s.arrayBuffer():null,()=>null),ae=Me!==null&&Me.byteLength===16384*64,ue=ae?[128,128,64]:[1,1,1],Ne=e.createTexture({size:ue,dimension:"3d",format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:Ne},ae?Me:new Uint8Array(1),{bytesPerRow:ue[0],rowsPerImage:ue[1]},ue);let Ie=e.createBuffer({size:16,usage:o}),R=a.get("msaa")==="1"?1:4,Y="rgba16float",Ye=e.createShaderModule({code:zt}),Qe=e.createRenderPipeline({layout:"auto",vertex:{module:Ye,entryPoint:"pointVertex"},fragment:{module:Ye,entryPoint:"pointFragment",targets:[{format:Y}]},primitive:{topology:"point-list"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"always"},multisample:{count:R}}),_t=e.createBindGroup({layout:Qe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:We}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:f}}]}),Ce=e.createShaderModule({code:(A?At:Pt)+St}),Je=e.createComputePipeline({layout:"auto",compute:{module:Ce,entryPoint:"preprocess"}}),qt=e.createBindGroup({layout:Je.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:z}},{binding:3,resource:{buffer:x}},{binding:4,resource:{buffer:U}},{binding:5,resource:{buffer:He}},{binding:6,resource:{buffer:Pe}},...Se?[{binding:8,resource:{buffer:Se}}]:[]]}),Xe=e.createRenderPipeline({layout:"auto",vertex:{module:Ce,entryPoint:"quadVertex"},fragment:{module:Ce,entryPoint:R===4?"stochasticMsaaFragment":"stochasticFragment",targets:[{format:Y}]},primitive:{topology:"triangle-strip"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:R}}),Tt=e.createBindGroup({layout:Xe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:5,resource:{buffer:He}},{binding:7,resource:Ne.createView()}]}),Ft=R===4?`@group(0) @binding(3) var currentDepth: texture_depth_multisampled_2d;
       fn nearestDepth(p: vec2u) -> f32 {
         return min(min(textureLoad(currentDepth, p, 0), textureLoad(currentDepth, p, 1)),
                    min(textureLoad(currentDepth, p, 2), textureLoad(currentDepth, p, 3)));
       }
`:`@group(0) @binding(3) var currentDepth: texture_depth_2d;
       fn nearestDepth(p: vec2u) -> f32 { return textureLoad(currentDepth, p, 0); }
`,Ke=e.createShaderModule({code:Ft+Ct}),Ze=e.createRenderPipeline({layout:"auto",vertex:{module:Ke,entryPoint:"presentVertex"},fragment:{module:Ke,entryPoint:"temporalFragment",targets:[{format:r},{format:Y}]},primitive:{topology:"triangle-list"}}),Rt=e.createSampler({magFilter:"linear",minFilter:"linear"}),et=e.createShaderModule({code:Mt}),Be=GPUShaderStage.FRAGMENT,tt=e.createBindGroupLayout({entries:[{binding:0,visibility:Be,buffer:{type:"uniform"}},{binding:1,visibility:Be,texture:{sampleType:"unfilterable-float"}},{binding:2,visibility:Be,texture:{sampleType:"unfilterable-float"}}]}),Gt=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[tt]}),vertex:{module:et,entryPoint:"presentVertex"},fragment:{module:et,entryPoint:"accumulateFragment",targets:[{format:r},{format:"rgba32float"}]},primitive:{topology:"triangle-list"}}),Vt=4,Dt=1024,{pivot:rt,up:Ut}=bt(C),k=Number(a.get("camera")??0)%C.length,_=I.fromDataset(B?B[0]:C[k]),_e=a.get("mode"),j=_e==="points",$=_e!=="stochastic"&&_e!=="splats",kt=Number(a.get("history")??.7),Q=ae&&a.get("noise")!=="white",at=a.get("seed"),J=!1,qe=0,it="",E=0,Te=!1,Fe=0,Re=0;u.addEventListener("pointerdown",s=>{Te=!0,Fe=s.clientX,Re=s.clientY}),window.addEventListener("pointerup",()=>{Te=!1}),window.addEventListener("pointermove",s=>{Te&&(_.orbit(rt,Ut,-(s.clientX-Fe)*.005,-(s.clientY-Re)*.005),Fe=s.clientX,Re=s.clientY)}),u.addEventListener("wheel",s=>{s.preventDefault(),_.zoom(rt,Math.exp(s.deltaY*.001))},{passive:!1}),window.addEventListener("keydown",s=>{s.key==="ArrowRight"||s.key==="ArrowLeft"?(k=(k+(s.key==="ArrowRight"?1:C.length-1))%C.length,_=I.fromDataset(C[k]),J=!1):s.key==="p"||s.key==="P"?(j=!j,J=!1):(s.key==="b"||s.key==="B")&&ae?Q=!Q:(s.key==="t"||s.key==="T")&&($=!$,J=!1)});let Ot=[0,1,2].map(s=>C.reduce((n,m)=>n+m.position[s],0)/C.length),st=C.reduce((s,n)=>s+Math.hypot(...n.position.map((m,y)=>m-Ot[y])),0)/C.length,ot=0,nt=0,pe=null,fe,X,ie=[],me=[],lt=[],de=0,Ge=0,Lt=(s,n)=>{for(let v of[pe,fe,X,...ie,...me])v?.destroy();let m=GPUTextureUsage.RENDER_ATTACHMENT,y=GPUTextureUsage.TEXTURE_BINDING;pe=R===1?null:e.createTexture({size:[s,n],format:Y,sampleCount:R,usage:m}),fe=e.createTexture({size:[s,n],format:"depth32float",sampleCount:R,usage:m|y}),X=e.createTexture({size:[s,n],format:Y,usage:m|y}),ie=[0,1].map(()=>e.createTexture({size:[s,n],format:Y,usage:m|y})),me=[0,1].map(()=>e.createTexture({size:[s,n],format:"rgba32float",usage:m|y})),lt=[0,1].map(v=>e.createBindGroup({layout:Ze.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ee}},{binding:1,resource:X.createView()},{binding:2,resource:ie[v^1].createView()},{binding:3,resource:fe.createView()},{binding:4,resource:Rt}]})),ot=s,nt=n,J=!1},N=Number(a.get("bench")??0),jt=a.get("fullres")==="1",ct=(a.get("size")??"").split("x").map(Number),K=ct[0]||1600,se=ct[1]||Math.round(K*C[k].height/C[k].width),Ve=N>0?e.createTexture({size:[K,se],format:r,usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,ut=[],he=0,pt=performance.now(),ge=0,ft=[],$t=()=>({querySet:e.createQuerySet({type:"timestamp",count:2}),resolve:e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),readback:e.createBuffer({size:16,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})}),mt=i?e.createTexture({size:[1,1],format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,De=0,ye=0,Ue=0,ke=()=>{let s=he;B&&(_=I.fromDataset(B[Math.min(s,B.length-1)])),Ve&&(_=I.fromDataset(C[k]),s&1&&(_.position[0]+=1e-4));let n,m;if(Ve)n=K,m=se;else{let h=jt&&window.devicePixelRatio||1;n=Math.max(1,Math.round(u.clientWidth*h)),m=Math.max(1,Math.round(u.clientHeight*h)),(n!==u.width||m!==u.height)&&(u.width=n,u.height=m)}(n!==ot||m!==nt)&&Lt(n,m);let y=(Ve??p.getCurrentTexture()).createView(),v=_.projection(n,m,.0025*st,250*st),S=_.view(),xe=cr(v,S),Oe=n/_.width,ht=m/_.height,Wt=_.fx*Oe,Et=Math.abs(Oe/ht-1)<.01?_.fy*ht:_.fy*Oe,gt=[...S,n,m,j?1:0,$?1:0,Q?1:0].join(","),Nt=gt!==it;it=gt;let Z=$&&!j&&!Nt;Z||(E=0);let yt=Z&&E===0?ie[de^1]:null;yt&&(E=Math.min(qe,Vt));let xt=!Z||E<Dt,It=Z?1+E:at!==null?Number(at):s+1,H=e.createCommandEncoder(),ee={r:0,g:0,b:0,a:1},G=i?ft.pop()??$t():null,ve=G?.querySet;ve&&mt&&H.beginRenderPass({colorAttachments:[{view:mt.createView(),loadOp:"clear",storeOp:"store"}],timestampWrites:{querySet:ve,endOfPassWriteIndex:0}}).end();let vt=h=>ve&&h?{querySet:ve,endOfPassWriteIndex:1}:void 0;if(xt){if(j)e.queue.writeBuffer(We,0,new Float32Array(xe));else{let q=new ArrayBuffer(224),W=new Float32Array(q),te=new Uint32Array(q);W.set(S,0),W.set(v,16),W.set([..._.position,1],32),W.set([n,m,Wt,Et],36),te.set([M,b.meta.sh_degree,It,Q?1:0,re],40),A&&(W.set(A.scaleLo,48),W.set(A.scaleStep,52)),e.queue.writeBuffer(Ae,0,q),e.queue.writeBuffer(Pe,0,new Uint32Array([4,0,0,0]));let be=H.beginComputePass();be.setPipeline(Je),be.setBindGroup(0,qt),be.dispatchWorkgroups(Math.ceil(M/256)),be.end()}let h=H.beginRenderPass({colorAttachments:[pe?{view:pe.createView(),resolveTarget:X.createView(),loadOp:"clear",storeOp:"discard",clearValue:ee}:{view:X.createView(),loadOp:"clear",storeOp:"store",clearValue:ee}],depthStencilAttachment:{view:fe.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});j?(h.setPipeline(Qe),h.setBindGroup(0,_t),h.draw(M)):(h.setPipeline(Xe),h.setBindGroup(0,Tt),h.drawIndirect(Pe,0)),h.end()}if(Z){e.queue.writeBuffer(Ie,0,new Float32Array([xt?1/++E:0,0,0,0]));let h=e.createBindGroup({layout:tt,entries:[{binding:0,resource:{buffer:Ie}},{binding:1,resource:X.createView()},{binding:2,resource:(yt??me[Ge^1]).createView()}]}),q=H.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:ee},{view:me[Ge].createView(),loadOp:"clear",storeOp:"store",clearValue:ee}],timestampWrites:vt(!0)});q.setPipeline(Gt),q.setBindGroup(0,h),q.draw(3),q.end(),Ge^=1}else{let h=$&&!j&&J,q=new Float32Array(36),W=new Uint32Array(q.buffer);q.set(ur(xe),0),q.set(h?ut:xe,16),W[32]=h?1:0,q[33]=kt,e.queue.writeBuffer(Ee,0,q);let te=H.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:ee},{view:ie[de].createView(),loadOp:"clear",storeOp:"store",clearValue:ee}],timestampWrites:vt(!0)});te.setPipeline(Ze),te.setBindGroup(0,lt[de]),te.draw(3),te.end(),qe=h?qe+1:1,de^=1,ut=xe,J=!0}if(G&&(H.resolveQuerySet(G.querySet,0,2,G.resolve,0),H.copyBufferToBuffer(G.resolve,0,G.readback,0,16)),e.queue.submit([H.finish()]),G&&G.readback.mapAsync(GPUMapMode.READ).then(()=>{let h=new BigUint64Array(G.readback.getMappedRange());h[1]>h[0]&&(De+=Number(h[1]-h[0])/1e6,++ye),G.readback.unmap(),ft.push(G),ye===30&&(Ue=De/ye,De=0,ye=0)}),++he%30===0){let h=performance.now();ge=3e4/(h-pt),pt=h}let Yt=`${ge.toFixed(0)} fps (${ge>0?(1e3/ge).toFixed(1):"-"} ms per frame`+(i?`, GPU ${Ue>0?Ue.toFixed(2):"-"} ms`:`, GPU time unavailable${l?" in Firefox":""}`)+")",Qt=j?"points":`stochastic splats, ${R} sample${R>1?"s":""} per pixel, ${Q?"blue":"white"} noise`+(Z?`, still: ${E} frames averaged`:$?", temporal reuse":""),Jt=["",", Mip-Splatting",", Mip-Splatting (area)"][re],Xt=`${(Bt/1e6).toFixed(0)} MB on the GPU, ${A?"quantized":"float"}`;le(`${M.toLocaleString()} Gaussians${Jt} (${Qt}; ${Xt}), loaded in ${V.toFixed(1)} s from ${d}
`+(B?`path frame ${Math.min(s,B.length-1)+1} / ${B.length}`:`camera ${k} (${C[k].name})`)+`, ${n} x ${m}, ${Yt}
drag: orbit, wheel: zoom, left/right: dataset cameras, P: points, T: temporal reuse, B: blue / white noise
`+(ae?"":`blue noise unavailable (assets/stbn missing)
`)+ce)},dt=()=>{if(ke(),B&&he===B.length){window.__ready=!0;return}!B&&he===2&&(window.__ready=!0),requestAnimationFrame(dt)};N>0?await Ht():requestAnimationFrame(dt);async function Ht(){le(`benchmark: ${N} frames at ${K} x ${se}...`),await new Promise(v=>setTimeout(v,500));for(let v=0;v<5;++v)ke();await e.queue.onSubmittedWorkDone();let s=performance.now();for(let v=0;v<N;++v)ke();await e.queue.onSubmittedWorkDone();let n=(performance.now()-s)/N,m={model:d,msaa:R,quantized:!!A,blueNoise:Q,temporal:$,width:K,height:se,frames:N,ms:n,gaussians:M,userAgent:navigator.userAgent};window.__bench=m,le(`benchmark: ${N} frames at ${K} x ${se}, ${R}x MSAA${$?" + temporal":""}, ${A?"quantized":"float"}: ${n.toFixed(2)} ms/frame (${(1e3/n).toFixed(0)} fps)
${d}`),window.__ready=!0;let y=a.get("report");if(y){let v=await(await fetch(y,{method:"POST",body:JSON.stringify(m)})).text();v.trim()&&(location.href=v.trim())}}}pr().catch(a=>{le(`error: ${a.message??a}`),console.error(a)});
