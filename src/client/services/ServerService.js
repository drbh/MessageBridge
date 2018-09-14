
class ServerService {

	typicalServiceMethod(arg1, arg2) {
		let path = '/typicalPath';
		let jsonData = {
			arg1: arg1,
			arg2: arg2
		};

		return this.postJson(path, jsonData);
		// return this.getJson(path, jsonData);
	}

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

	static getJson(requestPath, params) {
		return new Promise((resolve, reject) => {
			let paramsString = '';

			if (params) {
				paramsString += '?';
				for (let i = 0; i < Object.keys(params).length; i++) {
					let paramKey = Object.keys(params)[i];
					paramsString += paramKey + '=' + params[paramKey];
					if (i != Object.keys(params).length - 1) paramsString += '&';
				}
			}

			let xhr = new XMLHttpRequest();
			xhr.open("GET", '/' + requestPath + paramsString, true);

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					switch (xhr.status) {
						case 200:
							let jsonData = JSON.parse(xhr.responseText);
							resolve(jsonData);
							break;
						default:
							reject();
							break;
					}
				}
			};
			xhr.send();
		});
	}
}

export default new ServerService();