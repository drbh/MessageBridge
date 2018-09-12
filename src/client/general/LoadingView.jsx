import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import CircularProgress from '@material-ui/core/CircularProgress';
import ColorService from "../services/ColorService";

// props
// text - string
// largeText - boolean

export class LoadingView extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {

	}

	render() {
		let textStyles = {};
		if (this.props.largeText) {
			textStyles.fontSize = 24;
		}
		return (
			<div className={classes.outerDiv}>
				<div className={classes.text}
					 style={textStyles}>
					{this.props.text}
				</div>
				<CircularProgress className={classes.progress}
								  color="primary"
								  size={100} />
			</div>
		);
	}
}


const styles = {
	outerDiv: {
		margin: 40,
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: ColorService.indieGreen,
		fontSize: 16
	},
	progress: {
		color: ColorService.indieGreen
	}
};

const {classes} = StyleService.createStyleSheet('LoadingView', styles).attach();