/**
 * Created by liushuai <admin@liuyushuai.com> on 2018/9/1.
 *
 */

import { connect } from 'dva';
import { Form, Icon, Upload, Button, Input, Spin, message } from 'antd';
import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import Style from './SiteSet.less';

const FormItem = Form.Item;

@connect(state => ({
  SiteSet: state.SiteSet,
}))
@Form.create()
export default class EditSiteSet extends PureComponent {
  state = {};

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteSet/getSiteSet',
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleLogoChange(fileInfo) {
    this.saveImage(fileInfo, 'logo');
  }

  handleFaviconChange(fileInfo) {
    this.saveImage(fileInfo, 'favicon');
  }

  saveImage(fileInfo, field) {
    if (fileInfo.file && fileInfo.file.response && fileInfo.file.response.data.length === 1) {
      const {
        SiteSet: { info },
        dispatch,
      } = this.props;
      [info[field]] = fileInfo.file.response.data;
      dispatch({
        type: 'SiteSet/save',
        payload: {
          info,
        },
      });
    }
  }

  submit() {
    const {
      SiteSet: { info },
      dispatch,
      form,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.warn('请正确填写信息');
        return;
      }
      fieldsValue.logo = info.logo;
      fieldsValue.favicon = info.favicon;
      dispatch({
        type: 'SiteSet/updateSiteSet',
        payload: fieldsValue,
        success: () => message.success('更新成功!'),
      });
    });
  }

  render = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      SiteSet: { info, loading },
    } = this.props;

    const logoUploadData = {
      source: 'siteSet',
    };
    const logoFileList = [];
    let logoImageUrl = '';
    if (info.logo) {
      logoImageUrl = info.logo;
      logoFileList.push({
        response: {
          url: info.logo,
        },
      });
    }
    const faviconUploadData = {
      source: 'siteSet',
    };
    const faviconFileList = [];
    let faviconImageUrl = '';
    if (info.favicon) {
      faviconImageUrl = info.favicon;
      faviconFileList.push({
        response: {
          url: info.favicon,
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
        <Spin spinning={loading}>
          <div className={Style.content}>
            <Form>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点名">
                {getFieldDecorator('site_name', {
                  rules: [
                    { required: true, message: '请输入1-15位站点名' },
                    { pattern: /^[\s\S]{1,15}$/, message: '请输入1-15位站点名' },
                  ],
                  initialValue: info.site_name,
                })(<Input placeholder="请输入1-15位站点名" />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点关键字">
                {getFieldDecorator('meta_keywords', {
                  rules: [
                    { required: true, message: '请输入1-50位站点关键字' },
                    { pattern: /^[\s\S]{1,50}$/, message: '请输入1-50位站点关键字' },
                  ],
                  initialValue: info.meta_keywords,
                })(<Input placeholder="请输入1-50位站点关键字" />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点描述">
                {getFieldDecorator('meta_description', {
                  rules: [
                    { required: true, message: '请输入1-200位站点描述' },
                    { pattern: /^[\s\S]{1,200}$/, message: '请输入1-200位站点描述' },
                  ],
                  initialValue: info.meta_description,
                })(<Input placeholder="请输入1-200位站点描述" />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点版本">
                {getFieldDecorator('site_version', {
                  rules: [
                    { required: true, message: '请输入站点版本' },
                    { pattern: /^[\d.]{1,10}$/, message: '请输入站点版本' },
                  ],
                  initialValue: info.site_version,
                })(<Input placeholder="请输入站点版本" />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="Copyright">
                {getFieldDecorator('copyright', {
                  rules: [
                    { required: true, message: '请输入1-50位Copyright' },
                    { pattern: /^[\s\S]{1,50}$/, message: '请输入1-50位Copyright' },
                  ],
                  initialValue: info.copyright,
                })(<Input placeholder="请输入1-50位Copyright" />)}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点Logo">
                {getFieldDecorator('logo', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{ type: 'array', required: true, message: '请上传站点logo!' }],
                  initialValue: logoFileList,
                })(
                  <Upload
                    name="logo"
                    listType="picture-card"
                    showUploadList={false}
                    action="/admin/api/image/upload"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleLogoChange.bind(this)}
                    data={logoUploadData}
                  >
                    {logoImageUrl ? (
                      <img className={Style.cover} src={logoImageUrl} alt="" />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </FormItem>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="站点favicon">
                {getFieldDecorator('favicon', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{ type: 'array', required: true, message: '请上传站点favicon!' }],
                  initialValue: faviconFileList,
                })(
                  <Upload
                    name="favicon"
                    listType="picture-card"
                    showUploadList={false}
                    action="/admin/api/image/upload"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleFaviconChange.bind(this)}
                    data={faviconUploadData}
                  >
                    {faviconImageUrl ? (
                      <img className={Style.cover} src={faviconImageUrl} alt="" />
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
