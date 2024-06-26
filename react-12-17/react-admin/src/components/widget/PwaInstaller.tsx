/*
 * File: PwaInstaller.js
 * Desc: pwa手动触发安装
 * File Created: 2018-11-07 21:13:18
 * Author: chenghao
 *
 * Copyright 2018 - present, chenghao
 */
import React, { Component } from 'react';
import { CommentOutlined, CustomerServiceOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
//import { FloatButton } from 'antd';
class PwaInstaller extends Component {
    state = {
        installed: false,
    };
    componentDidMount() {
        window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt);
    }
    componentWillUnmount() {
        window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt);
    }
    deferredPrompt: any;
    beforeInstallPrompt = (e: Event) => {
        console.log('beforeinstallprompt Event fired');
        // 未安装PWA应用
        this.setState({ installed: false });

        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        return false;
    };
    download = () => {
        if (this.deferredPrompt !== undefined) {
            // The user has had a postive interaction with our app and Chrome
            // has tried to prompt previously, so let's show the prompt.
            this.deferredPrompt.prompt();
            // Follow what the user has done with the prompt.
            this.deferredPrompt.userChoice.then((choiceResult: any) => {
                console.log(choiceResult.outcome);
                if (choiceResult.outcome === 'dismissed') {
                    console.log('User cancelled home screen install');
                } else {
                    console.log('User added to home screen');
                }
                // We no longer need the prompt.  Clear it up.
                this.deferredPrompt = null;
            });
        }
    };
    render() {
        const { installed } = this.state;
        return (
            !installed && (
                <div className="installer" onClick={this.download}>
                    <div className="installer__btn" />
                    {/* <Button icon={<DownloadOutlined />}onClick={this.download}/> */}
                </div>
            )
        );
    }
}

export default PwaInstaller;
