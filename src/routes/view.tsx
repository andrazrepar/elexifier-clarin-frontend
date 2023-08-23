import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import eleApiService from "../shared/ele-api-service";

export async function loader({
	request,
	params: { organisationId, dictionaryId },
}: LoaderFunctionArgs) {
	const dmEntryResponse = await eleApiService.getDmEntry("40");
	const dmEntry = await dmEntryResponse.json();

	return dmEntry;
}

export function ViewDictionary() {
	const testJson = useLoaderData();
	console.log(testJson);

	return (
		<div className="flex flex-col md:flex-row">
			<div className="w-full">
				<div
					className="w-full md:flex-auto p-4 bg-gray-100 overflow-auto flex flex-col items-start"
					style={{ maxHeight: "90vh" }}
				>
					<pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
						{JSON.stringify(testJson, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}
