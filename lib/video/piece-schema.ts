import {z} from 'zod';
const point=z.object({x:z.number().min(0).max(100),y:z.number().min(0).max(100)});
export const polygonSchema=z.array(point).min(3).max(40);
export const holeSchema=z.object({id:z.string().min(1).max(100),polygon:polygonSchema,fill:z.enum(['transparent','color','clone']),color:z.string().regex(/^#[0-9a-fA-F]{6}$/),dx:z.number().min(-100).max(100),dy:z.number().min(-100).max(100)});
export const rasterEditsSchema=z.object({isolate:polygonSchema.optional(),holes:z.array(holeSchema).max(24),strokes:z.array(z.object({points:z.array(point).min(1).max(200),width:z.number().min(.1).max(10),color:z.string().regex(/^#[0-9a-fA-F]{6}$/),mode:z.enum(['paint','erase','restore'])})).max(40)});
export type RasterEdits=z.infer<typeof rasterEditsSchema>;
export type Hole=z.infer<typeof holeSchema>;
