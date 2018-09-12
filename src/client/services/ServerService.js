
class ServerService {

	postJson(requestPath, json) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open("POST", '/' + requestPath, true);

			xhr.setRequestHeader('Content-Type' , 'application/json ; charset=UTF-8' );

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					switch (xhr.status) {
						case 200:
							let jsonData = JSON.parse(xhr.responseText);
							resolve(jsonData);
							break;
						default:
							reject(xhr.status + ": " + xhr.response);
							break;
					}
				}
			};
			xhr.send(JSON.stringify(json));
		});
	}

	// static getRequest(requestPath, params, successCompletion, errorCompletion) {
	// 	let paramsString = '';
	//
	// 	if (params) {
	// 		paramsString += '?';
	// 		for (let i = 0; i < Object.keys(params).length; i++) {
	// 			let paramKey = Object.keys(params)[i];
	// 			paramsString += paramKey + '=' + params[paramKey];
	// 			if (i != Object.keys(params).length - 1) paramsString += '&';
	// 		}
	// 	}
	//
	// 	let xhr = new XMLHttpRequest();
	// 	xhr.open("GET", '/' + requestPath + paramsString, true);
	//
	// 	xhr.onreadystatechange = () => {
	// 		if (xhr.readyState === 4) {
	// 			switch (xhr.status) {
	// 				case 200:
	// 					successCompletion(xhr);
	// 					break;
	// 				default:
	// 					errorCompletion(xhr);
	// 					break;
	// 			}
	// 		}
	// 	};
	// 	xhr.send();
	// }
	//
	// getJson(requestPath, params) {
	// 	return new Promise((resolve, reject) => {
	// 		ServerService.getRequest(requestPath, params, (xhr) => {
	// 			let jsonData = JSON.parse(xhr.responseText);
	// 			resolve(jsonData);
	// 		}, (xhr) => {
	// 			reject(xhr.status + ": " + xhr.response);
	// 		});
	// 	});
	// }
}

export default new ServerService();