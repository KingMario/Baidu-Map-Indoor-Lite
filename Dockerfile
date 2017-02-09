# This dockerfile uses the ubuntu image
# VERSION 1 - EDITION 1
# Author: KingMario

FROM ubuntu

MAINTAINER KingMario <gcyyq@hotmail.com>

# Commands to build the env
RUN apt-get update
RUN apt-get install -y python python-pip
RUN apt-get install -y libjpeg-dev libfreetype6 python-dev python-setuptools
RUN apt-get install -y zlib1g-dev
RUN apt-get install -y curl
RUN apt-get clean
RUN pip install pillow
RUN mkdir ~/mapCut
RUN mkdir ~/mapCut/precut
RUN mkdir ~/mapCut/result
RUN curl https://raw.githubusercontent.com/KingMario/Baidu-Map-Indoor-Lite/master/mapCut.py -o ~/mapCut/mapCut.py
RUN chmod +x ~/mapCut/mapCut.py

# Commands when creating a new container
CMD /bin/bash