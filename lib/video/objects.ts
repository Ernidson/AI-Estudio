import {z} from 'zod';
import {transformSchema,clipSchema} from './model';
export const objectSchema=z.object({assetId:z.string().min(1).max(100),width:z.number().min(2).max(200),transform:transformSchema,flip:z.boolean(),anchors:clipSchema.shape.anchors,pivot:clipSchema.shape.pivot,backgroundRemoval:clipSchema.shape.backgroundRemoval,rasterEdits:clipSchema.shape.rasterEdits});
export type SceneObject=z.infer<typeof objectSchema>;
export type PreparedObject={id:string;title:string;object:SceneObject;updatedAt:string};
