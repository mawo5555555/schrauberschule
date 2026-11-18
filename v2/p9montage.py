import sys
from PIL import Image
# python3 p9montage.py <hook> -> shots/p9-<hook>-montage.png (alle Größen nebeneinander, auf Höhe 640 skaliert)
k=sys.argv[1]; sz=sys.argv[2:] or "320x568 390x844 430x932 768x1024 1024x1366 1280x800 1920x1080".split()
ims=[]
for s in sz:
    try: im=Image.open(f'v2/shots/p9-{k}-{s}.png').convert('RGB')
    except Exception as e: continue
    r=640/im.height; ims.append(im.resize((max(1,int(im.width*r)),640)))
W=sum(i.width for i in ims)+8*len(ims); M=Image.new('RGB',(W,640),(60,60,60)); x=0
for i in ims: M.paste(i,(x,0)); x+=i.width+8
M.save(f'v2/shots/p9-{k}-montage.png')
