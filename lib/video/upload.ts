// Lightweight signature checks; full codec support is verified by the browser.
export function matchesMediaSignature(mime:string,bytes:Uint8Array){
 const ascii=(from:number,to:number)=>String.fromCharCode(...bytes.slice(from,to));
 if(mime==='image/png')return bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
 if(mime==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(mime==='image/webp')return ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP';
 if(mime==='image/gif')return ['GIF87a','GIF89a'].includes(ascii(0,6));
 if(mime==='video/webm'||mime==='audio/webm')return [26,69,223,163].every((n,i)=>bytes[i]===n);
 if(['video/mp4','audio/mp4','audio/x-m4a'].includes(mime))return ascii(4,8)==='ftyp';
 if(['audio/wav','audio/x-wav'].includes(mime))return ascii(0,4)==='RIFF'&&ascii(8,12)==='WAVE';
 if(mime==='audio/ogg')return ascii(0,4)==='OggS';
 if(['audio/mpeg','audio/mp3','audio/aac'].includes(mime))return ascii(0,3)==='ID3'||(bytes[0]===255&&(bytes[1]&224)===224);
 return false;
}
