async function $e(r){return(await(await fetch(r)).json()).map(l=>({name:l.img_name,width:l.width,height:l.height,fx:l.fx,fy:l.fy,position:l.position,rotation:l.rotation}))}var Le=(r,t)=>[r[0]-t[0],r[1]-t[1],r[2]-t[2]],ze=(r,t)=>r[0]*t[0]+r[1]*t[1]+r[2]*t[2],oe=(r,t)=>[r[0]*t,r[1]*t,r[2]*t],Se=(r,t)=>[r[0]+t[0],r[1]+t[1],r[2]+t[2]],Zt=(r,t)=>[r[1]*t[2]-r[2]*t[1],r[2]*t[0]-r[0]*t[2],r[0]*t[1]-r[1]*t[0]],je=r=>oe(r,1/Math.hypot(...r)),Y=class r{constructor(t,l,i,e,s,f,n,o){this.position=t;this.right=l;this.down=i;this.forward=e;this.fx=s;this.fy=f;this.width=n;this.height=o}position;right;down;forward;fx;fy;width;height;static fromDataset(t){let l=i=>[t.rotation[0][i],t.rotation[1][i],t.rotation[2][i]];return new r([...t.position],l(0),l(1),l(2),t.fx,t.fy,t.width,t.height)}view(){let t=this.right,l=this.down,i=this.forward,e=this.position;return new Float32Array([t[0],l[0],i[0],0,t[1],l[1],i[1],0,t[2],l[2],i[2],0,-ze(t,e),-ze(l,e),-ze(i,e),1])}projection(t,l,i,e){let s=t/this.width,f=l/this.height,n=this.fx*s,o=Math.abs(s/f-1)<.01?this.fy*f:this.fy*s,h=e/(e-i),b=-e*i/(e-i);return new Float32Array([2*n/t,0,0,0,0,-2*o/l,0,0,0,0,h,1,0,0,b,0])}orbit(t,l,i,e){let s=(n,o,h)=>{let b=Math.cos(h),S=Math.sin(h);return Se(Se(oe(n,b),oe(Zt(o,n),S)),oe(o,ze(o,n)*(1-b)))},f=(n,o)=>{this.position=Se(t,s(Le(this.position,t),n,o)),this.right=s(this.right,n,o),this.down=s(this.down,n,o),this.forward=s(this.forward,n,o)};f(je(l),i),f(je(this.right),e)}zoom(t,l){this.position=Se(t,oe(Le(this.position,t),l))}};function vt(r){let t=[0,0,0,0,0,0,0,0,0],l=[0,0,0],i=[0,0,0];for(let n of r){let o=[n.rotation[0][2],n.rotation[1][2],n.rotation[2][2]];i=Le(i,[n.rotation[0][1],n.rotation[1][1],n.rotation[2][1]]);for(let h=0;h<3;++h)for(let b=0;b<3;++b){let S=(h===b?1:0)-o[h]*o[b];t[3*h+b]+=S,l[h]+=S*n.position[b]}}let e=n=>n[0]*(n[4]*n[8]-n[5]*n[7])-n[1]*(n[3]*n[8]-n[5]*n[6])+n[2]*(n[3]*n[7]-n[4]*n[6]),s=e(t);return{pivot:[0,1,2].map(n=>{let o=[...t];for(let h=0;h<3;++h)o[3*h+n]=l[h];return e(o)/s}),up:je(i)}}var wt=Promise.resolve();async function er(r,t,l,i){let e=await(await fetch(t)).blob(),s=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"});if(s.width!==l||s.height!==i)throw new Error(`${t}: unexpected size`);let f=wt.then(async()=>{let n=r.createTexture({size:[l,i],format:"rgba8unorm",usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC|GPUTextureUsage.RENDER_ATTACHMENT});r.queue.copyExternalImageToTexture({source:s},{texture:n},[l,i]);let o=Math.ceil(4*l/256)*256,h=r.createBuffer({size:o*i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),b=r.createCommandEncoder();b.copyTextureToBuffer({texture:n},{buffer:h,bytesPerRow:o},[l,i]),r.queue.submit([b.finish()]),await h.mapAsync(GPUMapMode.READ);let S=new Uint8Array(h.getMappedRange()),v=new Uint8Array(4*l*i);for(let P=0;P<i;++P)v.set(S.subarray(P*o,P*o+4*l),4*l*P);return h.unmap(),h.destroy(),n.destroy(),s.close(),v});return wt=f.catch(()=>{}),f}function tr(r,t,l){let i=Math.floor(t/2),e=0,s=0;for(let f=0;f<t;++f){let n=Math.floor(r/2**f)%2;f<2*i?f%2===0?e+=n*2**(f/2):s+=n*2**((f-1)/2):e+=n*2**i}return s*l+e}var ne=(r,t,l,i)=>t+r/(2**i-1)*(l-t);async function zt(r,t,l,i=!1){let e=await(await fetch(`${t}/meta.json`)).json();if(e.format!=="gaussian-splats-images-1")throw new Error(`${t}: unknown format ${e.format}`);let s=e.count,f=e.width,n=e.height,o=e.ranges,h=1;for(;2**h<Math.max(s,2);)++h;let b=new Uint32Array(s);for(let c=0;c<s;++c)b[c]=4*tr(c,h,f);let S=(e.sh_degree+1)**2-1,v=["means_l","means_u","scales","quats","extra","sh0",...Array.from({length:S},(c,p)=>`shN_${String(p).padStart(2,"0")}`)],P=0,ce=new Map;await Promise.all(v.map(async c=>{ce.set(c,await er(r,`${t}/${c}.webp`,f,n)),l(`decoding images ${++P} / ${v.length}`)}));let q=c=>ce.get(c),F=o.log_filter!==void 0,w={meta:e,count:s,positions:new Float32Array(3*s),opacities:new Float32Array(s),mip:F,float:null,quantized:null},ue=q("means_l"),T=q("means_u"),k=q("scales"),W=q("quats"),O=q("extra"),G=q("sh0");for(let c=0;c<s;++c){let p=b[c];for(let m=0;m<3;++m){let A=ne(ue[p+m]+256*T[p+m],o.position.lo[m],o.position.hi[m],16);w.positions[3*c+m]=Math.sign(A)*Math.expm1(Math.abs(A))}w.opacities[c]=Math.min(Math.max(O[p]/255,1e-6),1-1e-6)}let C=c=>e.sh_bits[c<3?0:c<8?1:2];if(i){let c={scaleWords:new Uint32Array(s),rotationWords:new Uint32Array(s),shBytes:new Uint8Array(48*s),scaleLo:[...o.log_scale.lo,F?o.log_filter.lo[0]:0],scaleStep:[0,1,2].map(p=>(o.log_scale.hi[p]-o.log_scale.lo[p])/255).concat(F?(o.log_filter.hi[0]-o.log_filter.lo[0])/255:0),shRange:new Float32Array(96)};for(let p=0;p<s;++p){let m=b[p];c.scaleWords[p]=(k[m]|k[m+1]<<8|k[m+2]<<16|(F?O[m+2]:0)<<24)>>>0,c.rotationWords[p]=(O[m+1]|W[m]<<8|W[m+1]<<16|W[m+2]<<24)>>>0;for(let A=0;A<3;++A)c.shBytes[48*p+A]=G[m+A]}for(let p=0;p<3;++p)c.shRange[p]=o.sh0.lo[p],c.shRange[48+p]=(o.sh0.hi[p]-o.sh0.lo[p])/255;for(let p=0;p<S;++p){let m=q(v[6+p]),A=2**C(p)-1;for(let x=0;x<3;++x)c.shRange[3*(p+1)+x]=o.shN.lo[3*p+x],c.shRange[48+3*(p+1)+x]=(o.shN.hi[3*p+x]-o.shN.lo[3*p+x])/A;for(let x=0;x<s;++x)for(let L=0;L<3;++L)c.shBytes[48*x+3*(p+1)+L]=m[b[x]+L]}return w.quantized=c,w}let R={logScales:new Float32Array(3*s),rotations:new Float32Array(4*s),sh:new Float32Array(48*s),filter3D:F?new Float32Array(s):null};for(let c=0;c<s;++c){let p=b[c];for(let m=0;m<3;++m)R.logScales[3*c+m]=ne(k[p+m],o.log_scale.lo[m],o.log_scale.hi[m],8),R.rotations[4*c+1+m]=W[p+m]/127.5-1,R.sh[48*c+m]=ne(G[p+m],o.sh0.lo[m],o.sh0.hi[m],8);R.rotations[4*c]=O[p+1]/127.5-1,R.filter3D&&(R.filter3D[c]=Math.exp(ne(O[p+2],o.log_filter.lo[0],o.log_filter.hi[0],8)))}for(let c=0;c<S;++c){let p=C(c),m=q(v[6+c]);for(let A=0;A<s;++A)for(let x=0;x<3;++x)R.sh[48*A+3*(c+1)+x]=ne(m[b[A]+x],o.shN.lo[3*c+x],o.shN.hi[3*c+x],p)}return w.float=R,w}var St=`// Step 33a: every Gaussian's center as a one-pixel point with its base color (SH coefficient 0), as the C++ viewer's
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
`;var Pt=`// Step 33b: stochastic splats, ported from the C++ viewer (shaders/splats.metal: splatPreprocess, splatQuadVertex,
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
`;var At=`// The Gaussians' scales, rotations and SH as float32 (main.ts prepends this or attributes_quantized.wgsl to
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
`;var Mt=`// Step 33h: the Gaussians' scales, rotations and SH quantized, decoded here, as the C++ viewer's --quantized
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
`;var Tt=`// Step 33e: accumulation while the camera is still, as the C++ viewer's msaa-temporal mode (step 27g; StillAccumulator
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
`;var lr=.28209479177387814,cr=document.getElementById("status"),le=r=>{cr.textContent=r};function ur(r,t){let l=new Array(16).fill(0);for(let i=0;i<4;++i)for(let e=0;e<4;++e)for(let s=0;s<4;++s)l[4*i+e]+=r[4*s+e]*t[4*i+s];return l}function pr(r){let t=Array.from({length:4},(i,e)=>[0,1,2,3].map(s=>r[4*s+e]).concat([0,1,2,3].map(s=>s===e?1:0)));for(let i=0;i<4;++i){let e=i;for(let f=i+1;f<4;++f)Math.abs(t[f][i])>Math.abs(t[e][i])&&(e=f);[t[i],t[e]]=[t[e],t[i]];let s=t[i][i];for(let f=0;f<8;++f)t[i][f]/=s;for(let f=0;f<4;++f)if(f!==i){let n=t[f][i];for(let o=0;o<8;++o)t[f][o]-=n*t[i][o]}}let l=new Array(16);for(let i=0;i<4;++i)for(let e=0;e<4;++e)l[4*i+e]=t[e][4+i];return l}async function fr(){let r=new URLSearchParams(location.search);if(!navigator.gpu)throw new Error("WebGPU is not available in this browser");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("no WebGPU adapter");let l=navigator.userAgent.includes("Firefox"),i=t.features.has("timestamp-query")&&!l,e=await t.requestDevice({requiredFeatures:i?["timestamp-query"]:[],requiredLimits:{maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize}}),s=document.getElementById("view"),f=s.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat();f.configure({device:e,format:n,alphaMode:"opaque"});let o=r.get("model")??"../out/step32a/kitchen",h=performance.now(),b=r.get("float")!=="1",S=await zt(e,o,le,b),v=await $e(`${o}/cameras.json`),P=r.get("path")?await $e(r.get("path")):null,ce=(performance.now()-h)/1e3,q=a=>a.reduce((u,d)=>u+d,0),F=S.float,w=S.quantized,ue=`checksums: positions ${q(S.positions).toFixed(3)}, `+(F?`log-scales ${q(F.logScales).toFixed(3)}, SH ${q(F.sh).toFixed(3)}, `:"")+`opacity ${q(S.opacities).toFixed(3)}`;console.log(ue);let T=S.count,k=new Float32Array(4*T),W=new Float32Array(4*T);for(let a=0;a<T;++a){for(let u=0;u<3;++u){k[4*a+u]=S.positions[3*a+u];let d=F?F.sh[48*a+u]:w.shRange[u]+w.shRange[48+u]*w.shBytes[48*a+u];W[4*a+u]=Math.max(0,.5+lr*d)}k[4*a+3]=S.opacities[a]}let O=S.mip?S.meta.mip_area?2:1:0,G=(a,u)=>{let d=e.createBuffer({size:a.byteLength,usage:u|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(d,0,a),d},C=GPUBufferUsage.STORAGE,R=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,c=G(k,C),p=G(W,C),m,A,x,L=null;if(w)m=G(w.scaleWords,C),A=G(w.rotationWords,C),x=G(w.shBytes,C),L=G(w.shRange,C);else{let a=F,u=new Float32Array(4*T),d=new Float32Array(4*T);for(let y=0;y<T;++y){let z=0;for(let M=0;M<4;++M)z+=a.rotations[4*y+M]**2;z=Math.sqrt(z)||1;for(let M=0;M<4;++M)d[4*y+M]=a.rotations[4*y+M]/z;for(let M=0;M<3;++M)u[4*y+M]=Math.exp(a.logScales[3*y+M]),a.filter3D&&(u[4*y+M]=Math.hypot(u[4*y+M],a.filter3D[y]));a.filter3D&&(u[4*y+3]=a.filter3D[y])}m=G(u,C),A=G(d,C),x=G(a.sh,C)}let _t=[c,m,A,x].reduce((a,u)=>a+u.size,0),Ee=e.createBuffer({size:64*T,usage:C}),Pe=G(new Uint32Array([4,0,0,0]),C|GPUBufferUsage.INDIRECT),Ae=e.createBuffer({size:224,usage:R}),He=e.createBuffer({size:64,usage:R}),We=e.createBuffer({size:144,usage:R}),Me=await fetch("../assets/stbn/stbn_scalar_128x128x64.r8").then(a=>a.ok?a.arrayBuffer():null,()=>null),ae=Me!==null&&Me.byteLength===16384*64,pe=ae?[128,128,64]:[1,1,1],Ne=e.createTexture({size:pe,dimension:"3d",format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:Ne},ae?Me:new Uint8Array(1),{bytesPerRow:pe[0],rowsPerImage:pe[1]},pe);let Ie=e.createBuffer({size:16,usage:R}),U=r.get("msaa")==="1"?1:4,Q="rgba16float",Ye=e.createShaderModule({code:St}),Qe=e.createRenderPipeline({layout:"auto",vertex:{module:Ye,entryPoint:"pointVertex"},fragment:{module:Ye,entryPoint:"pointFragment",targets:[{format:Q}]},primitive:{topology:"point-list"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"always"},multisample:{count:U}}),Bt=e.createBindGroup({layout:Qe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:He}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:p}}]}),Te=e.createShaderModule({code:(w?Mt:At)+Pt}),Je=e.createComputePipeline({layout:"auto",compute:{module:Te,entryPoint:"preprocess"}}),qt=e.createBindGroup({layout:Je.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:m}},{binding:3,resource:{buffer:A}},{binding:4,resource:{buffer:x}},{binding:5,resource:{buffer:Ee}},{binding:6,resource:{buffer:Pe}},...L?[{binding:8,resource:{buffer:L}}]:[]]}),Xe=e.createRenderPipeline({layout:"auto",vertex:{module:Te,entryPoint:"quadVertex"},fragment:{module:Te,entryPoint:U===4?"stochasticMsaaFragment":"stochasticFragment",targets:[{format:Q}]},primitive:{topology:"triangle-strip"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:U}}),Gt=e.createBindGroup({layout:Xe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ae}},{binding:5,resource:{buffer:Ee}},{binding:7,resource:Ne.createView()}]}),Rt=U===4?`@group(0) @binding(3) var currentDepth: texture_depth_multisampled_2d;
       fn nearestDepth(p: vec2u) -> f32 {
         return min(min(textureLoad(currentDepth, p, 0), textureLoad(currentDepth, p, 1)),
                    min(textureLoad(currentDepth, p, 2), textureLoad(currentDepth, p, 3)));
       }
`:`@group(0) @binding(3) var currentDepth: texture_depth_2d;
       fn nearestDepth(p: vec2u) -> f32 { return textureLoad(currentDepth, p, 0); }
`,Ke=e.createShaderModule({code:Rt+Ct}),Ze=e.createRenderPipeline({layout:"auto",vertex:{module:Ke,entryPoint:"presentVertex"},fragment:{module:Ke,entryPoint:"temporalFragment",targets:[{format:n},{format:Q}]},primitive:{topology:"triangle-list"}}),Ft=e.createSampler({magFilter:"linear",minFilter:"linear"}),et=e.createShaderModule({code:Tt}),Ce=GPUShaderStage.FRAGMENT,tt=e.createBindGroupLayout({entries:[{binding:0,visibility:Ce,buffer:{type:"uniform"}},{binding:1,visibility:Ce,texture:{sampleType:"unfilterable-float"}},{binding:2,visibility:Ce,texture:{sampleType:"unfilterable-float"}}]}),Ut=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[tt]}),vertex:{module:et,entryPoint:"presentVertex"},fragment:{module:et,entryPoint:"accumulateFragment",targets:[{format:n},{format:"rgba32float"}]},primitive:{topology:"triangle-list"}}),Vt=4,Dt=1024,{pivot:rt,up:kt}=vt(v),D=Number(r.get("camera")??0)%v.length,_=Y.fromDataset(P?P[0]:v[D]),_e=r.get("mode"),j=_e==="points",$=_e!=="stochastic"&&_e!=="splats",Ot=Number(r.get("history")??.7),J=ae&&r.get("noise")!=="white",at=r.get("seed"),X=!1,Be=0,it="",N=0,qe=!1,Ge=0,Re=0;s.addEventListener("pointerdown",a=>{qe=!0,Ge=a.clientX,Re=a.clientY}),window.addEventListener("pointerup",()=>{qe=!1}),window.addEventListener("pointermove",a=>{qe&&(_.orbit(rt,kt,-(a.clientX-Ge)*.005,-(a.clientY-Re)*.005),Ge=a.clientX,Re=a.clientY)}),s.addEventListener("wheel",a=>{a.preventDefault(),_.zoom(rt,Math.exp(a.deltaY*.001))},{passive:!1}),window.addEventListener("keydown",a=>{a.key==="ArrowRight"||a.key==="ArrowLeft"?(D=(D+(a.key==="ArrowRight"?1:v.length-1))%v.length,_=Y.fromDataset(v[D]),X=!1):a.key==="p"||a.key==="P"?(j=!j,X=!1):(a.key==="b"||a.key==="B")&&ae?J=!J:(a.key==="t"||a.key==="T")&&($=!$,X=!1)});let Lt=[0,1,2].map(a=>v.reduce((u,d)=>u+d.position[a],0)/v.length),st=v.reduce((a,u)=>a+Math.hypot(...u.position.map((d,y)=>d-Lt[y])),0)/v.length,ot=0,nt=0,fe=null,me,K,ie=[],de=[],lt=[],he=0,Fe=0,jt=(a,u)=>{for(let z of[fe,me,K,...ie,...de])z?.destroy();let d=GPUTextureUsage.RENDER_ATTACHMENT,y=GPUTextureUsage.TEXTURE_BINDING;fe=U===1?null:e.createTexture({size:[a,u],format:Q,sampleCount:U,usage:d}),me=e.createTexture({size:[a,u],format:"depth32float",sampleCount:U,usage:d|y}),K=e.createTexture({size:[a,u],format:Q,usage:d|y}),ie=[0,1].map(()=>e.createTexture({size:[a,u],format:Q,usage:d|y})),de=[0,1].map(()=>e.createTexture({size:[a,u],format:"rgba32float",usage:d|y})),lt=[0,1].map(z=>e.createBindGroup({layout:Ze.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:We}},{binding:1,resource:K.createView()},{binding:2,resource:ie[z^1].createView()},{binding:3,resource:me.createView()},{binding:4,resource:Ft}]})),ot=a,nt=u,X=!1},I=Number(r.get("bench")??0),$t=r.get("fullres")==="1",ct=(r.get("size")??"").split("x").map(Number),Z=ct[0]||1600,se=ct[1]||Math.round(Z*v[D].height/v[D].width),Ue=I>0?e.createTexture({size:[Z,se],format:n,usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,ut=[],ge=0,pt=performance.now(),ye=0,ft=[],Et=()=>({querySet:e.createQuerySet({type:"timestamp",count:2}),resolve:e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),readback:e.createBuffer({size:16,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})}),mt=i?e.createTexture({size:[1,1],format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT}):null,Ve=0,xe=0,De=0,ke=()=>{let a=ge;P&&(_=Y.fromDataset(P[Math.min(a,P.length-1)])),Ue&&(_=Y.fromDataset(v[D]),a&1&&(_.position[0]+=1e-4));let u,d;if(Ue)u=Z,d=se;else{let g=$t&&window.devicePixelRatio||1;u=Math.max(1,Math.round(s.clientWidth*g)),d=Math.max(1,Math.round(s.clientHeight*g)),(u!==s.width||d!==s.height)&&(s.width=u,s.height=d)}(u!==ot||d!==nt)&&jt(u,d);let y=(Ue??f.getCurrentTexture()).createView(),z=_.projection(u,d,.0025*st,250*st),M=_.view(),be=ur(z,M),Oe=u/_.width,ht=d/_.height,Wt=_.fx*Oe,Nt=Math.abs(Oe/ht-1)<.01?_.fy*ht:_.fy*Oe,gt=[...M,u,d,j?1:0,$?1:0,J?1:0].join(","),It=gt!==it;it=gt;let ee=$&&!j&&!It;ee||(N=0);let yt=ee&&N===0?ie[he^1]:null;yt&&(N=Math.min(Be,Vt));let xt=!ee||N<Dt,Yt=ee?1+N:at!==null?Number(at):a+1,E=e.createCommandEncoder(),te={r:0,g:0,b:0,a:1},V=i?ft.pop()??Et():null,ve=V?.querySet;ve&&mt&&E.beginRenderPass({colorAttachments:[{view:mt.createView(),loadOp:"clear",storeOp:"store"}],timestampWrites:{querySet:ve,endOfPassWriteIndex:0}}).end();let bt=g=>ve&&g?{querySet:ve,endOfPassWriteIndex:1}:void 0;if(xt){if(j)e.queue.writeBuffer(He,0,new Float32Array(be));else{let B=new ArrayBuffer(224),H=new Float32Array(B),re=new Uint32Array(B);H.set(M,0),H.set(z,16),H.set([..._.position,1],32),H.set([u,d,Wt,Nt],36),re.set([T,S.meta.sh_degree,Yt,J?1:0,O],40),w&&(H.set(w.scaleLo,48),H.set(w.scaleStep,52)),e.queue.writeBuffer(Ae,0,B),e.queue.writeBuffer(Pe,0,new Uint32Array([4,0,0,0]));let we=E.beginComputePass();we.setPipeline(Je),we.setBindGroup(0,qt),we.dispatchWorkgroups(Math.ceil(T/256)),we.end()}let g=E.beginRenderPass({colorAttachments:[fe?{view:fe.createView(),resolveTarget:K.createView(),loadOp:"clear",storeOp:"discard",clearValue:te}:{view:K.createView(),loadOp:"clear",storeOp:"store",clearValue:te}],depthStencilAttachment:{view:me.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});j?(g.setPipeline(Qe),g.setBindGroup(0,Bt),g.draw(T)):(g.setPipeline(Xe),g.setBindGroup(0,Gt),g.drawIndirect(Pe,0)),g.end()}if(ee){e.queue.writeBuffer(Ie,0,new Float32Array([xt?1/++N:0,0,0,0]));let g=e.createBindGroup({layout:tt,entries:[{binding:0,resource:{buffer:Ie}},{binding:1,resource:K.createView()},{binding:2,resource:(yt??de[Fe^1]).createView()}]}),B=E.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:te},{view:de[Fe].createView(),loadOp:"clear",storeOp:"store",clearValue:te}],timestampWrites:bt(!0)});B.setPipeline(Ut),B.setBindGroup(0,g),B.draw(3),B.end(),Fe^=1}else{let g=$&&!j&&X,B=new Float32Array(36),H=new Uint32Array(B.buffer);B.set(pr(be),0),B.set(g?ut:be,16),H[32]=g?1:0,B[33]=Ot,e.queue.writeBuffer(We,0,B);let re=E.beginRenderPass({colorAttachments:[{view:y,loadOp:"clear",storeOp:"store",clearValue:te},{view:ie[he].createView(),loadOp:"clear",storeOp:"store",clearValue:te}],timestampWrites:bt(!0)});re.setPipeline(Ze),re.setBindGroup(0,lt[he]),re.draw(3),re.end(),Be=g?Be+1:1,he^=1,ut=be,X=!0}if(V&&(E.resolveQuerySet(V.querySet,0,2,V.resolve,0),E.copyBufferToBuffer(V.resolve,0,V.readback,0,16)),e.queue.submit([E.finish()]),V&&V.readback.mapAsync(GPUMapMode.READ).then(()=>{let g=new BigUint64Array(V.readback.getMappedRange());g[1]>g[0]&&(Ve+=Number(g[1]-g[0])/1e6,++xe),V.readback.unmap(),ft.push(V),xe===30&&(De=Ve/xe,Ve=0,xe=0)}),++ge%30===0){let g=performance.now();ye=3e4/(g-pt),pt=g}let Qt=`${ye.toFixed(0)} fps (${ye>0?(1e3/ye).toFixed(1):"-"} ms per frame`+(i?`, GPU ${De>0?De.toFixed(2):"-"} ms`:`, GPU time unavailable${l?" in Firefox":""}`)+")",Jt=j?"points":`stochastic splats, ${U} sample${U>1?"s":""} per pixel, ${J?"blue":"white"} noise`+(ee?`, still: ${N} frames averaged`:$?", temporal reuse":""),Xt=["",", Mip-Splatting",", Mip-Splatting (area)"][O],Kt=`${(_t/1e6).toFixed(0)} MB on the GPU, ${w?"quantized":"float"}`;le(`${T.toLocaleString()} Gaussians${Xt} (${Jt}; ${Kt}), loaded in ${ce.toFixed(1)} s from ${o}
`+(P?`path frame ${Math.min(a,P.length-1)+1} / ${P.length}`:`camera ${D} (${v[D].name})`)+`, ${u} x ${d}, ${Qt}
drag: orbit, wheel: zoom, left/right: dataset cameras, P: points, T: temporal reuse, B: blue / white noise
`+(ae?"":`blue noise unavailable (assets/stbn missing)
`)+ue)},dt=()=>{if(ke(),P&&ge===P.length){window.__ready=!0;return}!P&&ge===2&&(window.__ready=!0),requestAnimationFrame(dt)};I>0?await Ht():requestAnimationFrame(dt);async function Ht(){le(`benchmark: ${I} frames at ${Z} x ${se}...`),await new Promise(z=>setTimeout(z,500));for(let z=0;z<5;++z)ke();await e.queue.onSubmittedWorkDone();let a=performance.now();for(let z=0;z<I;++z)ke();await e.queue.onSubmittedWorkDone();let u=(performance.now()-a)/I,d={model:o,msaa:U,quantized:!!w,blueNoise:J,temporal:$,width:Z,height:se,frames:I,ms:u,gaussians:T,userAgent:navigator.userAgent};window.__bench=d,le(`benchmark: ${I} frames at ${Z} x ${se}, ${U}x MSAA${$?" + temporal":""}, ${w?"quantized":"float"}: ${u.toFixed(2)} ms/frame (${(1e3/u).toFixed(0)} fps)
${o}`),window.__ready=!0;let y=r.get("report");if(y){let z=await(await fetch(y,{method:"POST",body:JSON.stringify(d)})).text();z.trim()&&(location.href=z.trim())}}}fr().catch(r=>{le(`error: ${r.message??r}`),console.error(r)});
