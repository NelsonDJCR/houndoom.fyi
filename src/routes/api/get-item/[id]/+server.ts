import { json } from '@sveltejs/kit';
import { getFullCatalog } from '$lib/services/notion';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		const ids = id.split(',').map((i) => i.trim());
		const store = await getFullCatalog();
		const items = store.items.filter((item) => ids.includes(item.id.toString()));

		if (items.length === 0) {
			return json({ error: 'Items not found' }, { status: 404 });
		}

		return json(items);
	} catch (error) {
		console.error('Error fetching items:', error);
		return json({ error: 'Failed to fetch items' }, { status: 500 });
	}
};
