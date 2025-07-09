#!/bin/bash

date=$(date +"%Y-%m-%d %H:%M:%S")
git add .
git commit -m "Update $date"
git push