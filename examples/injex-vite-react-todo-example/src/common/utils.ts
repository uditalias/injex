const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function guid(len: number = 8): string {
	let g = "";
	for (let i = 0; i < len; i++) {
		g += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
	}

	return g;
}

export function pluralize(count: number, word: string): string {
	return count === 1 ? word : word + 's';
}