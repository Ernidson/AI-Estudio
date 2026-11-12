from pathlib import Path
import math,wave,struct,subprocess
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]
out=root/'public/video-demo';out.mkdir(exist_ok=True)
(out/'scenery.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#827eac"/><stop offset="1" stop-color="#e8c1aa"/></linearGradient><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#769797"/><stop offset="1" stop-color="#344e63"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1280v720H0z"/><circle cx="920" cy="230" r="84" fill="#f4d9ae" opacity=".8"/><path fill="#79758e" opacity=".45" d="M0 370 190 210 400 370 650 270 870 390 1130 300 1280 400v320H0z"/><path fill="url(#sea)" d="M0 398h1280v322H0z"/><path d="M40 453h300m390-18h300M125 490h400m325 25h350M20 556h300m340 25h380" stroke="#bdd1c6" opacity=".2" stroke-width="3"/><path fill="#37454e" d="m0 590 230-90 130 45 190-20 200 90 225-35 305 95v45H0z"/><path fill="#26343c" d="m0 660 250-30 260 40 220-30 350 40 200-20v60H0z"/><text x="35" y="688" fill="#c5d1d3" opacity=".5" font-family="sans-serif" font-size="11" letter-spacing="3">CENÁRIO ILUSTRADO · DEMONSTRAÇÃO EBOOK AI STUDIO</text></svg>''')
def character(name,shirt,hair,wave_pose=False):
 arm='<path d="m265 259 43-57 15-76" fill="none" stroke="#e4b699" stroke-width="28" stroke-linecap="round"/><circle cx="325" cy="116" r="16" fill="#e4b699"/>' if wave_pose else '<path d="m263 255 26 135" stroke="#e4b699" stroke-width="28" stroke-linecap="round"/>'
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="620" viewBox="0 0 400 620"><ellipse cx="200" cy="598" rx="98" ry="14" fill="#111b2d" opacity=".18"/><path d="m157 380-14 178m97-178 19 178" stroke="#334057" stroke-width="48" stroke-linecap="round"/><path d="m129 576h45m65 0h47" stroke="#1c2638" stroke-width="24" stroke-linecap="round"/><path d="m139 258-27 135" stroke="#e4b699" stroke-width="28" stroke-linecap="round"/>{arm}<path d="M132 260q6-49 68-51 62 2 68 51l-15 143H145z" fill="{shirt}"/><path d="M184 193v28q16 15 32 0v-28" fill="#d5a88b"/><ellipse cx="200" cy="136" rx="59" ry="70" fill="#e4b699"/><path d="M142 145q-13-98 65-97 75 5 49 107l-14-61q-34 29-84 22z" fill="{hair}"/><circle cx="179" cy="140" r="4" fill="#31323d"/><circle cx="222" cy="140" r="4" fill="#31323d"/><path d="M188 170q13 9 27-1" stroke="#aa6f64" fill="none" stroke-width="3" stroke-linecap="round"/><path d="M150 292q49 14 101 0" fill="none" stroke="white" opacity=".15" stroke-width="3"/></svg>'''
(out/'ana.svg').write_text(character('Ana','#a994ce','#60424c'))
(out/'ana-wave.svg').write_text(character('Ana','#a994ce','#60424c',True))
(out/'rui.svg').write_text(character('Rui','#709f99','#343344'))
with wave.open(str(out/'chime.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(22050)
 w.writeframes(b''.join(struct.pack('<h',int(5000*math.exp(-t/16000)*math.sin(2*math.pi*(523 if t<22050 else 659)*t/22050))) for t in range(66150)))
frames=root/'.sites-runtime/game-frames';frames.mkdir(parents=True,exist_ok=True)
for i in range(120):
 im=Image.new('RGB',(640,360),'#182439');d=ImageDraw.Draw(im)
 for x in range(0,640,40):d.line((x,0,x,360),fill='#20304a')
 for y in range(0,360,40):d.line((0,y,640,y),fill='#20304a')
 d.rectangle((0,306,640,360),fill='#526b69');d.rectangle((280,245,440,262),fill='#6b8b82');d.rectangle((470,185,620,202),fill='#6b8b82')
 x=35+i*4.2;y=274-abs(math.sin(i/24))*100
 d.rounded_rectangle((x,y,x+24,y+30),radius=5,fill='#b5a1d9');d.ellipse((x+15,y+5,x+19,y+9),fill='white')
 for cx,cy in [(300,220),(370,220),(495,160),(560,160)]:d.ellipse((cx,cy,cx+11,cy+11),fill='#e9ca7f')
 d.text((20,16),'GAMEPLAY SINTETICO / DEMONSTRACAO',fill='#b4becf');d.text((20,36),'PROTOTIPO 2D - SEM IMAGENS DE JOGOS REAIS',fill='#798da9')
 im.save(frames/f'{i:04}.png')
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','24','-i',str(frames/'%04d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'gameplay.mp4')],check=True)
print('Generated SVG scenery, transparent characters and poses, WAV audio and 5s MP4 synthetic gameplay.')
