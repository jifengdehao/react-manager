import React from 'react';
import {Card, Button, Table, Form, Modal, message} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import moment from 'moment';

const FormItem = Form.Item;

export default class Order extends React.Component {
    state = {
        orderInfo: {},
        orderConfirmVisble: false,
        loading: false
    }
    params = {
        page: 1
    }
    formList = [
        {
            type: 'SELECT',
            label: '城市',
            field: 'city',
            placeholder: '全部',
            initialValue: '1',
            width: 100,
            list: [{id: '0', name: '全部'}, {id: '1', name: '北京'}, {id: '2', name: '天津'}, {id: '3', name: '上海'}]
        },
        {
            type: '时间查询',
            placeholder: '请选择日期'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initialValue: '1',
            width: 100,
            list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '2', name: '结束行程'}]
        }
    ]

    componentWillMount() {
        this.requestList()
    }

    handleFilter = (params) => {
        params.begin_time = moment(params.begin_time).format('YYYY-MM-DD HH:mm:ss');
        params.end_time = moment(params.end_time).format('YYYY-MM-DD HH:mm:ss');
        this.params = params;
        console.log(params)
        this.requestList();
    }
    requestList = () => {
        let _this = this;
        _this.setState({
            loading: true
        });
        axios.http({
            url: '/order/list',
            params: this.params
        }).then((res) => {
            let list = res.result.item_list.map((item, index) => {
                item.key = index;
                return item;
            });
            this.setState({
                list,
                loading: false,
                pagination: Utils.pagination(res, (current) => {
                    _this.params.page = current;
                    _this.requestList();
                })
            })
        }).catch(() => {
            _this.setState({
                loading: false
            })
        })
    }
    // 获取订单详情
    handleConfirm = () => {
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请选择一条订单进行结束'
            })
            return;
        }
        axios.http({
            url: '/order/ebike_info',
            params: {
                orderId: item.id
            }
        }).then((res) => {
            console.log(res)
            this.setState({
                orderInfo: res.result,
                orderConfirmVisble: true
            })
        })
    }

    // 结束订单
    handleFinishOrder = () => {
        let item = this.state.selectedItem;
        axios.http({
            url: '/order/finish_order',
            params: {
                orderId: item.id
            }
        }).then((res) => {
            console.log(res)
            message.success('订单结束成功')
            this.setState({
                orderConfirmVisble: false
            })
            this.requestList();
        })
    }
    // 行点击
    onRowClick = (record, index) => {
        let selectKey = [index];
        this.setState({
            selectedRowKeys: selectKey,
            selectedItem: record
        })
    }
    // 打开详情
    openOrderDetail = () => {
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请先选择一条订单'
            });
            return;
        }
        window.open(`/#/common/order/detail/${item.id}`, '_blank')
    }

    render() {
        const columns = [
            {
                title: '订单编号',
                dataIndex: 'order_sn'
            },
            {
                title: '车辆编号',
                dataIndex: 'bike_sn'
            },
            {
                title: '用户名',
                dataIndex: 'user_name'
            },
            {
                title: '手机号',
                dataIndex: 'mobile'
            },
            {
                title: '里程',
                dataIndex: 'distance',
                render(distance) {
                    return distance / 1000 + 'Km';
                }
            },
            {
                title: '行驶时长',
                dataIndex: 'total_time'
            },
            {
                title: '状态',
                dataIndex: 'status',
                render(status) {
                    return status === 1 ? '进行中' : '已结束'
                }
            },
            {
                title: '开始时间',
                dataIndex: 'start_time'
            },
            {
                title: '结束时间',
                dataIndex: 'end_time'
            },
            {
                title: '订单金额',
                dataIndex: 'total_fee'
            },
            {
                title: '实付金额',
                dataIndex: 'user_pay'
            }
        ];
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        };
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" onClick={this.openOrderDetail}>订单详情</Button>
                    <Button type="primary" style={{marginLeft: 10}} onClick={this.handleConfirm}>结束订单</Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered
                        columns={columns}
                        loading={this.state.loading}
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    this.onRowClick(record, index);
                                }
                            };
                        }}
                    />
                </div>
                <Modal
                    title="结束订单"
                    visible={this.state.orderConfirmVisble}
                    onCancel={() => {
                        this.setState({
                            orderConfirmVisble: false
                        })
                    }}
                    onOk={this.handleFinishOrder}
                    width={600}
                >
                    <Form layout="horizontal">
                        <FormItem label="车辆编号" {...formItemLayout}>
                            {this.state.orderInfo.bike_sn}
                        </FormItem>
                        <FormItem label="剩余电量" {...formItemLayout}>
                            {this.state.orderInfo.battery + '%'}
                        </FormItem>
                        <FormItem label="行程开始时间" {...formItemLayout}>
                            {this.state.orderInfo.start_time}
                        </FormItem>
                        <FormItem label="当前位置" {...formItemLayout}>
                            {this.state.orderInfo.location}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
