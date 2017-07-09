// Copyright 2017 The Rustw Project Developers.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import React from 'react';
import ReactDOM from 'react-dom';

const { Menu, MenuHost } = require('./menus');

class TopBar extends React.Component {
    render() {
        let visibleHomeLink = null;
        let visibleBrowseLink = null;
        let indicatorStatus = null;
        let buildState = this.props.state;
        let clickBuild = null;
        if (this.props.state == "fresh") {
            clickBuild = this.props.callbacks.doBuild;
        } else if (this.props.state == "building") {
            indicatorStatus = true;
        } else if (this.props.state == "built") {
            visibleBrowseLink = true;
            clickBuild = this.props.callbacks.doBuild;
        } else if (this.props.state == "builtAndNavigating") {
            visibleBrowseLink = true;
            visibleHomeLink = true;
            buildState = "built";
            clickBuild = this.props.callbacks.doBuild;
        }

        // Save the current window.
        const clickHomeLink = this.props.callbacks.showBuildResults;
        const clickBrowseLink = () => this.props.callbacks.getSource(CONFIG.source_directory);

        return <div id="div_header_group">
              <div id="div_header">
                <HomeLink visible={visibleHomeLink} onClick={clickHomeLink} />
                <BuildButton state={buildState} onClick={clickBuild} />
                <Options />
                <BrowseLink visible={visibleBrowseLink} onClick={clickBrowseLink} />
                <SearchBox callbacks={this.props.callbacks} />
              </div>
              <Indicator status={indicatorStatus} />
            </div>;
    }
}

function renderLink(text, id, visible, onClick) {
    let className;
    let onClickFn;
    if (visible) {
        className = "header_link";
        onClickFn = onClick;
    } else {
        className = "link_hidden";
        onClickFn = null;
    }

    return <span id={id} className={className} onClick={onClickFn}>{text}</span>;    
}

function HomeLink(props) {
    // TODO should change this to be home-looking, rather than back-looking
    // TODO or even have this as a popup, rather than a 'home screen'
    return renderLink("← return to build results", "link_back", props.visible, props.onClick);
}

function BrowseLink(props) {
    return renderLink("browse source", "link_browse", props.visible, props.onClick);
}

function SearchBox(props) {
    const onKeyPress = (e) => {
        if (e.which == 13) {
            props.callbacks.getSearch(e.currentTarget.value);
        }
    };

    return <input id="search_box" placeholder="identifier search" autoComplete="off" onKeyPress={onKeyPress}></input>;
}

function BuildButton(props) {
    const state = props.state;
    let label;
    let className = "button";
    if (state == "fresh") {
        label = "build";
        className += " enabled_button";
    } else if (state == "building") {
        label = "building...";
        className += " disabled_button";
    } else if (state == "built") {
        label = "rebuild";
        if (CONFIG.build_on_load) {
            label += " (F5)";
        }
        className += " enabled_button";
    }

    return <span id="link_build" className={className} onClick={props.onClick}>{label}</span>;
}

function OptionsMenu(props) {
    let items = [
        { id: "opt-0", label: "list view/code view", fn: () => {} },
        { id: "opt-1", label: "show/hide warnings", fn: () => {} },
        { id: "opt-2", label: "show/hide notes and help", fn: () => {} },
        { id: "opt-3", label: "show/hide all source snippets", fn: () => {} },
        { id: "opt-4", label: "show/hide context for source code", fn: () => {} },
        { id: "opt-5", label: "show/hide child messages", fn: () => {} },
        { id: "opt-6", label: "show/hide error context", fn: () => {} },
        { id: "opt-7", label: "build command: <code>cargo build</code>", fn: () => {} },
        { id: "opt-8", label: "toolchain: TODO", fn: () => {} },
        { id: "opt-9", label: "build time: TODO", fn: () => {} },
        { id: "opt-10", label: "exit status: TODO", fn: () => {} }
    ];

    return <Menu id={"div_options"} items={items} location={props.location} onClose={props.onClose} target={props.target} />;
}

class Options extends MenuHost {
    constructor(props) {
        super(props);
        this.menuFn = OptionsMenu;
        this.leftClick = true;
    }

    renderInner() {
        return <span id="link_options" className="button">options</span>;
    }
}

function Indicator(props) {
    let overlay = null;
    let className = "div_border_plain";
    if (props.status) {
        overlay = <div id="div_border_animated" className="animated_border" />;
        className = "div_border_status";
    }
    return <div id="div_border" className={className}>{overlay}</div>;
}

module.exports = {
    TopBar
}