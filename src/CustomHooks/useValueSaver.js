import { useReducer } from "react";

export default function useValueSaver(initialState) {
	const reducer = (state, action) => {
		switch (action.type) {
			case "set-field-value":
				return {
					...state,
					[action.payload.name]: action.payload.value,
				};

			default:
				throw new Error("Unknown action");
		}
	};

	const [fields, dispatch] = useReducer(reducer, initialState);

	const onSetValue = (event) => {
		dispatch({
			type: "set-field-value",
			payload: {
				name: event.target.name,
				value: event.target.value,
			},
		});
	};

	return [fields, onSetValue];
}
