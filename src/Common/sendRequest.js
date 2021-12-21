export default async function sendRequest(credentials, url, httpMethod) {
	return fetch(url, {
		method: httpMethod,
		headers: {
			"Content-Type": "application/json",
		},
		headers: { "Access-Control-Allow-Credentials": true, accept: "text/plain", "Content-Type": "application/json" },
		body: credentials ? JSON.stringify(credentials) : null,
		credentials: "include",
	}).then((response) => {
		if (response.ok) return response.json();
		else throw new Error(response);
	});
}
