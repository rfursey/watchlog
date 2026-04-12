const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database('watchlog').container('entries');

app.http('saveEntry', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'entries',
    handler: async (request, context) => {
        try {
            const entry = await request.json();
            if (!entry.id || !entry.title) {
                return { status: 400, jsonBody: { error: 'id and title are required' } };
            }
            const { resource } = await container.items.upsert(entry);
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                jsonBody: resource
            };
        } catch (err) {
            context.error('saveEntry error:', err);
            return { status: 500, jsonBody: { error: 'Failed to save entry' } };
        }
    }
});
