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
		this.isOn = false;
	}

	componentDidMount() {
		// this method should update the variables on the class with a server call and then call force update
		// could be multiple calls that each update a variable and call force update independently

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

		let onTextStyle = {
			color: ColorService.enabledGreen
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
					<Toggle isOn={this.isOn}
							onClick={() => this.toggleEnabled()}
							disabled={!this.isIMessageConnected || !this.isSlackConnected}/>
					<div className={classes.onOffText}
						 style={this.isOn ? onTextStyle : {}}>
						{this.isOn ? 'on' : 'off'}
					</div>
				</div>
			</div>
		);
	}

	toggleEnabled() {
		// this should call start or stop based on this.isEnabled
		// when the call returns it should set this.isEnabled correctly and then call this.forceUpdate()

		this.isOn = !this.isOn;
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
	onOffText: {
		color: ColorService.extraLightGrey,
		margin: 10
	}
};

const {classes} = StyleService.createStyleSheet('Home', styles).attach();