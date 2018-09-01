/**
 * Created by liushuai on 2018/3/2.
 */
import React, { PureComponent } from 'react';
import { Select, Spin, Upload, Form, Input, message, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import Style from './UserInfo.less';

const { Option } = Select;
const { TextArea } = Input;
const { Item: FormItem } = Form;

@connect(state => ({
  User: state.User,
  Role: state.Role,
}))
@Form.create()
export default class addPage extends PureComponent {
  state = {
    uploadImage: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'User/curUserInfo',
      payload: {},
    });
  }

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  beforeUpload = file => {
    // todo 添加更多图片类型
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

  handleCoverChange(fileInfo) {
    if (fileInfo.file && fileInfo.file.response && fileInfo.file.response.data.length === 1) {
      const {
        User: { info },
        dispatch,
      } = this.props;
      dispatch({
        type: 'User/save',
        payload: {
          info: {
            ...info,
            avatar: fileInfo.file.response.data[0],
          },
        },
      });
    }
  }

  submit() {
    const {
      User: { info },
      dispatch,
      form,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.warn('请正确填写信息');
        return;
      }
      fieldsValue.avatar = info.avatar;
      dispatch({
        type: 'User/updateCurUserInfo',
        payload: fieldsValue,
      });
    });
  }

  render = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      User: { info, addLoading },
    } = this.props;
    const sexList = ['保密', '男', '女'];
    const options = [];
    sexList.forEach((item, index) => {
      options.push(
        <Option key={item} value={index}>
          {item}
        </Option>
      );
    });

    const avatarUploadData = {
      source: 'avatar',
    };

    const fileList = [];
    let coverImageUrl = '';
    if (info.avatar) {
      coverImageUrl = info.avatar;
      fileList.push({
        response: {
          url: info.avatar,
        },
      });
    }

    const { uploadImage, width } = this.state;

    const uploadButton = (
      <div>
        <Icon type={uploadImage ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <Spin spinning={addLoading}>
          <div className={Style.content}>
            <Form>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="昵称">
                {getFieldDecorator('nickname', {
                  rules: [
                    { required: true, message: '请输入2-15位昵称' },
                    { pattern: /^[\w\u4e00-\u9fa5]{2,15}$/, message: '请输入2-20位昵称' },
                  ],
                  initialValue: info.nickname,
                })(<Input placeholder="请输入2-15位昵称" />)}
              </FormItem>

              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="性别">
                {getFieldDecorator('sex', {
                  rules: [{ required: false, message: '请选择性别' }],
                  initialValue: info.sex,
                })(
                  <Select mode="single" placeholder="请选择性别" style={{ width: '100%' }}>
                    {options}
                  </Select>
                )}
              </FormItem>

              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="邮箱">
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: '请输入邮箱' },
                    {
                      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                      message: '请输入正确的邮箱',
                    },
                  ],
                  initialValue: info.email,
                })(<Input placeholder="请输入邮箱" />)}
              </FormItem>

              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="手机号">
                {getFieldDecorator('phone', {
                  rules: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[\d]{10}$/, message: '请输入正确的手机号' },
                  ],
                  initialValue: info.phone,
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>

              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="简介">
                {getFieldDecorator('intro', {
                  rules: [
                    { required: false, message: '请输入简介' },
                    { type: 'string', message: '请输入简介' },
                    { max: 100, message: '简介过长' },
                  ],
                  initialValue: info.intro,
                })(<TextArea placeholder="请选择角色～" autosize={{ minRows: 4, maxRows: 10 }} />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="头像">
                {getFieldDecorator('avatar', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{ type: 'array', required: true, message: '请上传封面!' }],
                  initialValue: fileList,
                })(
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    action="/admin/api/image/upload"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleCoverChange.bind(this)}
                    data={avatarUploadData}
                  >
                    {coverImageUrl ? (
                      <img className={Style.cover} src={coverImageUrl} alt="" />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </FormItem>
            </Form>
            <FooterToolbar style={{ width }}>
              <Button type="primary" onClick={this.submit.bind(this)} loading={false}>
                提交
              </Button>
            </FooterToolbar>
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  };
}
