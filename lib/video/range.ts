export function parseRange(header:string|null,size:number):{offset:number;length:number}|null|'invalid'{
 if(!header)return null;const m=/^bytes=(\d*)-(\d*)$/.exec(header);if(!m||(!m[1]&&!m[2]))return 'invalid';
 let start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2]));let end=m[1]?(m[2]?Number(m[2]):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start||(!m[1]&&Number(m[2])===0))return 'invalid';end=Math.min(end,size-1);return{offset:start,length:end-start+1};
}
