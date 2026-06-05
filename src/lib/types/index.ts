export interface Pack {
	id: number;
	name: string;
	cover: string;
	price: number;
	items: string; // comma-separated IDs like "1,2"
}

export interface Item {
	id: number;
	name: string;

	/**
	 * Possible values:
	 * - armor
	 * - sword
	 */
	type: string;

	thumbnail: string;
	sprite: string;

	price: number;
	damage: number;
}