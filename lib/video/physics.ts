import {z} from 'zod';
// Reserved persisted contract. Evaluation remains purely kinematic until a tested engine exists.
export const physicsSchema=z.object({version:z.literal(1),enabled:z.literal(false),gravity:z.literal(false),collisions:z.literal(false),bodyType:z.enum(['kinematic','dynamic']).default('kinematic')});
