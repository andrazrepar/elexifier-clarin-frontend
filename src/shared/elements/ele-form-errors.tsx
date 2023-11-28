import React from "react";

interface EleErrorProps {
	errors?: string[] | null;
}

/**
 * EleError component displays error messages in a list.
 *
 * @example
 * <EleError errors={['Error message 1', 'Error message 2']} />
 */
export const EleFormErrors: React.FC<EleErrorProps> = ({ errors }) => {
	return (
		<>
			{errors?.map((errMsg, index) => (
				<p key={index} className="mt-2 text-sm text-red-600">
					{errMsg}
				</p>
			))}
		</>
	);
};
