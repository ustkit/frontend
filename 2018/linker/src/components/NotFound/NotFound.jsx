import './NotFound.scss';

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../images/logo.png';
import ImageNotFound from '../../images/not-found.png';

export default class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtNotFoundMessage: ''
        }
    }
    
    componentDidMount() {
        const lang = (navigator.languages ? navigator.languages[0] : navigator.language) === 'ru' ? 'ru' : 'en';
        fetch(`/resources/locale/${lang}/not-found.json`)
            .then(response => response.json())
            .then(data => this.setState(data));
    }
    
    render() {
        return (
            <div className="notfound">
                <div className="header">
                    <div className="logo"><Link to={'/'}><img src={Logo} alt="logo"/></Link></div>
                </div>
                <div className="content">
                    <img src={ImageNotFound} alt="404"/>
                    <h1>{this.state.txtNotFoundMessage}</h1>
                </div>
            </div>
        )
    }
};
