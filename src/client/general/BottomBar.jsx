import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import ColorService from "../services/ColorService";
import {GlobalStyles} from "../services/GlobalStyles";

const Layout = {
	bottomBarHeight: 75,
	bottomBarMargin: '5%',
	bottomBarButtonMargin: 10
};

// props
//

export class BottomBar extends Component {

	render() {
		return (
			<div className={classes.bottomBar}>
				<div className={classes.bottomBarContainer}>
					<div className={classes.bottomBarButton}>
						Test
					</div>
					<div className={classes.bottomBarButton}>
						Test
					</div>
					{/*<div className={classes.copyRight}>*/}
						{/*<span dangerouslySetInnerHTML={{__html: '&#169'}}></span> 2018 IndieTax LLC*/}
					{/*</div>*/}
				</div>
			</div>
		);
	}
}

const styles = {
	bottomBar: {
		width: '100%',
		height: Layout.bottomBarHeight,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		'@media (max-width: 900px)': {
			height: 'inherit'
		}
	},
	bottomBarContainer: {
		width: 950,
		margin: '0px 25px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		'@media (max-width: 900px)': {
			flexDirection: 'column'
		}
	},
	logo: {
		color: ColorService.indieGreen,
		flexGrow: 1
	},
	logoImage: {
		height: 40
	},
	bottomBarButton: Object.assign({
		color: ColorService.grey,
		textAlign: 'center',
		fontSize: 16,
		margin: '0px 60px',
		'@media (max-width: 900px)': {
			margin: '10px 5px'
		}
	}, GlobalStyles.clickable)
};

const {classes} = StyleService.createStyleSheet('TopBar', styles).attach();