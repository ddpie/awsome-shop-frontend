#!/bin/bash
set -e

REGION="us-east-1"
ACCOUNT_ID="022346938362"
REPO_NAME="aidlc-shop-frontend"
IMAGE_TAG="${1:-latest}"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"

echo "==> Logging in to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

echo "==> Building Docker image..."
docker build --platform linux/amd64 -t ${REPO_NAME}:${IMAGE_TAG} .

echo "==> Tagging and pushing..."
docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
docker push ${ECR_URI}:${IMAGE_TAG}

echo "==> Updating ECS service..."
aws ecs update-service \
  --cluster aidlc-shop-cluster \
  --service aidlc-shop-frontend \
  --force-new-deployment \
  --region ${REGION}

echo "==> Done! Service is updating."
