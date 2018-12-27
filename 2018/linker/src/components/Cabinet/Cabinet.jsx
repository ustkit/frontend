import './Cabinet.scss';

import React, {Component, Fragment} from 'react';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import ReactImageFallback from 'react-image-fallback';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CollectionForm from '../CollectionForm/CollectionForm';
import Profile from '../Profile/Profile';
import Logo from '../../images/logo.png';
import ArrowLeft from '../../images/arrow-left.png';
import Plus from '../../images/plus.png';
import Loading from '../../images/loading.svg';
import Clipboard from '../../images/copy.png';
import config from '../../config';

export default class Cabinet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtMyCollections: '',
            txtProfile: '',
            txtCollectionLink: '',
            txtBack: '',
            txtCopyCollectionLink: '',
            txtLinkIsCopied: '',
            user: Cookies.getJSON('user'),
            collections: [],
            isCollectionFormOpened: false,
            isProfileOpened: false,
            selectedCollection: '0',
            isLinkCopied: false
        };
    }
    
    componentDidMount() {
        if (this.state.user === undefined) {
            this.props.history.push('/');
            return;
        }
        this.getCollections();
        const lang = (navigator.languages ? navigator.languages[0] : navigator.language) === 'ru' ? 'ru' : 'en';
        fetch(`/resources/locale/${lang}/cabinet.json`)
            .then(response => response.json())
            .then(data => this.setState(data));
    }
    
    getCollections = () => {
        fetch(`${config.api}/collections`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Token': this.state.user.token,
                'X-User-Email': this.state.user.email
            }
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json()
        }).then((collections) => {
            this.setState({
                collections: collections
            })
        }).catch(() => {
            this.props.history.push('/');
        });
    };
    
    toggleProfileModal = () => {
        this.setState({isProfileOpened: !this.state.isProfileOpened})
    };
    
    onClickCollectionBlock = (event) => {
        if (event.target.className === 'clipboard-img') {
            this.setState({isLinkCopied: true});
            setTimeout(() => {
                this.setState({isLinkCopied: false});
            }, 2000);
            return;
        }
        this.setState({
            selectedCollection: event.currentTarget.getAttribute('data-collection'),
            isCollectionFormOpened: true
        });
    };
    
    closeCollectionForm = () => {
        this.setState({
            selectedCollection: '0',
            isCollectionFormOpened: false
        });
        this.getCollections();
    };
    
    render() {
        const {collections, selectedCollection} = this.state;
        const collectionFormClass = classNames(
            'collection-form',
            {'hidden': !this.state.isCollectionFormOpened}
        );
        const profileModalClass = classNames(
            'profile',
            {'hidden': !this.state.isProfileOpened}
        );
        const copyLinkFlashClass = classNames(
            'on-copy-link-flash',
            {'hidden': !this.state.isLinkCopied}
        );
        if (this.state.user === undefined) {
            return null;
        } else {
            return (
                <div className="cabinet">
                    <div className="header">
                        <div className="logo"><Link to={'/'}><img src={Logo} alt="logo"/></Link></div>
                        {
                            this.state.isCollectionFormOpened ?
                                <div className="header-link" onClick={this.closeCollectionForm}>
                                    <span><img src={ArrowLeft} alt="back"/>{this.state.txtBack}
                                        <div className="highlighting"/></span>
                                </div> :
                                <div className="header-link" onClick={this.toggleProfileModal}>
                                    {
                                        this.state.isProfileOpened ?
                                            <span><img src={ArrowLeft} alt="back"/>{this.state.txtBack}
                                                <div className="highlighting"/></span> :
                                            <span>{this.state.txtProfile}
                                                <div className="highlighting"/></span>
                                    }
                                </div>
                        }
                    </div>
                    <div className={copyLinkFlashClass}>
                        {this.state.txtLinkIsCopied}
                    </div>
                    <div className="content">
                        {
                            !this.state.isCollectionFormOpened && !this.state.isProfileOpened ?
                                <Fragment>
                                    <div className="content-menu">
                                        <span>{this.state.txtMyCollections}</span>
                                        <div data-collection="0" onClick={this.onClickCollectionBlock}>
                                            <img src={Plus} alt="New collection"/>
                                        </div>
                                    </div>
                                    {
                                        Array.from(collections).map((collection, collectionIdx) =>
                                            <Fragment key={collectionIdx}>
                                                <div
                                                    className="collection-block"
                                                    data-collection={collection.id}
                                                    onClick={this.onClickCollectionBlock}>
                                                    <div className="collection-name">
                                                        {collection.name}
                                                    </div>
                                                    <CopyToClipboard
                                                        text={config.collectionBaseUrl + collection.url}>
                                                        <div className="collection-url-clipboard"
                                                             title={this.state.txtCopyCollectionLink}>
                                                            <img
                                                                className="clipboard-img"
                                                                src={Clipboard}
                                                                alt="Copy collection url to clipboard"/>
                                                        </div>
                                                    </CopyToClipboard>
                                                    <div className="collection-comment">
                                                        {collection.comment}
                                                    </div>
                                                    <div className="collection-links">
                                                        {
                                                            Array.from(collection.links).map((link, idx) =>
                                                                <Fragment key={idx}>
                                                                    <div>
                                                                        <ReactImageFallback
                                                                            src={config.thumbs + link.url}
                                                                            alt={`thums-${collectionIdx}-${idx}`}
                                                                            initialImage={Loading}
                                                                            fallbackImage=""
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                </Fragment> :
                                ''
                        }
                        {
                            this.state.isCollectionFormOpened ?
                                <div className={collectionFormClass}>
                                    <CollectionForm id={selectedCollection} onClose={this.closeCollectionForm}/>
                                </div> :
                                ''
                        }
                        {
                            this.state.isProfileOpened ?
                                <div className={profileModalClass}>
                                    <Profile/>
                                </div> :
                                ''
                        }
                    </div>
                </div>
            );
        }
    }
}
