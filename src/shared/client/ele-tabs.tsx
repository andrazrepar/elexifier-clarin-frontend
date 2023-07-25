import { useState } from "react";
import { Tab } from "@headlessui/react";

interface Props {
	originalXml: string;
	transformedResult: Record<string, unknown>;
    jsonSpec: Record<string, unknown>;
}

const EleTabs: React.FC<Props> = ({ originalXml, transformedResult, jsonSpec }) => {
	const [selectedTab, setSelectedTab] = useState("Tab 1");

	// Function to format JSON data
	const formatJSON = (json: Record<string, unknown>): string => {
		return JSON.stringify(json, null, 2);
	};

	return (
		<div
			className="w-full md:flex-auto p-4 bg-gray-100 overflow-auto flex flex-col items-start"
			style={{ maxHeight: "90vh" }}
		>
			<Tab.Group>
				<div className="flex justify-center w-full">
					<Tab.List className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
						<Tab
							className={({ selected }) =>
								`w-36 py-2.5 text-sm leading-5 font-medium 
              ${
								selected
									? "text-gray-800 bg-gray-300 shadow"
									: "text-gray-500 bg-gray-200"
							}`
							}
							onClick={() => setSelectedTab("Tab 1")}
						>
							Original XML
						</Tab>
						<Tab
							className={({ selected }) =>
								`w-36 py-2.5 text-sm leading-5 font-medium 
              ${
								selected
									? "text-gray-800 bg-gray-300 shadow"
									: "text-gray-500 bg-gray-200"
							}`
							}
							onClick={() => setSelectedTab("Tab 2")}
						>
							Result
						</Tab>
                        <Tab
							className={({ selected }) =>
								`w-36 py-2.5 text-sm leading-5 font-medium 
              ${
								selected
									? "text-gray-800 bg-gray-300 shadow"
									: "text-gray-500 bg-gray-200"
							}`
							}
							onClick={() => setSelectedTab("Tab 3")}
						>
							Spec
						</Tab>
					</Tab.List>
				</div>

				<Tab.Panels className="mt-2 w-full">
					<Tab.Panel>
						{selectedTab === "Tab 1" && (
							<pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
								{originalXml} {/* Content for Tab 1 */}
							</pre>
						)}
					</Tab.Panel>
					<Tab.Panel>
						{selectedTab === "Tab 2" && (
							<pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
								{formatJSON(transformedResult)} {/* Content for Tab 2 */}
							</pre>
						)}
					</Tab.Panel>
                    <Tab.Panel>
						{selectedTab === "Tab 3" && (
							<pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
								{formatJSON(jsonSpec)} {/* Content for Tab 2 */}
							</pre>
						)}
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default EleTabs;
