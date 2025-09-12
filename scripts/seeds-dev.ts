#!/usr/bin/env tsx

// MerchConnect México - Seeds para desarrollo
// Crea datos de prueba en DynamoDB

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { tableName, keys } from '@merchconnect/data';

const stage = process.env.STAGE || 'dev';
const region = process.env.AWS_REGION || 'us-east-1';

const client = new DynamoDBClient({ region });
const ddb = DynamoDBDocumentClient.from(client);

async function seedData() {
  console.log(`🌱 Seeding data for stage: ${stage}`);
  
  const table = tableName(stage as 'dev' | 'sbx' | 'prod');
  
  // 1. Crear organizaciones
  const orgs = [
    {
      pk: keys.orgPk('onpoint-workshop'),
      sk: 'PROFILE',
      gsi1pk: 'ORG#TYPE#workshop',
      orgId: 'onpoint-workshop',
      orgType: 'workshop',
      orgSlug: 'onpoint',
      name: 'OnPoint Workshop',
      plan: 'pro',
      features: ['landingEditable', 'seoControls'],
      createdAt: new Date().toISOString(),
    },
    {
      pk: keys.orgPk('forpromo-provider'),
      sk: 'PROFILE',
      gsi1pk: 'ORG#TYPE#provider',
      orgId: 'forpromo-provider',
      orgType: 'provider',
      orgSlug: 'forpromo',
      name: 'Forpromo Solutions',
      plan: 'premium',
      features: ['landingEditable', 'seoControls', 'whatsappIntegration', 'prioritySupport'],
      createdAt: new Date().toISOString(),
    }
  ];

  // 2. Crear usuarios
  const users = [
    {
      pk: keys.orgPk('onpoint-workshop'),
      sk: keys.userSk('user-1'),
      gsi1pk: 'USER#EMAIL#admin@onpoint.com',
      orgId: 'onpoint-workshop',
      userId: 'user-1',
      email: 'admin@onpoint.com',
      name: 'Admin OnPoint',
      roles: ['admin'],
      perms: ['*'],
      createdAt: new Date().toISOString(),
    },
    {
      pk: keys.orgPk('forpromo-provider'),
      sk: keys.userSk('user-2'),
      gsi1pk: 'USER#EMAIL#admin@forpromo.com',
      orgId: 'forpromo-provider',
      userId: 'user-2',
      email: 'admin@forpromo.com',
      name: 'Admin Forpromo',
      roles: ['admin'],
      perms: ['*'],
      createdAt: new Date().toISOString(),
    }
  ];

  // 3. Crear páginas públicas
  const pages = [
    {
      pk: keys.orgPk('onpoint-workshop'),
      sk: keys.pageSk('home'),
      orgId: 'onpoint-workshop',
      slug: 'home',
      title: 'OnPoint Workshop - Merchandise Personalizado',
      content: `# Bienvenido a OnPoint Workshop

Somos especialistas en merchandise personalizado para empresas.

## Nuestros Servicios
- Camisetas personalizadas
- Tazas con logo
- Material promocional
- Diseño gráfico

## Contacto
Email: admin@onpoint.com
Tel: +52 55 1234 5678`,
      status: 'published',
      s3Key: 'orgs/onpoint-workshop/pages/home.html',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      pk: keys.orgPk('forpromo-provider'),
      sk: keys.pageSk('home'),
      orgId: 'forpromo-provider',
      slug: 'home',
      title: 'Forpromo Solutions - Proveedor de Merchandise',
      content: `# Forpromo Solutions

Proveedor líder en merchandise personalizado.

## Catálogo
- Productos textiles
- Artículos promocionales
- Servicios de impresión
- Tiempos de entrega rápidos

## Ventajas
- Precios competitivos
- Calidad garantizada
- Soporte 24/7`,
      status: 'published',
      s3Key: 'orgs/forpromo-provider/pages/home.html',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // 4. Crear inventario de productos
  const inventory = [
    {
      pk: keys.orgPk('forpromo-provider') + '#PROVIDER#forpromo-provider',
      sk: 'PROD#tsh-001',
      orgId: 'forpromo-provider',
      providerId: 'forpromo-provider',
      productId: 'tsh-001',
      sku: 'TSH-001',
      name: 'Camisetas 100% Algodón',
      description: 'Camisetas de algodón premium para personalización',
      stock: 500,
      basePrice: 5.50,
      leadTime: 7,
      tiers: [
        { minQty: 1, maxQty: 99, price: 8.50 },
        { minQty: 100, maxQty: 499, price: 7.50 },
        { minQty: 500, maxQty: 999, price: 6.50 },
        { minQty: 1000, maxQty: 9999, price: 5.50 }
      ],
      createdAt: new Date().toISOString(),
    },
    {
      pk: keys.orgPk('forpromo-provider') + '#PROVIDER#forpromo-provider',
      sk: 'PROD#mug-001',
      orgId: 'forpromo-provider',
      providerId: 'forpromo-provider',
      productId: 'mug-001',
      sku: 'MUG-001',
      name: 'Tazas Cerámicas',
      description: 'Tazas de cerámica blanca para sublimación',
      stock: 200,
      basePrice: 3.20,
      leadTime: 5,
      tiers: [
        { minQty: 1, maxQty: 49, price: 4.50 },
        { minQty: 50, maxQty: 199, price: 3.80 },
        { minQty: 200, maxQty: 499, price: 3.50 },
        { minQty: 500, maxQty: 999, price: 3.20 }
      ],
      createdAt: new Date().toISOString(),
    }
  ];

  // 5. Crear RFQ de ejemplo
  const rfqs = [
    {
      pk: keys.orgPk('onpoint-workshop'),
      sk: keys.rfqSk('rfq-001'),
      gsi1pk: 'RFQ#OPEN',
      orgId: 'onpoint-workshop',
      rfqId: 'rfq-001',
      title: 'Camisetas personalizadas para evento',
      description: 'Necesitamos 1000 camisetas con logo para evento corporativo',
      productType: 'camisetas',
      quantity: 1000,
      status: 'open',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
      createdAt: new Date().toISOString(),
    }
  ];

  // 6. Crear cotizaciones de ejemplo
  const quotes = [
    {
      pk: keys.rfqSk('rfq-001'),
      sk: keys.quoteSk('forpromo-provider', 'quote-001'),
      gsi1pk: 'QUOTE#BY#PROVIDER#forpromo-provider',
      rfqId: 'rfq-001',
      providerOrgId: 'forpromo-provider',
      quoteId: 'quote-001',
      price: 6500, // $6.50 x 1000
      leadTime: 7,
      notes: 'Precio especial por volumen. Incluye diseño básico.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  ];

  // Insertar datos
  try {
    console.log('📝 Insertando organizaciones...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: orgs.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('👥 Insertando usuarios...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: users.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('📄 Insertando páginas...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: pages.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('📦 Insertando inventario...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: inventory.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('📋 Insertando RFQs...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: rfqs.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('💰 Insertando cotizaciones...');
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        [table]: quotes.map(item => ({ PutRequest: { Item: item } }))
      }
    }));

    console.log('✅ Seeds completados exitosamente!');
    console.log('');
    console.log('🔗 Datos creados:');
    console.log('  - 2 organizaciones (OnPoint Workshop, Forpromo Solutions)');
    console.log('  - 2 usuarios admin');
    console.log('  - 2 páginas públicas');
    console.log('  - 2 productos en inventario');
    console.log('  - 1 RFQ de ejemplo');
    console.log('  - 1 cotización de ejemplo');
    console.log('');
    console.log('🌐 URLs de prueba:');
    console.log('  - http://localhost:3000/site/onpoint/home');
    console.log('  - http://localhost:3000/site/forpromo/home');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    process.exit(1);
  }
}

// Ejecutar seeds
seedData().catch(console.error);
