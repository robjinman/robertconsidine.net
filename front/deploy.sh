#!/bin/bash

aws s3 rm s3://robertconsidine.net --recursive
aws s3 cp ./dist/rjblog s3://robertconsidine.net/ --recursive
