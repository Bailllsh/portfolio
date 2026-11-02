"""Render supplied portfolio PDFs into on-site images; never copy source PDFs to public/."""
import argparse, json, subprocess
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
from pypdf import PdfReader

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--live',required=True)
parser.add_argument('--mall',required=True)
args=parser.parse_args()
titles={
'live':[
('项目封面','Project cover'),('项目背景','Project background'),('产品现状分析','Current experience'),('单一视角观看限制','Single-view limitations'),('互动与身份表达','Interaction and identity'),('整体体验链路','Experience journey'),('直播发现问题','Content discovery'),('直播发现方案','Discovery improvements'),('同局视角与观看入口','Same-match viewing'),('多屏布局规则','Multi-view layouts'),('焦点与切换规则','Focus and switching'),('音频与互动反馈','Audio and feedback'),('多屏画面编辑','Editing views'),('添加与替换','Adding and replacing'),('移除与满屏状态','Removal and capacity'),('交战提醒','Combat alerts'),('信息延迟策略','Information delay'),('弹幕设置优化','Comment settings'),('游戏化互动表达','Game-based interaction'),('王者荣耀表情弹幕','Honor of Kings emotes'),('无畏契约表情弹幕','VALORANT emotes'),('三角洲行动表情弹幕','Delta Force emotes'),('主播粉丝身份体系','Fan identity system'),('粉丝身份应用','Fan identity applications'),('项目复盘','Reflection'),('结语','Closing')],
'mall':[
('项目封面','Project cover'),('设计目标','Design goals'),('AIGC 白模渲染法','AIGC blockout rendering'),('主视觉设计过程','Key visual process'),('主视觉与细节展示','Key visual details'),('闪屏页设计过程','Splash-screen process'),('闪屏页展示','Splash-screen designs'),('视觉应用 01','Visual application 01'),('视觉应用 02','Visual application 02'),('视觉应用 03','Visual application 03'),('视觉应用 04','Visual application 04'),('结语','Closing')]
}
manifest={}
for key,path in [('live',args.live),('mall',args.mall)]:
    out=root/'tmp'/'case-originals'/key;out.mkdir(parents=True,exist_ok=True)
    reader=PdfReader(path)
    if len(reader.pages)!=len(titles[key]): raise ValueError(f'Unexpected page count in {key}')
    print(f'Rendering {key}: {len(reader.pages)} pages',flush=True)
    result=subprocess.run(['pdftoppm','-png','-scale-to-x','1920','-scale-to-y','-1',path,str(out/'page')],capture_output=True,text=True)
    if result.returncode: raise RuntimeError(result.stderr[-1500:])
    files=sorted(out.glob('page-*.png'))
    if len(files)!=len(reader.pages): raise ValueError('Incomplete render')
    pages=[];thumbs=[]
    for i,file in enumerate(files):
        with Image.open(file) as im:
            im=im.convert('RGB');w,h=im.size
            name=f'{key}-{i+1:02d}'
            im.save(root/'public/assets/cases'/f'{name}.webp','WEBP',quality=94,method=5)
            thumb=im.copy();thumb.thumbnail((240,420))
            thumb.save(root/'public/assets/cases'/f'{name}-thumb.webp','WEBP',quality=82,method=4)
            canvas=Image.new('RGB',(250,470),'#30302e');canvas.paste(thumb,((250-thumb.width)//2,25))
            ImageDraw.Draw(canvas).text((10,445),name,fill='white');thumbs.append(canvas)
            zh,en=titles[key][i]
            pages.append({'id':name,'page':i+1,'title':{'zh':zh,'en':en},'src':f'assets/cases/{name}.webp','thumb':f'assets/cases/{name}-thumb.webp','width':w,'height':h,'chapter': key=='mall' or i+1 in [1,2,3,6,7,10,18,20,23,25]})
        if (i+1)%5==0:print(f'{key}: converted {i+1}/{len(files)}',flush=True)
    sheet=Image.new('RGB',(250*6,470*((len(thumbs)+5)//6)),'#151515')
    for i,thumb in enumerate(thumbs):sheet.paste(thumb,((i%6)*250,(i//6)*470))
    sheet.save(root/'tmp'/f'{key}-contact-sheet.jpg',quality=90)
    manifest[key]={'pageCount':len(pages),'pages':pages}
    print(f'{key}: complete',flush=True)
(root/'src'/'case-pages.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Manifest ready. No original portfolio PDF was placed in public/.',flush=True)
