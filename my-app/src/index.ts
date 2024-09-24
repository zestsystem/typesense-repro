import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Client } from "typesense";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
    const typesense = new Client({
        apiKey: "xyz",
        nodes: [
            {
                host: "localhost",
                port: 8108,
                protocol: "http",
            },
        ],
        numRetries: 3,
        connectionTimeoutSeconds: 120,
        logLevel: "debug",
    });

    try {
        await typesense
            .collections("team")
            .documents()
            .import([
                {
                    id: nanoid(),
                    name: "Awesome Duo",
                    imageUrl: null,
                    size: 2,
                    battlerId: "icXdIXHSZhAsu8XYMRQI0",
                    createdAt: "1727054133",
                    updatedAt: "1727054133",
                    isDeleted: false,
                    members: [
                        {
                            id: "jUHsJXvZc5_iRYS25n5Cn",
                            teamId: "65OhIDFEa1QQdVqyoiX2n",
                            position: "Leader",
                            inviteStatus: "Accepted",
                            userId: "ReslWXNd8UDVy4bkmP1h0",
                            dancer: {
                                id: "UipZeQKJPjKilUUoimsSA",
                                userId: "ReslWXNd8UDVy4bkmP1h0",
                                battlerId: "c5dTrKcIc2s-ITfUvzNFg",
                                username: "mikeyimfb",
                                imageUrl: null,
                                nationality: "KR",
                                createdAt: "1727053829",
                                updatedAt: "1727054343793",
                                isDeleted: false,
                            },
                        },
                        {
                            id: "hUEV0wprXe77xiErLpj0J",
                            teamId: "65OhIDFEa1QQdVqyoiX2n",
                            position: "Member",
                            inviteStatus: "Pending",
                            userId: "kUW8XapcgRxpt7eyKVHk8",
                            dancer: {
                                id: "YgvcGnXGAI7Oce_QGiuwD",
                                userId: "kUW8XapcgRxpt7eyKVHk8",
                                battlerId: "_SYSdbsTsSo249We4AlRW",
                                username: "facebookmike",
                                imageUrl: null,
                                nationality: null,
                                createdAt: "1726979136",
                                updatedAt: "1726979136",
                                isDeleted: false,
                            },
                        },
                    ],
                    leaderUsername: "mikeyimfb",
                },
            ]);
    } catch (e) { 
        console.error(e);
        throw new Error("Failed to import data to typesense");

    }

    return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
