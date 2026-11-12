async function Ge(s){return(await(await fetch(s)).json()).map(e=>({name:e.img_name,width:e.width,height:e.height,fx:e.fx,fy:e.fy,position:e.position,rotation:e.rotation}))}var Te=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],ge=(s,t)=>s[0]*t[0]+s[1]*t[1]+s[2]*t[2],se=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],ye=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],Ot=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]],Re=s=>se(s,1/Math.hypot(...s)),W=class s{constructor(t,e,r,o,f,u,a,g){this.position=t;this.right=e;this.down=r;this.forward=o;this.fx=f;this.fy=u;this.width=a;this.height=g}position;right;down;forward;fx;fy;width;height;static fromDataset(t){let e=r=>[t.rotation[0][r],t.rotation[1][r],t.rotation[2][r]];return new s([...t.position],e(0),e(1),e(2),t.fx,t.fy,t.width,t.height)}view(){let t=this.right,e=this.down,r=this.forward,o=this.position;return new Float32Array([t[0],e[0],r[0],0,t[1],e[1],r[1],0,t[2],e[2],r[2],0,-ge(t,o),-ge(e,o),-ge(r,o),1])}projection(t,e,r,o){let f=t/this.width,u=e/this.height,a=this.fx*f,g=Math.abs(f/u-1)<.01?this.fy*u:this.fy*f,m=o/(o-r),h=-o*r/(o-r);return new Float32Array([2*a/t,0,0,0,0,-2*g/e,0,0,0,0,m,1,0,0,h,0])}orbit(t,e,r,o){let f=(a,g,m)=>{let h=Math.cos(m),b=Math.sin(m);return ye(ye(se(a,h),se(Ot(g,a),b)),se(g,ge(g,a)*(1-h)))},u=(a,g)=>{this.position=ye(t,f(Te(this.position,t),a,g)),this.right=f(this.right,a,g),this.down=f(this.down,a,g),this.forward=f(this.forward,a,g)};u(Re(e),r),u(Re(this.right),o)}zoom(t,e){this.position=ye(t,se(Te(this.position,t),e))}};function pt(s){let t=[0,0,0,0,0,0,0,0,0],e=[0,0,0],r=[0,0,0];for(let a of s){let g=[a.rotation[0][2],a.rotation[1][2],a.rotation[2][2]];r=Te(r,[a.rotation[0][1],a.rotation[1][1],a.rotation[2][1]]);for(let m=0;m<3;++m)for(let h=0;h<3;++h){let b=(m===h?1:0)-g[m]*g[h];t[3*m+h]+=b,e[m]+=b*a.position[h]}}let o=a=>a[0]*(a[4]*a[8]-a[5]*a[7])-a[1]*(a[3]*a[8]-a[5]*a[6])+a[2]*(a[3]*a[7]-a[4]*a[6]),f=o(t);return{pivot:[0,1,2].map(a=>{let g=[...t];for(let m=0;m<3;++m)g[3*m+a]=e[m];return o(g)/f}),up:Re(r)}}async function Lt(s,t,e){let r=await(await fetch(s)).blob(),o=await createImageBitmap(r,{colorSpaceConversion:"none",premultiplyAlpha:"none"});if(o.width!==t||o.height!==e)throw new Error(`${s}: unexpected size`);let u=new OffscreenCanvas(t,e).getContext("2d",{willReadFrequently:!0});return u.drawImage(o,0,0),o.close(),u.getImageData(0,0,t,e).data}function jt(s,t,e){let r=Math.floor(t/2),o=0,f=0;for(let u=0;u<t;++u){let a=Math.floor(s/2**u)%2;u<2*r?u%2===0?o+=a*2**(u/2):f+=a*2**((u-1)/2):o+=a*2**r}return f*e+o}var oe=(s,t,e,r)=>t+s/(2**r-1)*(e-t);async function ft(s,t,e=!1){let r=await(await fetch(`${s}/meta.json`)).json();if(r.format!=="gaussian-splats-images-1")throw new Error(`${s}: unknown format ${r.format}`);let o=r.count,f=r.width,u=r.height,a=r.ranges,g=1;for(;2**g<Math.max(o,2);)++g;let m=new Uint32Array(o);for(let n=0;n<o;++n)m[n]=4*jt(n,g,f);let h=(r.sh_degree+1)**2-1,b=["means_l","means_u","scales","quats","extra","sh0",...Array.from({length:h},(n,c)=>`shN_${String(c).padStart(2,"0")}`)],xe=0,U=new Map;await Promise.all(b.map(async n=>{U.set(n,await Lt(`${s}/${n}.webp`,f,u)),t(`decoding images ${++xe} / ${b.length}`)}));let M=n=>U.get(n),w=a.log_filter!==void 0,T={meta:r,count:o,positions:new Float32Array(3*o),opacities:new Float32Array(o),mip:w,float:null,quantized:null},C=M("means_l"),ee=M("means_u"),O=M("scales"),L=M("quats"),P=M("extra"),_=M("sh0");for(let n=0;n<o;++n){let c=m[n];for(let p=0;p<3;++p){let z=oe(C[c+p]+256*ee[c+p],a.position.lo[p],a.position.hi[p],16);T.positions[3*n+p]=Math.sign(z)*Math.expm1(Math.abs(z))}T.opacities[n]=Math.min(Math.max(P[c]/255,1e-6),1-1e-6)}let j=n=>r.sh_bits[n<3?0:n<8?1:2];if(e){let n={scaleWords:new Uint32Array(o),rotationWords:new Uint32Array(o),shBytes:new Uint8Array(48*o),scaleLo:[...a.log_scale.lo,w?a.log_filter.lo[0]:0],scaleStep:[0,1,2].map(c=>(a.log_scale.hi[c]-a.log_scale.lo[c])/255).concat(w?(a.log_filter.hi[0]-a.log_filter.lo[0])/255:0),shRange:new Float32Array(96)};for(let c=0;c<o;++c){let p=m[c];n.scaleWords[c]=(O[p]|O[p+1]<<8|O[p+2]<<16|(w?P[p+2]:0)<<24)>>>0,n.rotationWords[c]=(P[p+1]|L[p]<<8|L[p+1]<<16|L[p+2]<<24)>>>0;for(let z=0;z<3;++z)n.shBytes[48*c+z]=_[p+z]}for(let c=0;c<3;++c)n.shRange[c]=a.sh0.lo[c],n.shRange[48+c]=(a.sh0.hi[c]-a.sh0.lo[c])/255;for(let c=0;c<h;++c){let p=M(b[6+c]),z=2**j(c)-1;for(let x=0;x<3;++x)n.shRange[3*(c+1)+x]=a.shN.lo[3*c+x],n.shRange[48+3*(c+1)+x]=(a.shN.hi[3*c+x]-a.shN.lo[3*c+x])/z;for(let x=0;x<o;++x)for(let N=0;N<3;++N)n.shBytes[48*x+3*(c+1)+N]=p[m[x]+N]}return T.quantized=n,T}let F={logScales:new Float32Array(3*o),rotations:new Float32Array(4*o),sh:new Float32Array(48*o),filter3D:w?new Float32Array(o):null};for(let n=0;n<o;++n){let c=m[n];for(let p=0;p<3;++p)F.logScales[3*n+p]=oe(O[c+p],a.log_scale.lo[p],a.log_scale.hi[p],8),F.rotations[4*n+1+p]=L[c+p]/127.5-1,F.sh[48*n+p]=oe(_[c+p],a.sh0.lo[p],a.sh0.hi[p],8);F.rotations[4*n]=P[c+1]/127.5-1,F.filter3D&&(F.filter3D[n]=Math.exp(oe(P[c+2],a.log_filter.lo[0],a.log_filter.hi[0],8)))}for(let n=0;n<h;++n){let c=j(n),p=M(b[6+n]);for(let z=0;z<o;++z)for(let x=0;x<3;++x)F.sh[48*z+3*(n+1)+x]=oe(p[m[z]+x],a.shN.lo[3*n+x],a.shN.hi[3*n+x],c)}return T.float=F,T}var mt=`// Step 33a: every Gaussian's center as a one-pixel point with its base color (SH coefficient 0), as the C++ viewer's
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
`;var dt=`// Step 33b: stochastic splats, ported from the C++ viewer (shaders/splats.metal: splatPreprocess, splatQuadVertex,
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
`;var ht=`// The Gaussians' scales, rotations and SH as float32 (main.ts prepends this or attributes_quantized.wgsl to
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
`;var gt=`// Step 33h: the Gaussians' scales, rotations and SH quantized, decoded here, as the C++ viewer's --quantized
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
`;var yt=`// Step 33e: accumulation while the camera is still, as the C++ viewer's msaa-temporal mode (step 27g; StillAccumulator
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
`;var xt=`// Step 33d: SteadySplats' temporal reuse on stochastic frames (1 sample or 4x MSAA), ported from the C++ viewer
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
`;var Yt=.28209479177387814,Qt=document.getElementById("status"),ne=s=>{Qt.textContent=s};function Jt(s,t){let e=new Array(16).fill(0);for(let r=0;r<4;++r)for(let o=0;o<4;++o)for(let f=0;f<4;++f)e[4*r+o]+=s[4*f+o]*t[4*r+f];return e}function Xt(s){let t=Array.from({length:4},(r,o)=>[0,1,2,3].map(f=>s[4*f+o]).concat([0,1,2,3].map(f=>f===o?1:0)));for(let r=0;r<4;++r){let o=r;for(let u=r+1;u<4;++u)Math.abs(t[u][r])>Math.abs(t[o][r])&&(o=u);[t[r],t[o]]=[t[o],t[r]];let f=t[r][r];for(let u=0;u<8;++u)t[r][u]/=f;for(let u=0;u<4;++u)if(u!==r){let a=t[u][r];for(let g=0;g<8;++g)t[u][g]-=a*t[r][g]}}let e=new Array(16);for(let r=0;r<4;++r)for(let o=0;o<4;++o)e[4*r+o]=t[o][4+r];return e}async function Kt(){let s=new URLSearchParams(location.search);if(!navigator.gpu)throw new Error("WebGPU is not available in this browser");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("no WebGPU adapter");let e=await t.requestDevice({requiredLimits:{maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize}}),r=document.getElementById("view"),o=r.getContext("webgpu"),f=navigator.gpu.getPreferredCanvasFormat();o.configure({device:e,format:f,alphaMode:"opaque"});let u=s.get("model")??"../out/step32a/kitchen",a=performance.now(),g=s.get("float")!=="1",m=await ft(u,ne,g),h=await Ge(`${u}/cameras.json`),b=s.get("path")?await Ge(s.get("path")):null,xe=(performance.now()-a)/1e3,U=i=>i.reduce((l,d)=>l+d,0),M=m.float,w=m.quantized,T=`checksums: positions ${U(m.positions).toFixed(3)}, `+(M?`log-scales ${U(M.logScales).toFixed(3)}, SH ${U(M.sh).toFixed(3)}, `:"")+`opacity ${U(m.opacities).toFixed(3)}`;console.log(T);let C=m.count,ee=new Float32Array(4*C),O=new Float32Array(4*C);for(let i=0;i<C;++i){for(let l=0;l<3;++l){ee[4*i+l]=m.positions[3*i+l];let d=M?M.sh[48*i+l]:w.shRange[l]+w.shRange[48+l]*w.shBytes[48*i+l];O[4*i+l]=Math.max(0,.5+Yt*d)}ee[4*i+3]=m.opacities[i]}let L=m.mip?m.meta.mip_area?2:1:0,P=(i,l)=>{let d=e.createBuffer({size:i.byteLength,usage:l|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(d,0,i),d},_=GPUBufferUsage.STORAGE,j=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,F=P(ee,_),n=P(O,_),c,p,z,x=null;if(w)c=P(w.scaleWords,_),p=P(w.rotationWords,_),z=P(w.shBytes,_),x=P(w.shRange,_);else{let i=M,l=new Float32Array(4*C),d=new Float32Array(4*C);for(let y=0;y<C;++y){let v=0;for(let S=0;S<4;++S)v+=i.rotations[4*y+S]**2;v=Math.sqrt(v)||1;for(let S=0;S<4;++S)d[4*y+S]=i.rotations[4*y+S]/v;for(let S=0;S<3;++S)l[4*y+S]=Math.exp(i.logScales[3*y+S]),i.filter3D&&(l[4*y+S]=Math.hypot(l[4*y+S],i.filter3D[y]));i.filter3D&&(l[4*y+3]=i.filter3D[y])}c=P(l,_),p=P(d,_),z=P(i.sh,_)}let N=[F,c,p,z].reduce((i,l)=>i+l.size,0),De=e.createBuffer({size:64*C,usage:_}),ve=P(new Uint32Array([4,0,0,0]),_|GPUBufferUsage.INDIRECT),be=e.createBuffer({size:224,usage:j}),ke=e.createBuffer({size:64,usage:j}),Ue=e.createBuffer({size:144,usage:j}),we=await fetch("../assets/stbn/stbn_scalar_128x128x64.r8").then(i=>i.ok?i.arrayBuffer():null,()=>null),te=we!==null&&we.byteLength===16384*64,le=te?[128,128,64]:[1,1,1],Oe=e.createTexture({size:le,dimension:"3d",format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:Oe},te?we:new Uint8Array(1),{bytesPerRow:le[0],rowsPerImage:le[1]},le);let Le=e.createBuffer({size:16,usage:j}),V=s.get("msaa")==="1"?1:4,E="rgba16float",je=e.createShaderModule({code:mt}),$e=e.createRenderPipeline({layout:"auto",vertex:{module:je,entryPoint:"pointVertex"},fragment:{module:je,entryPoint:"pointFragment",targets:[{format:E}]},primitive:{topology:"point-list"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"always"},multisample:{count:V}}),vt=e.createBindGroup({layout:$e.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:ke}},{binding:1,resource:{buffer:F}},{binding:2,resource:{buffer:n}}]}),ze=e.createShaderModule({code:(w?gt:ht)+dt}),He=e.createComputePipeline({layout:"auto",compute:{module:ze,entryPoint:"preprocess"}}),bt=e.createBindGroup({layout:He.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:be}},{binding:1,resource:{buffer:F}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:p}},{binding:4,resource:{buffer:z}},{binding:5,resource:{buffer:De}},{binding:6,resource:{buffer:ve}},...x?[{binding:8,resource:{buffer:x}}]:[]]}),We=e.createRenderPipeline({layout:"auto",vertex:{module:ze,entryPoint:"quadVertex"},fragment:{module:ze,entryPoint:V===4?"stochasticMsaaFragment":"stochasticFragment",targets:[{format:E}]},primitive:{topology:"triangle-strip"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:V}}),wt=e.createBindGroup({layout:We.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:be}},{binding:5,resource:{buffer:De}},{binding:7,resource:Oe.createView()}]}),zt=V===4?`@group(0) @binding(3) var currentDepth: texture_depth_multisampled_2d;
       fn nearestDepth(p: vec2u) -> f32 {
         return min(min(textureLoad(currentDepth, p, 0), textureLoad(currentDepth, p, 1)),
                    min(textureLoad(currentDepth, p, 2), textureLoad(currentDepth, p, 3)));
       }
`:`@group(0) @binding(3) var currentDepth: texture_depth_2d;
       fn nearestDepth(p: vec2u) -> f32 { return textureLoad(currentDepth, p, 0); }
`,Ne=e.createShaderModule({code:zt+xt}),Ee=e.createRenderPipeline({layout:"auto",vertex:{module:Ne,entryPoint:"presentVertex"},fragment:{module:Ne,entryPoint:"temporalFragment",targets:[{format:f},{format:E}]},primitive:{topology:"triangle-list"}}),St=e.createSampler({magFilter:"linear",minFilter:"linear"}),Ie=e.createShaderModule({code:yt}),Se=GPUShaderStage.FRAGMENT,Ye=e.createBindGroupLayout({entries:[{binding:0,visibility:Se,buffer:{type:"uniform"}},{binding:1,visibility:Se,texture:{sampleType:"unfilterable-float"}},{binding:2,visibility:Se,texture:{sampleType:"unfilterable-float"}}]}),At=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[Ye]}),vertex:{module:Ie,entryPoint:"presentVertex"},fragment:{module:Ie,entryPoint:"accumulateFragment",targets:[{format:f},{format:"rgba32float"}]},primitive:{topology:"triangle-list"}}),Pt=4,Mt=1024,{pivot:Qe,up:Ct}=pt(h),R=Number(s.get("camera")??0)%h.length,q=W.fromDataset(b?b[0]:h[R]),Ae=s.get("mode"),G=Ae==="points",D=Ae!=="stochastic"&&Ae!=="splats",_t=Number(s.get("history")??.7),I=te&&s.get("noise")!=="white",Je=s.get("seed"),Y=!1,Pe=0,Xe="",$=0,Me=!1,Ce=0,_e=0;r.addEventListener("pointerdown",i=>{Me=!0,Ce=i.clientX,_e=i.clientY}),window.addEventListener("pointerup",()=>{Me=!1}),window.addEventListener("pointermove",i=>{Me&&(q.orbit(Qe,Ct,-(i.clientX-Ce)*.005,-(i.clientY-_e)*.005),Ce=i.clientX,_e=i.clientY)}),r.addEventListener("wheel",i=>{i.preventDefault(),q.zoom(Qe,Math.exp(i.deltaY*.001))},{passive:!1}),window.addEventListener("keydown",i=>{i.key==="ArrowRight"||i.key==="ArrowLeft"?(R=(R+(i.key==="ArrowRight"?1:h.length-1))%h.length,q=W.fromDataset(h[R]),Y=!1):i.key==="p"||i.key==="P"?(G=!G,Y=!1):(i.key==="b"||i.key==="B")&&te?I=!I:(i.key==="t"||i.key==="T")&&(D=!D,Y=!1)});let qt=[0,1,2].map(i=>h.reduce((l,d)=>l+d.position[i],0)/h.length),Ke=h.reduce((i,l)=>i+Math.hypot(...l.position.map((d,y)=>d-qt[y])),0)/h.length,Ze=0,et=0,ce=null,ue,Q,re=[],pe=[],tt=[],fe=0,qe=0,Bt=(i,l)=>{for(let v of[ce,ue,Q,...re,...pe])v?.destroy();let d=GPUTextureUsage.RENDER_ATTACHMENT,y=GPUTextureUsage.TEXTURE_BINDING;ce=V===1?null:e.createTexture({size:[i,l],format:E,sampleCount:V,usage:d}),ue=e.createTexture({size:[i,l],format:"depth32float",sampleCount:V,usage:d|y}),Q=e.createTexture({size:[i,l],format:E,usage:d|y}),re=[0,1].map(()=>e.createTexture({size:[i,l],format:E,usage:d|y})),pe=[0,1].map(()=>e.createTexture({size:[i,l],format:"rgba32float",usage:d|y})),tt=[0,1].map(v=>e.createBindGroup({layout:Ee.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ue}},{binding:1,resource:Q.createView()},{binding:2,resource:re[v^1].createView()},{binding:3,resource:ue.createView()},{binding:4,resource:St}]})),Ze=i,et=l,Y=!1},H=Number(s.get("bench")??0),rt=(s.get("size")??"").split("x").map(Number),J=rt[0]||1600,ae=rt[1]||Math.round(J*h[R].height/h[R].width),Be=H>0?e.createTexture({size:[J,ae],format:f,usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,at=[],me=0,it=performance.now(),st=0,Fe=()=>{let i=me;b&&(q=W.fromDataset(b[Math.min(i,b.length-1)])),Be&&(q=W.fromDataset(h[R]),i&1&&(q.position[0]+=1e-4));let l,d;if(Be)l=J,d=ae;else{let A=window.devicePixelRatio||1;l=Math.max(1,Math.round(r.clientWidth*A)),d=Math.max(1,Math.round(r.clientHeight*A)),(l!==r.width||d!==r.height)&&(r.width=l,r.height=d)}(l!==Ze||d!==et)&&Bt(l,d);let y=(Be??o.getCurrentTexture()).createView(),v=q.projection(l,d,.0025*Ke,250*Ke),S=q.view(),de=Jt(v,S),Ve=l/q.width,nt=d/q.height,Vt=q.fx*Ve,Tt=Math.abs(Ve/nt-1)<.01?q.fy*nt:q.fy*Ve,lt=[...S,l,d,G?1:0,D?1:0,I?1:0].join(","),Rt=lt!==Xe;Xe=lt;let X=D&&!G&&!Rt;X||($=0);let ct=X&&$===0?re[fe^1]:null;ct&&($=Math.min(Pe,Pt));let ut=!X||$<Mt,Gt=X?1+$:Je!==null?Number(Je):i+1,ie=e.createCommandEncoder(),K={r:0,g:0,b:0,a:1};if(ut){if(G)e.queue.writeBuffer(ke,0,new Float32Array(de));else{let B=new ArrayBuffer(224),k=new Float32Array(B),Z=new Uint32Array(B);k.set(S,0),k.set(v,16),k.set([...q.position,1],32),k.set([l,d,Vt,Tt],36),Z.set([C,m.meta.sh_degree,Gt,I?1:0,L],40),w&&(k.set(w.scaleLo,48),k.set(w.scaleStep,52)),e.queue.writeBuffer(be,0,B),e.queue.writeBuffer(ve,0,new Uint32Array([4,0,0,0]));let he=ie.beginComputePass();he.setPipeline(He),he.setBindGroup(0,bt),he.dispatchWorkgroups(Math.ceil(C/256)),he.end()}let A=ie.beginRenderPass({colorAttachments:[ce?{view:ce.createView(),resolveTarget:Q.createView(),loadOp:"clear",storeOp:"discard",clearValue:K}:{view:Q.createView(),loadOp:"clear",storeOp:"store",clearValue:K}],depthStencilAttachment:{view:ue.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});G?(A.setPipeline($e),A.setBindGroup(0,vt),A.draw(C)):(A.setPipeline(We),A.setBindGroup(0,wt),A.drawIndirect(ve,0)),A.end()}if(X){e.queue.writeBuffer(Le,0,new Float32Array([ut?1/++$:0,0,0,0]));let A=e.createBindGroup({layout:Ye,entries:[{binding:0,resource:{buffer:Le}},{binding:1,resource:Q.createView()},{binding:2,resource:(ct??pe[qe^1]).createView()}]}),B=ie.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:K},{view:pe[qe].createView(),loadOp:"clear",storeOp:"store",clearValue:K}]});B.setPipeline(At),B.setBindGroup(0,A),B.draw(3),B.end(),qe^=1}else{let A=D&&!G&&Y,B=new Float32Array(36),k=new Uint32Array(B.buffer);B.set(Xt(de),0),B.set(A?at:de,16),k[32]=A?1:0,B[33]=_t,e.queue.writeBuffer(Ue,0,B);let Z=ie.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:K},{view:re[fe].createView(),loadOp:"clear",storeOp:"store",clearValue:K}]});Z.setPipeline(Ee),Z.setBindGroup(0,tt[fe]),Z.draw(3),Z.end(),Pe=A?Pe+1:1,fe^=1,at=de,Y=!0}if(e.queue.submit([ie.finish()]),++me%30===0){let A=performance.now();st=3e4/(A-it),it=A}let Dt=G?"points":`stochastic splats, ${V} sample${V>1?"s":""} per pixel, ${I?"blue":"white"} noise`+(X?`, still: ${$} frames averaged`:D?", temporal reuse":""),kt=["",", Mip-Splatting",", Mip-Splatting (area)"][L],Ut=`${(N/1e6).toFixed(0)} MB on the GPU, ${w?"quantized":"float"}`;ne(`${C.toLocaleString()} Gaussians${kt} (${Dt}; ${Ut}), loaded in ${xe.toFixed(1)} s from ${u}
`+(b?`path frame ${Math.min(i,b.length-1)+1} / ${b.length}`:`camera ${R} (${h[R].name})`)+`, ${l} x ${d}, ${st.toFixed(0)} fps
drag: orbit, wheel: zoom, left/right: dataset cameras, P: points, T: temporal reuse, B: blue / white noise
`+(te?"":`blue noise unavailable (assets/stbn missing)
`)+T)},ot=()=>{if(Fe(),b&&me===b.length){window.__ready=!0;return}!b&&me===2&&(window.__ready=!0),requestAnimationFrame(ot)};H>0?await Ft():requestAnimationFrame(ot);async function Ft(){ne(`benchmark: ${H} frames at ${J} x ${ae}...`),await new Promise(v=>setTimeout(v,500));for(let v=0;v<5;++v)Fe();await e.queue.onSubmittedWorkDone();let i=performance.now();for(let v=0;v<H;++v)Fe();await e.queue.onSubmittedWorkDone();let l=(performance.now()-i)/H,d={model:u,msaa:V,quantized:!!w,blueNoise:I,temporal:D,width:J,height:ae,frames:H,ms:l,gaussians:C,userAgent:navigator.userAgent};window.__bench=d,ne(`benchmark: ${H} frames at ${J} x ${ae}, ${V}x MSAA${D?" + temporal":""}, ${w?"quantized":"float"}: ${l.toFixed(2)} ms/frame (${(1e3/l).toFixed(0)} fps)
${u}`),window.__ready=!0;let y=s.get("report");if(y){let v=await(await fetch(y,{method:"POST",body:JSON.stringify(d)})).text();v.trim()&&(location.href=v.trim())}}}Kt().catch(s=>{ne(`error: ${s.message??s}`),console.error(s)});
