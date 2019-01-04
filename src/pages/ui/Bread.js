import React, {Fragment} from 'react'
import {Card, Breadcrumb, Icon} from 'antd'
import './ui.less'

export default class Bread extends React.Component {
    render() {
        return (
            <Fragment>
                <Card title="面包屑" className="card-wrap">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Icon type="home" style={{marginRight: 5}}/>Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item><a href="javascript:;">Application Center</a></Breadcrumb.Item>
                        <Breadcrumb.Item><a href="javascript:;">Application List</a></Breadcrumb.Item>
                        <Breadcrumb.Item>An Application</Breadcrumb.Item>
                    </Breadcrumb>
                </Card>
            </Fragment>
        )
    }
}
