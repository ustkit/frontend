import './Info.scss';

import React, {PureComponent} from 'react';

export default class Info extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            txtInfoMessageHeader: '',
            txtInfoMessage: {__html: ''}
        };
    }
    
    componentDidMount() {
        const lang = (navigator.languages ? navigator.languages[0] : navigator.language) === 'ru' ? 'ru' : 'en';
        fetch(`/resources/locale/${lang}/info.json`)
            .then(response => response.json())
            .then(data => {
                const html = data.txtInfoMessage.__html.join("");
                this.setState({
                    txtInfoMessageHeader: data.txtInfoMessageHeader,
                    txtInfoMessage: {__html: html}
                })
            });
    }
    
    render() {
        return (
            <div>
                <div className="info-message-header">{this.state.txtInfoMessageHeader}</div>
                <div className="info-message">
                    <div dangerouslySetInnerHTML={this.state.txtInfoMessage}/>
                </div>
            </div>
        );
    }
}
