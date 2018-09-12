import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import ColorService from "../services/ColorService";
import {GlobalStyles} from "../services/GlobalStyles";

export class Home extends Component {

	render() {
		return (
			<div className={classes.outerDiv}>

			</div>
		);
	}
}


const styles = {
	outerDiv: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
};

const {classes} = StyleService.createStyleSheet('Home', styles).attach();