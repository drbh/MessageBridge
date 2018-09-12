import React, { Component } from 'react';
import StyleService from "./services/StyleService";
import {TopBar} from "./general/TopBar.jsx";
import {Home} from "./pages/Home.jsx";
import {IMessageSetup} from "./pages/IMessageSetup.jsx";
import {SlackSetup} from "./pages/SlackSetup.jsx";
import {BottomBar} from "./general/BottomBar.jsx";

export class App extends Component {

	constructor(props) {
		super(props);

		this.isShowingIMessage = false;
		this.isShowingSlack = false;
	}

	componentDidMount() {

	}

	renderAppContent() {
		if (this.isShowingIMessage) {
			return <IMessageSetup />
		}
		else if (this.isShowingSlack) {
			return <SlackSetup />
		}

		return <Home />
	}

	render() {
		return (
			<div className={classes.outerDiv}>
				<TopBar />
				<div className={classes.content}>
					{this.renderAppContent()}
				</div>
				<BottomBar/>
			</div>
		);
	}
}

const styles = {
	outerDiv: {
		minHeight: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		display: 'flex',
		flexDirection: 'column',
		fontFamily: 'Poppins'
	},
	content: {
		flexGrow: 1
	}
};

const {classes} = StyleService.createStyleSheet('App', styles).attach();