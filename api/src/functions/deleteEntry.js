const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database('watchlog').container('entries');

app.http('deleteEntry', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'entries/{id}',
    handler: async (request, context) => {
        try {
            const id = request.params.id;
            await container.item(id, id).delete();
            return { status: 204 };
        } catch (err) {
            context.error('deleteEntry error:', err);
            return { status: 500, jsonBody: { error: 'Failed to delete entry' } };
        }
    }
});
