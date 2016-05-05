#!/usr/bin/python
#coding=utf-8

from PIL import Image
import time
import sys
import os
import math
from json import *

if len(sys.argv) != 2:
  print "使用方式："
  print "  ./mapcut.py image_path"
  sys.exit(1)

Image.MAX_IMAGE_PIXELS = None

file_name = os.path.basename(sys.argv[1])
file_name_main = os.path.splitext(file_name)[0]
file_path = os.path.split(sys.argv[1])[0]
precut_file_path = "./precut/"
result_file_path = "./result/"

file = sys.argv[1]

start = time.time()
print "%s - %s 文件切割开始" % (time.strftime('%Y-%m-%d %T', time.localtime(start)), file_name)

try:
  im = Image.open(file)
except:
  print "图像格式未知"
  print "请指定正确的切割的图像文件"
  sys.exit(1)

(w, h) = im.size
maxz = int(max([2, math.ceil(min([math.log(w / 256, 2), math.log(h / 256, 2)]))])) - 1

print "                      文件大小 %d x %d，缩略 %d 个级别" % (w, h, maxz)

failed_tiles = []
tile_width = 256.0
for z in range(maxz):
  for x in range(-int(math.ceil(w / tile_width / 2.0)), int(math.ceil(w / tile_width / 2.0))):
    for y in range(-int(math.ceil(h / tile_width / 2.0)), int(math.ceil(h / tile_width / 2.0))):
      box = (int(w / 2.0 + x * tile_width), int(h / 2.0 - (y + 1) * tile_width), int(w / 2.0 + (x + 1) * tile_width), int( h / 2.0 - y * tile_width))
      try:
        tile = im.crop(box)
        if tile_width != 256.0:
          tile = tile.resize((256, 256),  Image.ANTIALIAS)
      except:
        result = JSONEncoder().encode({"status": 1, "width": w, "height": h, "maxZ": maxz, "x": x, "y": y, "z": z})
        f = open(result_file_path + file_name_main + ".json", "w")
        f.write(result)
        f.close()
        print "                      切割 %s 文件 %d 级别的 (%d, %d) 瓦块时发生异常" % (file_name, z, x, y)
        print "                      共耗时 %f 秒" % (time.time() - start)
        sys.exit(1)

      tile_file_name = "%s_%d_%d_%d.jpg" % (file_name_main, z, x, y)
      tile.save(precut_file_path + tile_file_name, "jpeg")

  tile_width = tile_width * 2

del im

result = JSONEncoder().encode({"status": 0, "width": w, "height": h, "maxZ": maxz})
f = open(result_file_path + file_name_main + ".json", "w")
f.write(result)
f.close()

print "                      %s 文件切割完毕" % file_name
print "                      共耗时 %f 秒" % (time.time() - start)
