import { buildTypesenseClient } from './client.js';
async function drop(collectionName: string) {
    const client = buildTypesenseClient(
        'localhost',
        8108,
        'http',
        'xyz',
    );

    const result = await client.collections(collectionName).delete();
    console.log('Successfully dropped collection: ', result);
}

console.log(process.argv);
drop(process.argv[process.argv.length - 1]);
