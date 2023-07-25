export type Organisation = {
	id: string;
	name: string;
	role: string;
};

export function getOrganisationsQuery() {
	const organisation: Organisation[] = [
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

	return organisation;
}
