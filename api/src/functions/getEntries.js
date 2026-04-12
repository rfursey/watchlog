const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database('watchlog').container('entries');

app.http('getEntries', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'entries',
    handler: async (request, context) => {
        try {
            const { resources } = await container.items
                .query('SELECT * FROM c ORDER BY c._ts DESC')
                .fetchAll();
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                jsonBody: resources
            };
        } catch (err) {
            context.error('getEntries error:', err);
            return { status: 500, jsonBody: { error: 'Failed to load entries' } };
        }
    }
});
