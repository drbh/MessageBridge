import React, { Component } from 'react';
import StyleService from "../services/StyleService";
import ColorService from "../services/ColorService";
import {GlobalStyles} from "../services/GlobalStyles";
import ServerService from "../services/ServerService";
import {Toggle} from "../general/Toggle.jsx";

export class Home extends Component {

	constructor(props) {
		super(props);
		this.isSlackConnected = false;
		this.isIMessageConnected = false;
		this.isEnabled = false;
	}

	componentDidMount() {
		// this method should update the variables on the class with a server call and then call force update

		// ServerService.postJson('/isSlackConnected').then((response) => {
		// 	this.isSlackConnected = response.isSlackConnected;
		// 	this.forceUpdate();
		// })
	}

	render() {

		let iMessageStatusStyle = {
			backgroundColor: this.isIMessageConnected ? ColorService.enabledGreen : ColorService.disabledRed
		};

		let slackStatusStyle = {
			backgroundColor: this.isSlackConnected ? ColorService.enabledGreen : ColorService.disabledRed
		};

		return (
			<div className={classes.outerDiv}>
				<div className={classes.statusDiv}>
					<div className={classes.iMessageStatus}
						 onClick={() => {
						 	this.isIMessageConnected = !this.isIMessageConnected;
						 	this.forceUpdate();
						 }}
						 style={iMessageStatusStyle}>
						<div className={classes.iMessageLogoContainer}>
							iMessage
						</div>
					</div>
					<div className={classes.slackStatus}
						 onClick={() => {
						 	this.isSlackConnected = !this.isSlackConnected;
						 	this.forceUpdate();
						 }}
						 style={slackStatusStyle}>
						<div className={classes.slackLogoContainer}>
							Slack
						</div>
					</div>
				</div>
				<div className={classes.statusButtonContainer}>
					<Toggle isOn={this.isEnabled}
							onClick={() => this.toggleEnabled()}
							disabled={!this.isIMessageConnected || !this.isSlackConnected}/>
				</div>
			</div>
		);
	}

	toggleEnabled() {
		this.isEnabled = !this.isEnabled;
		this.forceUpdate();
	}
}


const styles = {
	outerDiv: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	statusDiv: {
		display: 'flex',
		marginTop: 100
	},
	iMessageStatus: Object.assign({
		width: 175,
		height: 225,
		overflow: 'hidden',
		borderRadius: 8,
		margin: 50
	}, GlobalStyles.flexCentered),
	iMessageLogoContainer: Object.assign({
		width: 175,
		height: 175,
		overflow: 'hidden',
		borderRadius: 8,
		backgroundColor: ColorService.lightGrey
	}, GlobalStyles.flexCentered),
	slackStatus: Object.assign({
		width: 175,
		height: 225,
		overflow: 'hidden',
		borderRadius: 8,
		margin: 50
	}, GlobalStyles.flexCentered),
	slackLogoContainer: Object.assign({
		width: 175,
		height: 175,
		overflow: 'hidden',
		borderRadius: 8,
		backgroundColor: ColorService.lightGrey
	}, GlobalStyles.flexCentered),
	statusButtonContainer: {

	},
	statusButton: {

	}
};

const {classes} = StyleService.createStyleSheet('Home', styles).attach();