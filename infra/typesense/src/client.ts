import Typesense from 'typesense';
export const buildTypesenseClient = (host: string, port: number, protocol: string, apiKey: string) => {
    return new Typesense.Client({
        nodes: [
            {
                host,
                port,
                protocol,
            },
        ],
        apiKey,
        connectionTimeoutSeconds: 2,
    });
};
