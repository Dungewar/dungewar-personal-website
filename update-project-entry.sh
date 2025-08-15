#!/bin/bash
cd /srv/dungewar-personal-website || exit
git stash
git pull
./update-project.sh