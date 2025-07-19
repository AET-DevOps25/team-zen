#!/bin/bash
# Create S3 bucket for Terraform state storage

BUCKET_NAME="zenai-terraform-state-bucket"
REGION="us-east-1"

echo "Creating S3 bucket for Terraform state..."

# Create the bucket
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "✅ S3 bucket '$BUCKET_NAME' created successfully!"
echo "Now you can run your Terraform workflows."