import { json } from '@sveltejs/kit';
import { getFullCatalog } from '$lib/services/notion';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		const store = await getFullCatalog();
		const item = store.items.find((item) => item.id.toString() === id);

		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		return json(item);
	} catch (error) {
		console.error('Error fetching item:', error);
		return json({ error: 'Failed to fetch item' }, { status: 500 });
	}
};
