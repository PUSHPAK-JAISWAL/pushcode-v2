#!/bin/sh

mkdir -p /tmp/code
cd /tmp/code

printf "%s" "$CODE" > Main.java

javac Main.java

exec java Main