import { createSignedFetcher } from 'aws-sigv4-fetch';

export const onRequest = async (context) => {
    console.log({
    request: context.request,
    url: context.request.url,
    method: context.request.method,
    body: context.request.body,
    });

    const signedFetch = createSignedFetcher({
        service: 'lambda',
        region: 'eu-central-1',
        credentials: {
            accessKeyId: context.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: context.env.AWS_ACCESS_KEY_SECRET,
        }
    });

    const incoming = new URL(context.request.url);
    const backendUrl = new URL(incoming.pathname + incoming.search, context.env.BACKEND_URL);
    const bodyText =  context.request.method !== 'GET' ? await context.request.text() : undefined;

    console.log({
        backendUrl: backendUrl,
        bodyText: bodyText,
    });

    const response = await signedFetch(backendUrl, {
        method: context.request.method,
        body: bodyText,
    });

    console.log({
        response: response,
        status: response.status,
    });

    return response;
};