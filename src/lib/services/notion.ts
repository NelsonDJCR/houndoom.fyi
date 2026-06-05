import { Client } from '@notionhq/client';
import type { Pack } from '$lib/types';
import { env } from '$env/dynamic/private';

const notion = new Client({ auth: env.NOTION_API_KEY });

function parseNumber(property: any): number {
	if (!property) return 0;
	const type = property.type;
	if (type === 'number') {
		return property.number ?? 0;
	}
	if (type === 'formula') {
		return property.formula.number ?? 0;
	}
	if (type === 'unique_id') {
		return property.unique_id?.number ?? 0;
	}
	if (type === 'rich_text') {
		const text = (property.rich_text as Array<{ plain_text: string }>)?.map((t) => t.plain_text).join('') ?? '';
		const num = parseFloat(text);
		return isNaN(num) ? 0 : num;
	}
	return 0;
}

function parseString(property: any): string {
	if (!property) return '';
	const type = property.type;
	if (type === 'title') {
		return property.title.map((t: any) => t.plain_text).join('') ?? '';
	}
	if (type === 'rich_text') {
		return property.rich_text.map((t: any) => t.plain_text).join('') ?? '';
	}
	if (type === 'url') {
		return property.url ?? '';
	}
	if (type === 'select') {
		return property.select?.name ?? '';
	}
	if (type === 'files') {
		if (property.files?.length > 0) {
			const file = property.files[0];
			if (file.type === 'external') return file.external?.url ?? '';
			if (file.type === 'file') return file.file?.url ?? '';
		}
		return '';
	}
	return '';
}

interface ItemData {
	id: number;
	name: string;
	type: string;
	thumbnail: string;
	sprite: string;
	price: number;
	damage: number;
}

export async function getStore(): Promise<{ packs: Pack[]; items: ItemData[] }> {
	const itemsResponse = await notion.databases.query({
		database_id: env.NOTION_ITEMS_DATABASE_ID,
	});

	const items = itemsResponse.results.map((page) => {
		const props = (page as any).properties;
		return {
			id: parseNumber(props['id']),
			name: parseString(props['name']),
			type: parseString(props['type']),
			thumbnail: parseString(props['thumbnail']),
			sprite: parseString(props['sprite']),
			price: parseNumber(props['price']),
			damage: parseNumber(props['damage']),
		};
	});

	const packsResponse = await notion.databases.query({
		database_id: env.NOTION_PACKS_DATABASE_ID,
	});

	const packs: Pack[] = packsResponse.results.map((page) => {
		const props = (page as any).properties;
		const itemsStr = parseString(props['items']);

		return {
			id: parseNumber(props['id']),
			name: parseString(props['name']),
			cover: parseString(props['cover']),
			price: parseNumber(props['price']),
			items: itemsStr,
		};
	});

	return { packs, items };
}