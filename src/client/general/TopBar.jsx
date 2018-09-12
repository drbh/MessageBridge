import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import {GlobalStyles} from "../services/GlobalStyles";
import ColorService from "../services/ColorService";

const Layout = {
	topBarHeight: 70,
	topBarMargin: '5%',
	topBarButtonMargin: 10
};

// props
//

export class TopBar extends Component {

	render() {
		return (
			<div className={classes.topBar}>
				<div className={classes.topBarContainer}>
					<div className={classes.logo}>
						Message Bridge
					</div>
					<div className={classes.topBarButton}
						 onClick={() => {}}>
						Test
					</div>
					<div className={classes.topBarButton}>
						Test
					</div>
				</div>
			</div>
		);
	}
}

const styles = {
	topBar: {
		width: '100%',
		height: Layout.topBarHeight,
		display: 'flex',
		justifyContent: 'center'
	},
	topBarContainer: {
		width: 1000,
		margin: '0px 25px',
		display: 'flex',
		alignItems: 'flex-end'
	},
	logo: Object.assign({
		color: ColorService.indieGreen,
		flexGrow: 1
	}, GlobalStyles.clickable),
	topBarButton: Object.assign({
		color: ColorService.indieGreen,
		margin: `0px ${Layout.topBarButtonMargin}px`,
		textAlign: 'center',
		fontSize: 14
	}, GlobalStyles.clickable)
};

const {classes} = StyleService.createStyleSheet('TopBar', styles).attach();