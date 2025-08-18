import React, { Component } from "react";

import { withTranslation } from "react-i18next";

import Corousel from "./Corousel";
class Hero extends Component {
    constructor(props) {
        super(props);
        this.bgImg = React.createRef();
    }

    render() {
        // t is injected into props by withTranslation
        const { t } = this.props;
        return (
            <div className="hero">
                <Corousel />
            </div>
        );
    }
}

export default withTranslation()(Hero);
