from PIL import Image,ImageDraw,ImageFilter
import numpy as np,json,os,shutil
from scipy.ndimage import label
from pathlib import Path
import sys
root=str(Path(__file__).resolve().parents[1])
source=sys.argv[1] if len(sys.argv)>1 else root+'/public/characters/clash-parts/reference.jpg'
out=root+'/public/characters/clash-parts';os.makedirs(out,exist_ok=True)
src=Image.open(source).convert('RGB')
if os.path.abspath(source)!=os.path.abspath(out+'/reference.jpg'):shutil.copy(source,out+'/reference.jpg')
# Explicit manual regions on the supplied sheet. No model-based segmentation.
regions={
'pekka-head':(4,419,169,542),'pekka-torso':(208,556,373,728),'pekka-hips':(187,728,390,880),
'pekka-shoulder':(373,551,492,665),'pekka-upper-arm':(496,579,567,692),'pekka-forearm':(494,700,564,820),'pekka-hand':(499,827,579,901),
'pekka-leg':(100,886,195,1001),'pekka-sword':(714,550,811,920),
'archer-head-scared':(1137,397,1273,549),'archer-head':(850,397,1006,549),'archer-torso':(1005,558,1128,682),'archer-skirt':(999,686,1145,772),
'archer-cape':(820,676,1022,869),'archer-hood':(839,557,1002,681),
'archer-arm':(1288,572,1341,679),'archer-hand':(1304,682,1359,733),
'archer-leg':(1022,783,1078,883),'archer-bow':(1153,683,1289,990),'archer-arrow':(1296,746,1347,946),'archer-quiver':(1438,744,1535,949),
}
polys={'archer-bow':[(1164,687),(1203,687),(1223,720),(1255,750),(1279,791),(1288,840),(1275,904),(1249,947),(1203,985),(1154,991),(1153,967),(1174,935),(1200,898),(1210,852),(1209,803),(1200,757),(1178,727),(1164,716)],'archer-cape':[(820,718),(870,677),(957,686),(986,730),(1021,855),(963,869),(903,853),(835,869)],'archer-arrow':[(1316,746),(1346,750),(1337,798),(1330,875),(1345,904),(1323,945),(1302,917),(1307,883),(1315,798),(1296,767)],'archer-quiver':[(1462,747),(1527,746),(1535,792),(1512,899),(1482,946),(1438,930),(1445,860),(1457,803)]}
metadata=[]
for name,box in regions.items():
 im=src.crop(box).convert('RGBA');ar=np.array(im);rgb=ar[:,:,:3];white=np.min(rgb,axis=2)>220
 lab,n=label(white);edge=np.unique(np.concatenate([lab[0,:],lab[-1,:],lab[:,0],lab[:,-1]]));bg=np.isin(lab,edge[edge>0]);ar[bg,3]=0
 if name=='archer-bow':ar[white,3]=0 # Manually remove the enclosed white field as well; gold highlights are retained.
 im=Image.fromarray(ar)
 if name in polys:
  mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon([(x-box[0],y-box[1]) for x,y in polys[name]],fill=255);im.putalpha(Image.fromarray(np.minimum(np.array(im.getchannel('A')),np.array(mask))))
 alpha=im.getchannel('A');bounds=alpha.getbbox();im=im.crop(bounds);im.save(out+'/'+name+'.png')
 metadata.append({'key':name,'width':im.width,'height':im.height})
with open(root+'/lib/video/clash-parts.json','w') as f:json.dump(metadata,f,indent=2)

# Extra manual subdivisions and mirror variants preserve source pixels and silhouettes.
for who in ['pekka','archer']:
 leg=Image.open(out+'/'+who+'-leg.png')
 for name,box in [('shin',(0,0,leg.width,int(leg.height*.76))),('foot',(0,int(leg.height*.59),leg.width,leg.height)),('thigh',(int(leg.width*.15),0,int(leg.width*.85),int(leg.height*.42)))]:
  leg.crop(box).save(out+'/'+who+'-'+name+'.png')
arm=Image.open(out+'/archer-arm.png')
arm.crop((0,0,arm.width,47)).save(out+'/archer-upper-arm.png')
arm.crop((0,36,arm.width,79)).save(out+'/archer-forearm.png')
# Skin extension under the Archer skirt, manually sampled from exposed arm, not generated anatomy.
Image.open(out+'/archer-arm.png').crop((10,5,35,35)).save(out+'/archer-thigh.png')
for key in ['pekka-shoulder','pekka-upper-arm','pekka-forearm','pekka-hand','pekka-thigh','pekka-shin','pekka-foot','archer-arm','archer-upper-arm','archer-forearm','archer-hand','archer-thigh','archer-shin','archer-foot']:
 im=Image.open(out+'/'+key+'.png');im.transpose(Image.Transpose.FLIP_LEFT_RIGHT).save(out+'/'+key+'-mirror.png')
