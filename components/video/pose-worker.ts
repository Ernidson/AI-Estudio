import {FilesetResolver,PoseLandmarker} from '@mediapipe/tasks-vision';
// The model and runtime are downloaded only on explicit request. No image is uploaded.
const wasm='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm';
const model='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
self.onmessage=async(event:MessageEvent<{bitmap:ImageBitmap}>)=>{
 let detector:PoseLandmarker|undefined;
 try{const files=await FilesetResolver.forVisionTasks(wasm);detector=await PoseLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:model,delegate:'CPU'},runningMode:'IMAGE',numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,outputSegmentationMasks:false});const result=detector.detect(event.data.bitmap);self.postMessage({landmarks:result.landmarks[0]||[]})}catch{self.postMessage({error:'O detetor local não ficou disponível. Verifique o acesso ao modelo/WASM ou use a preparação manual.'})}finally{event.data.bitmap.close();detector?.close()}
};
