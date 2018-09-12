import preset from 'jss-preset-default';
import jss from 'jss';

class StyleService {

	constructor() {
		this.isSetup = false;
	}

	setupJSS() {
		jss.setup(preset());
		this.isSetup = true;
	}

	createStyleSheet(name, rules) {
		if (!this.isSetup) {
			this.setupJSS();
		}
		return jss.createStyleSheet(rules, {meta: name}).attach();
	}
}

export default new StyleService();