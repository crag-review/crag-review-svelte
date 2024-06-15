#!/bin/bash
for FILE in ./images/main/*
do
    f=$(basename $FILE .jpg)
    echo $f

    convert ./images/main/${f}.jpg -resize 300x ./images/small/${f}.jpg
done