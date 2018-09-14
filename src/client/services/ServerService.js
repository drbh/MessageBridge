
let instance = null;

class ServerService {

	constructor() {
		this.baseServerUrl = 'host:port';
	}

	get instance() {
		if (!instance) {
			instance = new ServerService();
		}
		return instance;
	}

	typicalServiceMethod(arg1, arg2) {
		let path = '/typicalPath';
		let jsonData = {
			arg1: arg1,
			arg2: arg2
		};

		return this.postJson(path, jsonData);
		// return this.getJson(path, jsonData);
	}

	getAppStatus() {
		return this.getJson('/app-status', {});
	}

	startApp() {
		return this.getJson('/start', {});
	}

	stopApp() {
		return this.getJson('/stop', {});
	}

	postJson(requestPath, json) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open("POST", this.baseServerUrl + '/' + requestPath, true);

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

	getJson(requestPath, params) {
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
			xhr.open("GET", this.baseServerUrl + '/' + requestPath + paramsString, true);

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

export default ServerService;