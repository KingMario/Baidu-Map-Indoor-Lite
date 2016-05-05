#!/bin/bash

apt-get update

## install python
apt-get install -y python

## install pip
apt-get install -y python-pip

## install pillow prerequisites
apt-get install -y libjpeg-dev
apt-get install -y libfreetype6
apt-get install -y python-dev python-setuptools
apt-get install -y zlib1g-dev

## install pillow
pip install pillow

mkdir -p precut
mkdir -p result