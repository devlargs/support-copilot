export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/support-copilot',
    },
    ai: {
        huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || 'hf_demo',
    },
});
