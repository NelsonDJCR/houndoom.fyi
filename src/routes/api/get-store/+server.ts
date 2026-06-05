import { json } from '@sveltejs/kit';
import { getFullCatalog } from '$lib/services/notion';
import type { RequestHandler } from './$types';

function clearStore(catalog: Awaited<ReturnType<typeof getFullCatalog>>) {
	const shuffledPacks = [...catalog.packs].sort(() => Math.random() - 0.5);
	const randomPack = shuffledPacks.slice(0, 1);
	const shuffledItems = [...catalog.items].sort(() => Math.random() - 0.5);
	const randomItems = shuffledItems.slice(0, 4);
	return { pack: randomPack, items: randomItems };
}

export const GET: RequestHandler = async () => {
	try {
		const store = await getFullCatalog();
		const clearedStore = clearStore(store);
		return json(clearedStore);
	} catch (error) {
		console.error('Error fetching store data:', error);
		return json({ error: 'Failed to fetch store data' }, { status: 500 });
	}
};