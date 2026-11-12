import ts from 'typescript';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
const root=process.cwd(),nativeRequire=createRequire(import.meta.url),cache=new Map();
let user={userId:'alice'},tables={prepared_objects:[],prepared_characters:[],video_projects:[],video_assets:[],studio_records:[]};
const table=(name,columns)=>Object.fromEntries([['__table',name],...columns.map(c=>[c,c])]);
const schema={preparedObjects:table('prepared_objects',['id','owner','title','data','updatedAt']),preparedCharacters:table('prepared_characters',['id','owner','title','data','revision','updatedAt']),records:table('studio_records',['id','owner','kind','data']),videoProjects:table('video_projects',['id','owner','title','data','revision','updatedAt']),videoAssets:table('video_assets',['id','owner','name','type','category','mime','size','duration','width','height','group','key','createdAt'])};
const eq=(key,value)=>r=>r[key]===value,and=(...checks)=>r=>checks.every(c=>c(r));
const db={batch:async queries=>Promise.all(queries),select:fields=>({from:t=>({where:async check=>tables[t.__table].filter(check).map(r=>fields?Object.fromEntries(Object.entries(fields).map(([k,col])=>[k,r[col]])):{...r})})}),insert:t=>({values:async row=>{if(tables[t.__table].some(r=>r.id===row.id))throw Error('duplicate');tables[t.__table].push(structuredClone(row))}}),update:t=>({set:patch=>({where:check=>({returning:async()=>{const matches=tables[t.__table].filter(check);matches.forEach(r=>Object.assign(r,patch));return matches.map(r=>({...r}))}})})}),delete:t=>({where:async check=>{tables[t.__table]=tables[t.__table].filter(r=>!check(r))}})};
const blobs=new Map();const bucket={put:async(key,bytes)=>blobs.set(key,new Uint8Array(bytes)),delete:async key=>blobs.delete(key),get:async(key,options)=>{const bytes=blobs.get(key);if(!bytes)return null;const b=options?.range?bytes.slice(options.range.offset,options.range.offset+options.range.length):bytes;return{body:new ReadableStream({start(c){c.enqueue(b);c.close()}})}}};
function load(name){const filename=path.resolve(root,name);if(cache.has(filename))return cache.get(filename);const exports={};cache.set(filename,exports);const source=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const req=p=>{if(p==='cloudflare:workers')return{env:{BUCKET:bucket}};if(p==='drizzle-orm')return{eq,and};if(p.startsWith('.')){let resolved=path.resolve(path.dirname(filename),p);if(resolved===path.join(root,'db'))return{getDb:()=>db};if(resolved===path.join(root,'db/schema'))return schema;if(resolved.endsWith('/app/chatgpt-auth'))return{getChatGPTUser:async()=>user};if(resolved.endsWith('.json'))return{default:JSON.parse(readFileSync(resolved,'utf8'))};resolved+=existsSync(resolved+'.ts')?'.ts':existsSync(resolved+'.tsx')?'.tsx':'/index.ts';return load(resolved)}return nativeRequire(p)};
 vm.runInNewContext(source.replaceAll('import.meta.url',JSON.stringify('file://'+filename)),{exports,require:req,TextEncoder,Response,Request,Date,JSON,console,URL,URLSearchParams,Uint8Array,ReadableStream,crypto:globalThis.crypto,structuredClone,Set,Object,Number,Math},{filename});return exports;
}
export {load};
export function setTestUser(value){user=value;}
const model=load('lib/video/model.ts'),range=load('lib/video/range.ts'),route=load('app/api/video/route.ts'),upload=load('app/api/video/assets/route.ts'),assetRoute=load('app/api/video/assets/[id]/route.ts');
const req=(url,body,method='POST')=>new Request('https://test'+url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name)}
const near=(a,b)=>assert.ok(Math.abs(a-b)<.001,`${a} ≠ ${b}`);
const demo=model.demoDocument();test('30s demo validates, 2 characters, 6 tracks and asset references',()=>{assert.ok(model.documentSchema.safeParse(demo).success);assert.equal(demo.duration,30);assert.equal(demo.tracks.length,6);assert.equal(model.assetIds(demo).length,6)});
const ana=demo.tracks[2].clips[0];test('linear keyframe interpolation + pose switch',()=>{near(model.evaluate(ana,3.5).x,32.5);near(model.evaluate(ana,7).scale,1.12);assert.equal(model.poseAt(ana,7.99),'builtin-ana');assert.equal(model.poseAt(ana,8),'builtin-ana-wave')});
test('split preserves animation before and after the cut',()=>{const [a,b]=model.splitClip(ana,4);near(a.duration,3);near(b.start,4);for(const t of [0,1,2.9])near(model.evaluate(a,t).x,model.evaluate(ana,t).x);for(const t of [0,1,5])near(model.evaluate(b,t).x,model.evaluate(ana,t+3).x);assert.equal(model.poseAt(b,5),'builtin-ana-wave');assert.equal(model.splitClip(ana,1),null)});
test('trim preserves interpolated endpoints',()=>{const c=model.trimClip(ana,1,3);near(model.evaluate(c,2).scale,model.evaluate(ana,2).scale);near(model.evaluate(c,3).x,model.evaluate(ana,3).x)});
test('invalid timings and wrong track types rejected',()=>{const d=structuredClone(demo);d.tracks[0].clips[0].duration=31;assert.ok(!model.documentSchema.safeParse(d).success);d.tracks[0].clips[0].duration=30;d.tracks[0].type='video';assert.ok(!model.documentSchema.safeParse(d).success)});
test('script structure imports text and retains scene descriptions',()=>{const d=model.applyScript(model.emptyDocument(),{version:1,title:'Guião',scenes:[{start:1,duration:3,text:'Texto',narration:'Voz',visualDescription:'Cenário'}]});assert.equal(d.script.scenes[0].narration,'Voz');assert.equal(d.tracks.at(-1).clips[0].text,'Texto');assert.throws(()=>model.applyScript(d,{version:1,title:'Bad',scenes:[{start:299,duration:2}]}))});
test('HTTP media ranges: normal, suffix, invalid and out-of-bounds',()=>{assert.equal(JSON.stringify(range.parseRange('bytes=2-5',10)),JSON.stringify({offset:2,length:4}));assert.equal(JSON.stringify(range.parseRange('bytes=-3',10)),JSON.stringify({offset:7,length:3}));assert.equal(range.parseRange('bytes=10-',10),'invalid');assert.equal(range.parseRange('bytes=1-2,4-5',10),'invalid');assert.equal(range.parseRange('bytes=-0',10),'invalid')});
const projectId=randomUUID();user=null;assert.equal((await route.GET(new Request('https://test/api/video'))).status,401);assert.equal((await route.POST(req('/api/video',{}))).status,401);assert.equal((await upload.POST(new Request('https://test/api/video/assets',{method:'POST'}))).status,401);checks++;
user={userId:'alice'};let result=await route.POST(req('/api/video',{id:projectId,title:'Teste 30s',data:demo}));assert.equal(result.status,201);let saved=(await result.json()).project;assert.equal(saved.revision,1);
let reloaded=await (await route.GET(new Request('https://test/api/video?id='+projectId))).json();assert.deepEqual(JSON.parse(JSON.stringify(reloaded.project.data)),JSON.parse(JSON.stringify(demo)));console.log('PASS save, reload and resume 30s project');checks++;
result=await route.POST(req('/api/video',{id:projectId,title:'Mudança',data:demo,revision:1}));assert.equal(result.status,200);assert.equal((await result.json()).project.revision,2);
assert.equal((await route.POST(req('/api/video',{id:projectId,title:'Stale',data:demo,revision:1}))).status,409);checks++;
user={userId:'bob'};assert.equal((await route.GET(new Request('https://test/api/video?id='+projectId))).status,404);assert.equal((await route.POST(req('/api/video',{id:projectId,title:'Intrusão',revision:2,data:demo}))).status,403);assert.equal((await (await route.GET(new Request('https://test/api/video'))).json()).projects.length,0);checks++;
user={userId:'alice'};const wav=readFileSync('public/video-demo/chime.wav');result=await upload.POST(new Request('https://test/api/video/assets?name=Efeito&category=audio&duration=3',{method:'POST',headers:{'Content-Type':'audio/wav'},body:wav}));assert.equal(result.status,201);const asset=(await result.json()).asset;assert.equal(asset.name,'Efeito');assert.ok(blobs.size===1);checks++;
let served=await assetRoute.GET(new Request('https://test'+asset.url,{headers:{Range:'bytes=0-15'}}),{params:Promise.resolve({id:asset.id})});assert.equal(served.status,206);assert.equal(served.headers.get('Content-Range'),`bytes 0-15/${wav.length}`);assert.equal(Buffer.from(await served.arrayBuffer()).toString(),wav.subarray(0,16).toString());checks++;
user={userId:'bob'};assert.equal((await assetRoute.GET(new Request('https://test'+asset.url),{params:Promise.resolve({id:asset.id})})).status,404);checks++;
user={userId:'alice'};const d=structuredClone(demo);d.tracks[5].clips[0].assetId=asset.id;result=await route.POST(req('/api/video',{id:projectId,title:'Com áudio',revision:2,data:d}));assert.equal(result.status,200);assert.equal((await assetRoute.DELETE(new Request('https://test'+asset.url,{method:'DELETE'}),{params:Promise.resolve({id:asset.id})})).status,409);checks++;
const invalid=structuredClone(demo);invalid.tracks[0].clips[0].assetId='foreign-asset';assert.equal((await route.POST(req('/api/video',{id:projectId,title:'Inválido',revision:3,data:invalid}))).status,400);checks++;
result=await upload.POST(new Request('https://test/api/video/assets?name=bad&category=audio&duration=3',{method:'POST',headers:{'Content-Type':'audio/wav'},body:'<html>invalid</html>'}));assert.equal(result.status,415);checks++;
assert.equal((await route.DELETE(req('/api/video',{id:projectId},'DELETE'))).status,200);assert.equal((await assetRoute.DELETE(new Request('https://test'+asset.url,{method:'DELETE'}),{params:Promise.resolve({id:asset.id})})).status,200);assert.equal(blobs.size,0);checks++;
console.log(`PASS ${checks} video test groups (model + authenticated API with simulated D1/R2).`);

