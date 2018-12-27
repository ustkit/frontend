import './Enter.scss';

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Cookies from 'js-cookie';
import config from '../../config';

class Enter extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            txtEnter: '',
            txtRegistration: '',
            txtUserName: '',
            txtEmail: '',
            txtPassword: '',
            txtRepeatPassword: '',
            txtNoMatchPassword: '',
            txtButtonEnter: '',
            txtButtonRegistration: '',
            txtInvalidEmail: '',
            txtEmptyUserName: '',
            txtEmptyPassword: '',
            txtFailEnter: [],
            txtFailReg: [],
            txtSystemError: '',
            txtWait: '',
            messageEnter: '',
            messageRegistration: '',
            enterUserName: '',
            enterPassword: '',
            regEmail: '',
            regPassword: '',
            regRepeatPassword: ''
        };
    }
    
    componentDidMount() {
        const lang = (navigator.languages ? navigator.languages[0] : navigator.language) === 'ru' ? 'ru' : 'en';
        fetch(`/resources/locale/${lang}/enter.json`)
            .then(response => response.json())
            .then(data => this.setState(data));
    }
    
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    
    handleButtonClick = (event) => {
        switch (event.target.name) {
            case 'enter':
                this.authorization(this.state.enterUserName, this.state.enterPassword);
                break;
            case 'registration':
                this.registration(this.state.regEmail, this.state.regPassword, this.state.regRepeatPassword);
                break;
        }
    };
    
    validateAuthParams = (userName, password) => {
        if (!userName.trim().length) {
            return this.state.txtEmptyUserName;
        }
        if (!password.trim().length) {
            return this.state.txtEmptyPassword;
        }
        return '';
    };
    
    validateRegParams = (email, password, repeatPassword) => {
        if (!/([a-zA-Z0-9-_\\.]+)(@)([a-zA-Z0-9-_\\.]+)\.([a-z]{2,})/.test(email)) {
            return this.state.txtInvalidEmail;
        }
        if (!password.trim().length || !repeatPassword.trim().length) {
            return this.state.txtEmptyPassword;
        }
        if (password !== repeatPassword) {
            return this.state.txtNoMatchPassword;
        }
        return '';
    };
    
    saveAuthData = (email, token) => {
        Cookies.set('user', {email: email, token: token});
    };
    
    processAuthResponse = (response) => {
        switch (response.status) {
            case 302:
                this.saveAuthData(this.state.enterUserName, response['token']);
                this.props.history.push('/cabinet');
                break;
            case 422:
                this.setState({
                    messageEnter: this.state.txtFailEnter[response.status - 422]
                });
                break;
        }
    };
    
    processRegResponse = (response) => {
        switch (response.status) {
            case 201:
                this.saveAuthData(this.state.regEmail, response['token']);
                this.props.history.push('/cabinet');
                break;
            case 422:
            case 423:
            case 424:
            case 425:
                this.setState({
                    messageRegistration: this.state.txtFailReg[response.status - 422]
                });
                break;
        }
    };
    
    authorization = (userName, password) => {
        const errors = this.validateAuthParams(userName, password);
        if (errors === '') {
            this.setState({
                messageEnter: this.state.txtWait
            });
            // Запрос авторизации
            fetch(`${config.api}/sign_in`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': userName,
                    'password': password
                })
            }).then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.statusText);
                }
                return response.json()
            }).then((data) => {
                this.processAuthResponse(data);
            }).catch(error => {
                this.setState({
                    messageEnter: this.state.txtSystemError
                });
                console.log(error);
            });
        } else {
            this.setState({
                messageEnter: errors
            });
        }
    };
    
    registration = (email, password, repeatPassword) => {
        const errors = this.validateRegParams(email, password, repeatPassword);
        if (errors === '') {
            this.setState({
                messageRegistration: this.state.txtWait
            });
            // Запрос регистрации
            fetch(`${config.api}/sign_up`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password,
                    'password_confirmation': password
                })
            }).then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then((data) => {
                this.processRegResponse(data);
            }).catch(error => {
                this.setState({
                    messageRegistration: this.state.txtSystemError
                });
                console.log(error)
            });
        } else {
            this.setState({
                messageRegistration: errors
            });
        }
    };
    
    render() {
        const {enterUserName, enterPassword, regEmail, regPassword, regRepeatPassword} = this.state;
        return (
            <div>
                <div className="enter-section">
                    <div className="title-block">
                        {this.state.txtEnter}
                    </div>
                    <div className="input-blocks">
                        <input name="enterUserName"
                               type="text"
                               value={enterUserName}
                               onChange={this.handleInputChange}
                               placeholder={this.state.txtUserName}/>
                        <input name="enterPassword"
                               type="password"
                               value={enterPassword}
                               onChange={this.handleInputChange}
                               placeholder={this.state.txtPassword}/>
                        <div className="error-message">{this.state.messageEnter}</div>
                    </div>
                    <button name="enter" onClick={this.handleButtonClick}>
                        {this.state.txtButtonEnter}
                    </button>
                </div>
                <div className="registration-section">
                    <div className="title-block">
                        {this.state.txtRegistration}
                    </div>
                    <div className="input-blocks">
                        <input name="regEmail"
                               type="text"
                               value={regEmail}
                               onChange={this.handleInputChange}
                               placeholder={this.state.txtEmail}/>
                        <input name="regPassword"
                               type="password"
                               value={regPassword}
                               onChange={this.handleInputChange}
                               placeholder={this.state.txtPassword}/>
                        <input name="regRepeatPassword"
                               type="password"
                               value={regRepeatPassword}
                               onChange={this.handleInputChange}
                               placeholder={this.state.txtRepeatPassword}/>
                        <div className="error-message">{this.state.messageRegistration}</div>
                    </div>
                    <button name="registration" onClick={this.handleButtonClick}>
                        {this.state.txtButtonRegistration}
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(Enter);
