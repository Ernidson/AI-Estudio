import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {episodeAssets,episodeEntry,episodeIdentity} from '../../../../lib/video/episode-assets';
import {records,videoAssets} from '../../../../db/schema';
import {eq} from 'drizzle-orm';
import {z} from 'zod';
import {matchesMediaSignature} from '../../../../lib/video/upload';
import {MAX_FILE_BYTES} from '../../../../lib/video/model';
export const dynamic='force-dynamic';
const allowed:Record<string,'image'|'video'|'audio'>={'image/png':'image','image/jpeg':'image','image/webp':'image','image/gif':'image','video/mp4':'video','video/webm':'video','audio/mpeg':'audio','audio/mp3':'audio','audio/wav':'audio','audio/x-wav':'audio','audio/ogg':'audio','audio/mp4':'audio','audio/x-m4a':'audio','audio/aac':'audio','audio/webm':'audio'};
const metaSchema=z.object({name:z.string().trim().min(1).max(160),category:z.enum(['character','pose','scenery','image','object','gameplay','audio']),group:z.string().max(80).default(''),duration:z.coerce.number().min(0).max(3600).default(0),width:z.coerce.number().int().min(0).max(8192).default(0),height:z.coerce.number().int().min(0).max(8192).default(0)});
export async function POST(request:Request){
 const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});
 let key:string|undefined;
 try{if(!env.BUCKET)return Response.json({error:'O armazenamento de ficheiros ainda não está disponível.'},{status:503});
 const mime=(request.headers.get('Content-Type')||'').split(';')[0],type=allowed[mime];if(!type)return Response.json({error:'Formato não suportado. Use PNG, JPEG, WebP, GIF, MP4, WebM, MP3, WAV, OGG ou M4A.'},{status:415});
 const parsed=metaSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));if(!parsed.success)return Response.json({error:'Dados do ficheiro inválidos.'},{status:400});const meta=parsed.data;
 if(type==='image'&&(meta.width<1||meta.height<1||meta.width>4096||meta.height>4096))return Response.json({error:'Imagens: máximo 4096 × 4096.'},{status:400});if(type==='video'&&(meta.width<1||meta.height<1||meta.width>1920||meta.height>1920||meta.width*meta.height>1920*1080))return Response.json({error:'Vídeo: máximo Full HD.'},{status:400});
 if((type==='image'&&!['character','pose','scenery','image','object'].includes(meta.category))||(type==='video'&&meta.category!=='gameplay')||(type==='audio'&&meta.category!=='audio')||(type!=='image'&&meta.duration<=0))return Response.json({error:'Categoria ou duração incompatível.'},{status:400});
 if(Number(request.headers.get('Content-Length'))>MAX_FILE_BYTES)return Response.json({error:'Limite de 24 MiB por ficheiro.'},{status:413});
 const existing=await getDb().select().from(videoAssets).where(eq(videoAssets.owner,u.userId));
 const reader=request.body?.getReader();if(!reader)return Response.json({error:'Ficheiro vazio.'},{status:400});const chunks:Uint8Array[]=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_FILE_BYTES){await reader.cancel();return Response.json({error:'Limite de 24 MiB por ficheiro.'},{status:413})}chunks.push(value)}
 if(!size)return Response.json({error:'Ficheiro vazio.'},{status:400});
 const bytes=new Uint8Array(size);let cursor=0;for(const chunk of chunks){bytes.set(chunk,cursor);cursor+=chunk.length}chunks.length=0;
 if(!matchesMediaSignature(mime,bytes))return Response.json({error:'O conteúdo do ficheiro não corresponde ao formato indicado.'},{status:415});
 const entryId=new URL(request.url).searchParams.get('episodeAsset'),entry=entryId?episodeEntry(entryId):undefined;if(entryId&&!entry)return Response.json({error:'Recurso EP01 desconhecido.'},{status:400});
 let episode:typeof episodeAssets[number]['episode'];let characterSource:{package:string;sourceName:string;hash:string;status:string}|undefined;let id=crypto.randomUUID();const params=new URL(request.url).searchParams;const claimedHash=params.get('characterHash');if(claimedHash&&!entry){if(!/^[a-f0-9]{64}$/.test(claimedHash)||mime!=='image/png')return Response.json({error:'Hash de personagem inválido.'},{status:400});const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');if(hash!==claimedHash)return Response.json({error:'O hash não corresponde ao original.'},{status:400});const sourceName=(params.get('characterSource')||meta.name).slice(0,160);id=await episodeIdentity(u.userId,'character:'+sourceName,hash);characterSource={package:'character-v1',sourceName,hash,status:'prototipo'};const old=existing.find(a=>a.id===id);if(old){const {owner,key,createdAt,...asset}=old;return Response.json({asset:{...asset,characterSource,url:`/api/video/assets/${id}`},deduplicated:true})}}
 if(entry){const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');if(digest!==entry.sha256||meta.width!==entry.width||meta.height!==entry.height||mime!=='image/png')return Response.json({error:'Hash ou dimensões não correspondem ao original EP01.'},{status:400});id=await episodeIdentity(u.userId,entry.id,digest);episode=episodeAssets.find(a=>a.id==='ep01-'+entry.id)!.episode;const old=existing.find(a=>a.id===id);if(old){const {owner,key,createdAt,...asset}=old;return Response.json({asset:{...asset,episode,characterSource,url:`/api/video/assets/${id}`},deduplicated:true});}}
 if(size+existing.reduce((n,a)=>n+a.size,0)>500*1024*1024)return Response.json({error:'O ficheiro excede o espaço disponível (500 MiB).'}, {status:413});
 key=`video/${encodeURIComponent(u.userId)}/${id}/${crypto.randomUUID()}`;await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:mime}});
 const row={id,owner:u.userId,...meta,type,mime,size,key,createdAt:new Date().toISOString()};const db=getDb();if(episode||characterSource)await db.batch([db.insert(videoAssets).values(row),db.insert(records).values({id,owner:u.userId,kind:'video-asset-meta',data:JSON.stringify(episode||characterSource),revision:1,updatedAt:row.createdAt})]);else await db.insert(videoAssets).values(row);
 const {owner,createdAt,key:storageKey,...asset}=row;void owner;void createdAt;void storageKey;
 return Response.json({asset:{...asset,episode,characterSource,url:`/api/video/assets/${id}`}},{status:201});
 }catch{if(key&&env.BUCKET)await env.BUCKET.delete(key).catch(()=>{});return Response.json({error:'Não foi possível importar o ficheiro. Tente novamente.'},{status:500})}
}