// Skeletal regression: a legacy project still has no rig fields after round-trip.
assert.equal(reloaded.project.data.tracks[2].clips[0].rig,undefined);
const rigModel=load('lib/video/rig.ts'),rigRoute=load('app/api/video/rigs/route.ts');
const rigProject=model.articulatedDemoDocument(),rigId=randomUUID();
assert.ok(model.documentSchema.safeParse(rigProject).success);
let rigResponse=await route.POST(req('/api/video',{id:rigId,title:'Articulações · 3 poses',data:rigProject}));assert.equal(rigResponse.status,201);
// Simulate closing the client: only the server document is used to resume.
let resumed=await (await route.GET(new Request('https://test/api/video?id='+rigId))).json();
const resumedRig=resumed.project.data.tracks[2].clips[0].rig;
assert.equal(resumedRig.parts.length,16);assert.equal(resumedRig.joints.length,16);
for(const id of ['left-shoulder','left-elbow','head']){assert.equal(resumedRig.joints.find(j=>j.id===id).keys.length,3);for(const t of [0,1,2,3,4])near(rigModel.anglesAt(resumedRig,t)[id],rigModel.anglesAt(rigProject.tracks[2].clips[0].rig,t)[id]);}
console.log('PASS save/close/reopen restores all articulated parts, joints and three poses.');
const preparedId=randomUUID();rigResponse=await rigRoute.POST(req('/api/video/rigs',{id:preparedId,title:'Lia preparada',rig:resumedRig}));assert.equal(rigResponse.status,201);
const savedCharacter=(await rigResponse.json()).character;assert.equal(savedCharacter.rig.parts.length,16);
const characters=(await (await rigRoute.GET()).json()).characters;assert.equal(characters.length,1);assert.equal(characters[0].rig.sourceAssetId,'builtin-puppet');
user={userId:'bob'};assert.equal((await (await rigRoute.GET()).json()).characters.length,0);assert.equal((await rigRoute.POST(req('/api/video/rigs',{id:preparedId,title:'Intrusão',revision:1,rig:resumedRig}))).status,403);
user={userId:'alice'};assert.equal((await rigRoute.POST(req('/api/video/rigs',{id:preparedId,title:'Stale',revision:0,rig:resumedRig}))).status,400);
const invalidRig=structuredClone(resumedRig);invalidRig.joints[0].parentId=invalidRig.joints[1].id;assert.equal((await rigRoute.POST(req('/api/video/rigs',{id:randomUUID(),title:'Ciclo',rig:invalidRig}))).status,400);
const foreignRig=structuredClone(resumedRig);foreignRig.parts[0].assetId='foreign-image';assert.equal((await rigRoute.POST(req('/api/video/rigs',{id:randomUUID(),title:'Sem acesso',rig:foreignRig}))).status,400);
console.log('PASS reusable prepared character library and owner/reference/hierarchy validation.');
// A real uploaded image must not be deleted while referenced by a prepared character.
const imgUpload=new Request('https://test/api/video/assets?name=PNG&category=character&width=1&height=1',{method:'POST',headers:{'Content-Type':'image/png'},body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jTgAAAABJRU5ErkJggg==','base64')});
const imgResponse=await upload.POST(imgUpload);assert.equal(imgResponse.status,201);const uploadedImage=(await imgResponse.json()).asset;
const small=rigModel.emptyRig(uploadedImage);small.joints=[{id:'root',name:'Raiz',parentId:null,x:0,y:0,rotation:0,min:-180,max:180,keys:[]}];
const smallId=randomUUID();assert.equal((await rigRoute.POST(req('/api/video/rigs',{id:smallId,title:'PNG preparado',rig:small}))).status,201);
assert.equal((await assetRoute.DELETE(new Request('https://test'+uploadedImage.url,{method:'DELETE'}),{params:Promise.resolve({id:uploadedImage.id})})).status,409);
console.log('PASS prepared character prevents deletion of a referenced uploaded image.');
