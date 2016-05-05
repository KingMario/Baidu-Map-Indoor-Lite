# 百度地图室内地图简易方案

## 百度地图自定义图层

百度地图支持自定义图层，可通过获取不同级别金字塔图像瓦块进行平铺的方式来实现自定义图层，并可达到较平滑的漫游和缩略效果，详情参见相关[API](http://lbsyun.baidu.com/index.php?title=jspopular/guide/maplayer)。

## 图像切割

[mapCut.py](mapCut.py) 应用 `Python` 的 `pillow` 库进行复杂的图像处理，可进行图像的多级金字塔缩略切割。

`Python` 的 `pillow` 库支持将图像打开后进行一系列的切割、缩略、保存……等处理，待全部处理完成之后再关闭图像，在图像处理过程中，图像对象始终在内存中，比较适合本方案中的应用场景。  
其他脚本语言如 `php` 或 `node.js` 的图像处理通常调用 ImageMagick 、 GraphicsMagick 之类的第三方图像处理工具，其提供的操作粒度过粗，当图像较大时，频繁的图像文件打开-处理-关闭操作会影响性能，因此不太适合。  
而使用 `c/c++` 语言开发则需要进行编译。

所有上述方案均需要安装必要的 图像处理 和/或 语言 运行环境。

### 环境安装

提供 [setupEnv.sh](setupEnv.sh) 用于 `Ubuntu` 系统下安装 mapCut.py 脚本所需要的运行环境。

提供 DockerFile 创建 docker 运行环境，相关命令如下。

```bash
docker pull kingmario/baidu-map-indoor-lite
docker run -i -t --name mapcut -w /root/mapCut kingmario/baidu-map-indoor-lite
## 按 ctrl-D 退出
docker cp pic_b_2.jpg mapcut:/root/mapCut
docker start mapcut
docker attach mapcut
## 执行 ./mapCut.py pic_b_2 命令
## 按 ctrl-D 退出
mkdir -p localFolder
docker cp mapcut:/root/mapCut/precut localFolder
docker cp mapcut:/root/mapCut/result localFolder
docker rm mapcut
```

### 使用方法

`mapCut.py` 命令行格式如下：

```
./mapCut.py image_path
```

金字塔缩略过程是从图像原始大小开始，按 1 : 2 逐级缩略，当整个图像大小小于等于 2048 × 2048 像素后将不再缩略，该范围由 `mapCut.py` 脚本中的如下语句所控制：

```python
maxz = int(max([2, math.ceil(min([math.log(w / 256, 2), math.log(h / 256, 2)]))])) - 1
```

在不同缩略级别以图像中心为原点，向上下左右切割大小为 256 × 256 像素的图像瓦块，并按一定规则命名。

切割完成后，生成的文件保存在 precut 目录下，并以同名 json 文件保存相应的图像信息和切割信息到 result 目录。  
一般情况切割均可成功；切割过程中若有异常会显示出错信息，此时，请检查所要切割的图像文件有无损坏。

### HTML5 地图切割替代方案

可以考虑使用 HTML5 画布实现实时地图切割，该替代方案可减少服务器上的空间占用和地图显示时的前后端交互，但有可能会影响到客户端性能，因此需要谨慎分析。

## 室内地图显示

使用百度地图自定义图层加载瓦块图像的方式实现室内地图显示，图像范围内的瓦块文件根据缩放级别及经纬度坐标位置获取，超出图像范围则直接使用黑色瓦块文件。  
显示的地图中心点的经纬度为 (0, 0)，最大缩放级别是 18 级，缩放级别范围由图像切割过程的金字塔中不同级别图像大小的范围所决定，一般一幅 40000 × 40000 像素的较大图像的缩放级别在 13 ～ 18 之间，其背景地图为 (0, 0) 附近的一片水域。

### 示例页面

[示例页面](mapViewer.html)  
使用的示例室内地图来自网络，如有侵权请告知。

### 获取经纬度坐标映射

为实现如 _覆盖物、文字标签、闪烁点、热力图_ …… 等复杂的室内地图应用，需要获取室内地图中点的 _经纬度_ 坐标。  
示例页面中可直接在地图上点击获取相应的经纬度坐标映射，将示例页面中的图像名。

## 室内地图应用

在室内地图显示的基础上使用上述 **映射** _经纬度_ 坐标按普通地图应用方式实现 _覆盖物、文字标签、闪烁点、热力图_ …… 等应用即可。

### 示例页面

[热力图示例](mapApplication.html)  
使用的示例室内地图来自网络，如有侵权请告知。

## License

MIT