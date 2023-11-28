const JsonResult = ({ result }) => {
	return (
		<div className="w-full p-4 bg-gray-100 overflow-auto max-h-96">
			<pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
				{JSON.stringify(result, null, 2)}
			</pre>
		</div>
	);
};

export default JsonResult;
