import './Profile.scss';

import React, {PureComponent, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import Cookies from 'js-cookie';
import config from '../../config';

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: Cookies.getJSON('user'),
            currentPassword: '',
            newPasswordFirst: '',
            newPasswordSecond: '',
            flashMessage: '',
            txtSuccessfulChangePassword: '',
            txtFailChangePassword: '',
            txtTitle: '',
            txtCurrentPassword: '',
            txtNewPasswordFirst: '',
            txtNewPasswordSecond: '',
            txtChangePassword: '',
            txtLogout: ''
        };
    }
    
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    
    setFlashMessage = (message) => {
        this.setState({
            flashMessage: message
        })
    };
    
    updatePassword = () => {
        this.setFlashMessage('');
        fetch(`${config.api}/profile/password`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Token': this.state.user.token,
                'X-User-Email': this.state.user.email
            },
            body: JSON.stringify({
                'current_password': this.state.currentPassword,
                'new_password_1': this.state.newPasswordFirst,
                'new_password_2': this.state.newPasswordSecond
            })
        }).then((response) => {
            if (response.status === 200) {
                this.setFlashMessage(this.state.txtSuccessfulChangePassword);
            } else {
                this.setFlashMessage(this.state.txtFailChangePassword);
            }
        }).catch(() => {
            this.setFlashMessage(this.state.txtFailChangePassword);
        });
    };
    
    logout = () => {
        fetch(`${config.api}/sign_out`, {
            method: 'DELETE',
            headers: {
                'X-User-Token': this.state.user.token,
                'X-User-Email': this.state.user.email
            }
        }).then(() => {
            Cookies.remove('user');
            this.props.history.push('/');
        }).catch(() => {
            this.props.history.push('/');
        });
    };
    
    onChangePassword = () => {
        this.updatePassword();
    };
    
    onLogout = () => {
        this.logout();
    };
    
    componentDidMount() {
        if (this.state.user === undefined) {
            this.props.history.push('/');
            return;
        }
        const lang = (navigator.languages ? navigator.languages[0] : navigator.language) === 'ru' ? 'ru' : 'en';
        fetch(`/resources/locale/${lang}/profile.json`)
            .then(response => response.json())
            .then(data => this.setState(data));
    }
    
    render() {
        const {currentPassword, newPasswordFirst, newPasswordSecond, flashMessage} = this.state;
        return (
            <Fragment>
                <div className="profile-head">
                    <div>{this.state.txtTitle}</div>
                    <div>{flashMessage}</div>
                </div>
                <input name="currentPassword"
                       type="password"
                       value={currentPassword}
                       onChange={this.handleInputChange}
                       placeholder={this.state.txtCurrentPassword}/>
                <input name="newPasswordFirst"
                       type="password"
                       value={newPasswordFirst}
                       onChange={this.handleInputChange}
                       placeholder={this.state.txtNewPasswordFirst}/>
                <input name="newPasswordSecond"
                       type="password"
                       value={newPasswordSecond}
                       onChange={this.handleInputChange}
                       placeholder={this.state.txtNewPasswordSecond}/>
                <div className="profile-buttons">
                    <button onClick={this.onChangePassword}>{this.state.txtChangePassword}</button>
                    <button onClick={this.onLogout}>{this.state.txtLogout}</button>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Profile);
