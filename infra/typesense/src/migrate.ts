import { buildTypesenseClient } from './client.js';

async function migrate() {
    console.log('Migrating Typesense...');

    const client = buildTypesenseClient(
        'localhost',
        8108,
        'http',
        'xyz',
    );

    const schema = {
        profile: {
            name: 'profile',
            num_documents: 0,
            fields: [
                { name: 'userId', type: 'string' },
                { name: 'username', type: 'string' },
                { name: 'nationality', type: 'string', optional: true },
                { name: 'avatarUrl', type: 'string', optional: true },
            ] as const,
        },
        team: {
            name: 'team',
            num_documents: 0,
            enable_nested_fields: true,
            fields: [
                { name: 'name', type: 'string' },
                { name: 'leaderUsername', type: 'string' },
                { name: 'imageUrl', type: 'string', optional: true },
                { name: 'size', type: 'int32' },
                { name: 'members', type: 'object[]' },
            ] as const,
        },
        event: {
            name: 'event',
            num_documents: 0,
            enable_nested_fields: true,
            fields: [
                { name: 'title', type: 'string' },
                { name: 'host.userId', type: 'string', optional: true },
                { name: 'host.username', type: 'string', optional: true },
                { name: 'host.avatarUrl', type: 'string', optional: true },
                { name: 'logoUrl', type: 'string', optional: true },
                { name: 'bannerUrl', type: 'string', optional: true },
                { name: 'published', type: 'bool' },
                { name: 'place.formattedAddress', type: 'string' },
                {
                    name: 'place.location',
                    type: 'geopoint',
                },
                { name: 'place.lat', type: 'float' },
                { name: 'place.lng', type: 'float' },
                { name: 'startAtUnix', type: 'int64' },
                { name: 'startAtUtc', type: 'string' },
                { name: 'startAtLocal', type: 'string' },
                { name: 'endAtUnix', type: 'int64' },
                { name: 'endAtUtc', type: 'string' },
                { name: 'endAtLocal', type: 'string' },
                { name: 'iana', type: 'string' },
            ] as const,
        },
    };
    const collections = await client.collections().retrieve();

    for (const [collectionKey, schemaConfig] of Object.entries(schema)) {
        const relevantCollection = collections.find((collection) => collection.name === collectionKey);
        if (!relevantCollection) {
            console.log(`Creating collection: ${collectionKey}`);
            // @ts-expect-error
            await client.collections().create(schemaConfig);
        } else {
            console.log(`Collection ${collectionKey} already exists.`);
            for (const field of schemaConfig.fields) {
                // Most recent schema field name does not exist in collection
                if (!relevantCollection.fields!.some((collectionField) => collectionField.name === field.name)) {
                    console.log(`Creating field: ${field.name}`);

                    await client
                        .collections(collectionKey)
                        .update({ fields: [{ name: field.name, type: field.type, optional: true }] });
                }

                // Most recent schema field name exists in collection
                else {
                    const collectionField = relevantCollection.fields!.find(
                        (collectionField) => collectionField.name === field.name,
                    );
                    // Deep compare fields
                    // console.log(collectionField, field);
                    for (const [key, value] of Object.entries(field)) {
                        if (collectionField![key] !== value) {
                            console.log(`Updating field: ${field.name}`);

                            await client
                                .collections(collectionKey)
                                .update({ fields: [{ ...collectionField!, drop: true }, field] });
                        }
                    }
                }
            }
            for (const collectionField of relevantCollection.fields!) {
                // Collection field name does not exist in most recent schema
                if (!schemaConfig.fields.some((field) => field.name === collectionField.name)) {
                    console.log(`Deleting field: ${collectionField.name}`);

                    await client.collections(collectionKey).update({
                        fields: [{ name: collectionField.name, drop: true }],
                    });
                }
            }
        }
    }

    console.log('Migrate complete.');
}

migrate();
