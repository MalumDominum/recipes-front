import { useReducer } from "react";

export default function useValueSaver(initialState) {
	const reducer = (state, action) => {
		switch (action.type) {
			case "set-field-value":
				return {
					...state,
					[action.payload.name]: action.payload.value,
				};
			case "set-all-field-values":
				return {
					...action.payload.value,
				};
			case "concat-field-value":
				return {
					...state,
					[action.payload.name]: state[action.payload.name].concat(action.payload.value),
				};
			case "remove-field-value":
				const index = state[action.payload.name].indexOf(action.payload.value);

				if (index > -1) state[action.payload.name].splice(index, 1);

				return state;
			default:
				throw new Error("Unknown action");
		}
	};

	const [fields, dispatch] = useReducer(reducer, initialState);

	const onSetValue = (event, manual) => {
		dispatch(
			manual
				? {
						type: manual.type,
						payload: {
							name: manual.name,
							value: manual.value,
						},
				  }
				: {
						type: "set-field-value",
						payload: {
							name: event.target.name,
							value: event.target.value,
						},
				  }
		);
	};

	return [fields, onSetValue];
}
