import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// Serve presigned URL redirect for /api/download
		if (url.pathname === '/api/download') {
			const S3 = new S3Client({
				region: 'auto',
				endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
				credentials: {
					accessKeyId: env.R2_ACCESS_KEY_ID,
					secretAccessKey: env.R2_ACCESS_KEY_SECRET,
				},
			});

			const bucket = env.R2_BUCKET_NAME;
			const fileName = env.R2_FILE_NAME;

			const presignedUrl = await getSignedUrl(
				S3,
				new GetObjectCommand({
					Bucket: bucket,
					Key: fileName,
					ResponseContentDisposition: `attachment; filename="${fileName}"`,
				}),
				{ expiresIn: 900 }
			);

			const headers = {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
			};

			return new Response(null, {
				status: 307,
				headers: {
					Location: presignedUrl,
					...headers,
				},
			});
		}

		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
