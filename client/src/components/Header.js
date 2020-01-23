import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payment from './Payment';

class Header extends Component {
    renderContent(){
        switch(this.props.auth){
            case null:
                return;
            case false:
                return (
                    <React.Fragment>
                        <li><a href="/auth/google">Login With Google</a></li>
                        <li><a href="/auth/facebook">Login With Facebook</a></li>
                    </React.Fragment>
                )
            default:
                return (
                    <React.Fragment>
                        <li>
                            <a href="/" className="waves-effect waves-light btn-large" style={{padding: "0 0.5rem", margin: "0 0"}}><img src={this.props.auth.image} alt="" className="circle responsive-img" style={{maxHeight: "48px", verticalAlign: "middle", marginRight: ".5em"}}/>
                                {this.props.auth.displayName}
                            </a>
                        </li>
                        <li style={{ margin: '0 10px' }}>Credits: {this.props.auth.credits}</li>
                        <li><Payment /></li>
                        <li><a href="/api/logout">Logout</a></li>
                    </React.Fragment>
                )
        }
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link 
                        to={this.props.auth ? '/surveys':'/'} 
                        className="left brand-logo"
                    >
                        Tertis
                    </Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }){
    return { auth };
}

export default connect(mapStateToProps)(Header);