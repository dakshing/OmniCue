import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the local Elasticsearch instance
const client = new Client({
  node: 'http://localhost:9200',
});

const INDEX_NAME = 'company-knowledge-base';
const MOCK_DATA_DIR = path.join(__dirname, '..', 'static_mock_data');

async function run() {
  console.log(`Starting ingestion into local Elasticsearch...`);

  // Wait for Elasticsearch to be ready
  try {
    await client.ping();
    console.log('Elasticsearch is up and running.');
  } catch (err) {
    console.error('Error connecting to Elasticsearch. Is docker-compose running?', err);
    process.exit(1);
  }

  // Create the index with basic text mappings
  const indexExists = await client.indices.exists({ index: INDEX_NAME });
  if (indexExists) {
    console.log(`Index "${INDEX_NAME}" already exists, deleting...`);
    await client.indices.delete({ index: INDEX_NAME });
  }

  console.log(`Creating index "${INDEX_NAME}"...`);
  await client.indices.create({
    index: INDEX_NAME,
    mappings: {
      properties: {
        title: { type: 'text' },
        snippet: { type: 'text' },
        url: { type: 'keyword' },
        raw_markdown: { type: 'text' }
      }
    }
  });

  // Read the markdown files
  const files = fs.readdirSync(MOCK_DATA_DIR).filter(f => f.endsWith('.md'));
  
  const bulkOperations = [];

  for (const file of files) {
    const filePath = path.join(MOCK_DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a mock URL based on the filename
    const mockUrl = `https://confluence.company.com/pages/${file.replace('.md', '')}`;

    // Use a snippet of the first 200 characters for the display UI
    const snippet = content.substring(0, 200).replace(/\n/g, ' ') + '...';

    bulkOperations.push({ index: { _index: INDEX_NAME } });
    bulkOperations.push({
      title: file,
      snippet: snippet,
      url: mockUrl,
      raw_markdown: content
    });
  }

  // Execute bulk ingest
  if (bulkOperations.length > 0) {
    console.log(`Indexing ${files.length} documents...`);
    const bulkResponse = await client.bulk({ refresh: true, operations: bulkOperations });
    
    if (bulkResponse.errors) {
      console.error('Bulk ingestion had errors:', bulkResponse.items);
    } else {
      console.log('Successfully ingested all documents!');
    }
  } else {
    console.log('No markdown files found to ingest.');
  }
}

run().catch(console.error);
