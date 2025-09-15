import { Amplify } from 'aws-amplify';
import { getConfig } from './config';

// Obtener configuración del entorno actual
const config = getConfig();

// Configuración de Amplify basada en el entorno
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_ro8nTkx1y',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '4it5548ief4g1u4khaip302hb4',
      loginWith: {
        email: true,
        username: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
    },
  },
  API: {
    REST: {
      MerchConnect: {
        endpoint: config.baseUrl,
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      },
    },
  },
};

// Configurar Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;
