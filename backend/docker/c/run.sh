#!/bin/sh

mkdir -p /tmp/code
cd /tmp/code

printf "%s" "$CODE" > main.c

gcc main.c -o main.out

exec ./main.out