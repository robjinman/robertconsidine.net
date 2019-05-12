#!/bin/bash

aws s3 rm s3://robjinman.com --recursive
aws s3 cp ./dist/rjblog s3://robjinman.com/ --recursive
