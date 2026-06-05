import { json } from '@sveltejs/kit';
import { getStore } from '$lib/services/notion';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const store = await getStore();
		return json(store);
	} catch (error) {
		console.error('Error fetching store data:', error);
		return json({ error: 'Failed to fetch store data' }, { status: 500 });
	}
};