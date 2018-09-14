import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import ColorService from "../services/ColorService";
import {GlobalStyles} from "../services/GlobalStyles";

// props
// isOn: boolean
// onClick: () => void
// disabled: boolean

export class Toggle extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let onStyle = {
			backgroundColor: ColorService.enabledGreen
		};

		let onToggleCircleStyle = {
			backgroundColor: ColorService.enabledGreen,
			transform: `translateX(${Layout.toggleCircleEnabledTranformX}px)`,
		};

		let disabledStyle = {
			backgroundColor: ColorService.extraLightGrey
		};

		return (
			<div className={classes.outerDiv}
				 onClick={() => this.onClick()}
				 style={this.props.disabled ? disabledStyle : this.props.isOn ? onStyle : {}}>
				<div className={classes.innerDiv}>
					<div className={classes.toggleCircle}
						 style={this.props.disabled ? disabledStyle : this.props.isOn ? onToggleCircleStyle : {}}>
					</div>
				</div>
			</div>
		);
	}

	onClick() {
		if (this.props.disabled) {
			return;
		}

		this.props.onClick();
	}
}

class LayoutClass {
	constructor() {
		this.outerWidth = 110;
		this.outerHeight = 60;
		this.toggleBorderWidth = 5;
		this.toggleCircleDiameter = this.outerHeight - (this.toggleBorderWidth * 3);
		this.toggleCircleEnabledTranformX = this.outerWidth - (this.toggleBorderWidth * 3) - this.toggleCircleDiameter
	}
}
let Layout = new LayoutClass();

const styles = {
	outerDiv: Object.assign({
		backgroundColor: ColorService.lightGrey,
		height: Layout.outerHeight,
		width: Layout.outerWidth,
		borderRadius: Layout.toggleBorderWidth
	}, GlobalStyles.flexCentered),
	innerDiv: {
		backgroundColor: 'white',
		height: Layout.outerHeight - (Layout.toggleBorderWidth * 2),
		width: Layout.outerWidth - (Layout.toggleBorderWidth * 2),
		borderRadius: Layout.toggleBorderWidth,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	toggleCircle: {
		height: Layout.toggleCircleDiameter,
		width: Layout.toggleCircleDiameter,
		borderRadius: Layout.toggleCircleDiameter / 2,
		backgroundColor: ColorService.lightGrey,
		margin: Layout.toggleBorderWidth / 2,
		transition: 'transform 0.33s'
	}
};

const {classes} = StyleService.createStyleSheet('Toggle', styles).attach();