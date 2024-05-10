#!/usr/bin/env bash

set -ex

sam deploy --profile pcd-homework-2 -t db.yaml --stack-name pcd-homework-2-db
sam deploy --profile pcd-homework-2 -t cache.yaml --stack-name pcd-homework-2-cache

sam build -t compute.yaml
sam package --profile pcd-homework-2 --template-file .aws-sam/build/template.yaml --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-3ssirkjypfff --output-template-file packaged-template.yaml
sam deploy --profile pcd-homework-2 -t packaged-template.yaml --stack-name pcd-homework-2-compute
