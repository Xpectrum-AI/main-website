#!/bin/sh
set -e

# Function to get secret from AWS Secrets Manager
get_secret() {
    aws secretsmanager get-secret-value \
        --secret-id "$1" \
        --query 'SecretString' \
        --output text
}

# Get secrets from AWS Secrets Manager
if [ -n "$AWS_SECRETS_MANAGER_ID" ]; then
    echo "Fetching secrets from AWS Secrets Manager..."
    
    # Get the secret
    SECRETS=$(get_secret "$AWS_SECRETS_MANAGER_ID")
    
    # Export secrets as environment variables
    export OPENAI_API_KEY=$(echo "$SECRETS" | jq -r '.OPENAI_API_KEY')
    export ELEVENLABS_API_KEY=$(echo "$SECRETS" | jq -r '.ELEVENLABS_API_KEY')
    export ELEVEN_LABS_VOICE_ID=$(echo "$SECRETS" | jq -r '.ELEVEN_LABS_VOICE_ID')
    export ELEVEN_LABS_MODEL_ID=$(echo "$SECRETS" | jq -r '.ELEVEN_LABS_MODEL_ID')
    export CHATBOT_API_URL=$(echo "$SECRETS" | jq -r '.CHATBOT_API_URL')
    export NEXT_AGI_API_KEY=$(echo "$SECRETS" | jq -r '.NEXT_AGI_API_KEY')
    export AWS_ACCESS_KEY_ID=$(echo "$SECRETS" | jq -r '.AWS_ACCESS_KEY_ID')
    export AWS_SECRET_ACCESS_KEY=$(echo "$SECRETS" | jq -r '.AWS_SECRET_ACCESS_KEY')
fi

# Execute the main command
exec "$@" 