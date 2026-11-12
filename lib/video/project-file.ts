import {z} from 'zod';
import type {Asset} from './model';
import {documentSchema,assetIds} from './model';
import {vectorAssets} from './vector-kit';
export function readProjectFile(raw:string,assets:Asset[]){if(raw.length>2_000_000)throw Error('O projeto JSON excede 2 MB.');const file=z.object({version:z.literal(1),title:z.string().trim().min(1).max(160),data:documentSchema}).parse(JSON.parse(raw)),available=new Set([...assets,...vectorAssets(file.data.vectorKits||[])].map(a=>a.id)),missing=assetIds(file.data).filter(id=>!available.has(id));if(missing.length)throw Error('Recursos em falta nesta conta: '+missing.join(', ')+'. Importe os ficheiros originais na biblioteca antes de reabrir. Os URLs do JSON não são carregados por segurança.');return file}