# Rig-space manual layouts: name, asset, joint, x,y,w,h. Piece list order is back-to-front.
layouts={
'pekka':[
 ['Coxa esquerda','pekka-thigh','left-hip',135,397,55,100],['Coxa direita','pekka-thigh-mirror','right-hip',210,397,55,100],
 ['Perna esquerda','pekka-shin','left-knee',130,483,65,100],['Perna direita','pekka-shin-mirror','right-knee',205,483,65,100],
 ['Pé esquerdo','pekka-foot','left-ankle',123,558,75,45],['Pé direito','pekka-foot-mirror','right-ankle',202,558,75,45],
 ['Tronco completo','pekka-torso','torso',110,154,180,194],['Quadril','pekka-hips','hips',100,320,200,137],
 ['Braço esquerdo','pekka-upper-arm','left-shoulder',63,197,72,106],['Braço direito','pekka-upper-arm-mirror','right-shoulder',265,197,72,106],
 ['Ombreira esquerda','pekka-shoulder','left-shoulder',40,149,110,110],['Ombreira direita','pekka-shoulder-mirror','right-shoulder',250,149,110,110],
 ['Antebraço esquerdo','pekka-forearm','left-elbow',60,280,75,105],['Antebraço direito','pekka-forearm-mirror','right-elbow',265,280,75,105],
 ['Mão esquerda','pekka-hand','left-wrist',65,365,65,60],['Mão direita','pekka-hand-mirror','right-wrist',270,365,65,60],
 ['Capacete e cabeça','pekka-head','head',95,18,210,155]],
'archer':[
 ['Capa','archer-cape','torso',97,155,206,260],['Aljava','archer-quiver','torso',247,260,58,132],
 ['Coxa esquerda · extensão manual','archer-thigh','left-hip',150,337,47,100],['Coxa direita · extensão manual','archer-thigh-mirror','right-hip',203,337,47,100],
 ['Perna esquerda','archer-shin','left-knee',149,420,47,108],['Perna direita','archer-shin-mirror','right-knee',204,420,47,108],
 ['Pé esquerdo','archer-foot','left-ankle',140,505,64,45],['Pé direito','archer-foot-mirror','right-ankle',196,505,64,45],
 ['Tronco completo','archer-torso','torso',135,158,130,155],['Saia e quadril','archer-skirt','hips',127,293,146,91],
 ['Braço esquerdo','archer-upper-arm','left-shoulder',108,194,48,92],['Braço direito','archer-upper-arm-mirror','right-shoulder',244,194,48,92],
 ['Antebraço esquerdo','archer-forearm','left-elbow',99,266,45,89],['Antebraço direito','archer-forearm-mirror','right-elbow',256,266,45,89],
 ['Mão esquerda','archer-hand','left-wrist',94,344,50,41],['Mão direita','archer-hand-mirror','right-wrist',256,344,50,41],
 ['Cabeça e cabelo','archer-head','head',128,30,144,140]]}
joints={
'pekka':{'hips':[200,365],'torso':[200,235],'neck':[200,164],'head':[200,108],'left-shoulder':[100,190],'left-elbow':[98,285],'left-wrist':[98,387],'right-shoulder':[300,190],'right-elbow':[302,285],'right-wrist':[302,387],'left-hip':[163,405],'left-knee':[163,490],'left-ankle':[163,575],'right-hip':[237,405],'right-knee':[237,490],'right-ankle':[237,575]},
'archer':{'hips':[200,330],'torso':[200,230],'neck':[200,169],'head':[200,110],'left-shoulder':[132,207],'left-elbow':[122,274],'left-wrist':[119,357],'right-shoulder':[268,207],'right-elbow':[278,274],'right-wrist':[281,357],'left-hip':[174,347],'left-knee':[174,429],'left-ankle':[174,523],'right-hip':[226,347],'right-knee':[226,429],'right-ankle':[226,523]}}
for kind,parts in layouts.items():
 canvas=Image.new('RGBA',(400,620))
 for name,key,j,x,y,w,h in parts:
  im=Image.open(out+'/'+key+'.png').resize((w,h),Image.Resampling.LANCZOS);canvas.alpha_composite(im,(x,y))
 canvas.save(out+'/'+kind+'-assembled.png')
json.dump({'layouts':layouts,'joints':joints},open(root+'/lib/video/clash-layouts.json','w'),indent=2,ensure_ascii=False)
metadata=[]
for file in sorted(os.listdir(out)):
 if file.endswith('.png'):
  im=Image.open(out+'/'+file);metadata.append({'key':file[:-4],'width':im.width,'height':im.height})
im=Image.open(out+'/archer-arrow.png');im.rotate(90,expand=True).save(out+'/archer-arrow.png');next(v for v in metadata if v['key']=='archer-arrow').update(width=im.height,height=im.width)
json.dump(metadata,open(root+'/lib/video/clash-parts.json','w'),indent=2)
