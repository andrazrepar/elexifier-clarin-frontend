export type Dictionary = {
	id: string;
	name: string;
	role: string;
};

export function getOrganisationDictionaries() {
	const dictionary: Dictionary[] = [
		{
			id: "1",
			name: "Organisation 1",
			role: "member",
		},
		{
			id: "2",
			name: "Organisation 2",
			role: "owner",
		},
	];

	return dictionary;
}
