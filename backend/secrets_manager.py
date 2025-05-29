import boto3
import json
from botocore.exceptions import ClientError

class SecretsManager:
    def __init__(self, region_name='us-east-1'):
        self.session = boto3.session.Session()
        self.secrets_client = self.session.client(
            service_name='secretsmanager',
            region_name=region_name
        )

    def get_secret(self, secret_name):
        """
        Always fetch secret fresh from AWS Secrets Manager (no caching)
        """
        try:
            print('Fetching fresh secret from AWS')
            get_secret_value_response = self.secrets_client.get_secret_value(
                SecretId=secret_name
            )
            return json.loads(get_secret_value_response['SecretString'])
        except ClientError as e:
            print(f'Error fetching secret: {e}')
            # Log the specific error code and message
            if e.response['Error']['Code'] == 'DecryptionFailureException':
                print('Secrets Manager can\'t decrypt the protected secret text using the provided KMS key.')
            elif e.response['Error']['Code'] == 'InternalServiceErrorException':
                print('An error occurred on the server side.')
            elif e.response['Error']['Code'] == 'InvalidParameterException':
                print('You provided an invalid value for a parameter.')
            elif e.response['Error']['Code'] == 'InvalidRequestException':
                print('You provided a parameter value that is not valid for the current state of the resource.')
            elif e.response['Error']['Code'] == 'ResourceNotFoundException':
                print('We can\'t find the resource that you asked for.')
            raise

    def get_api_keys(self):
        """
        Get API keys from the chat-api-keys secret
        """
        try:
            secret = self.get_secret('chat-api-keys')
            return {
                'OPENAI_API_KEY': secret.get('OPENAI_API_KEY'),
                'HRMS': secret.get('HRMS'),
                'Insurance': secret.get('Insurance'),
                'Hospitality': secret.get('Hospitality'),
                'XpectrumDemo': secret.get('XpectrumDemo'),
                'ELEVENLABS_API_KEY': secret.get('ELEVENLABS_API_KEY'),
                'ELEVEN_LABS_VOICE_ID': secret.get('ELEVEN_LABS_VOICE_ID'),
                'ELEVEN_LABS_MODEL_ID': secret.get('ELEVEN_LABS_MODEL_ID'),
                'CHATBOT_API_URL': secret.get('CHATBOT_API_URL'),
                'NEXT_AGI_API_KEY': secret.get('NEXT_AGI_API_KEY'),
                
            }
        except Exception as e:
            print(f'Error getting API keys: {e}')
            raise 