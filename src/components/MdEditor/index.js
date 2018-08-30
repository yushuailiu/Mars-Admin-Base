/**
 * Created by liushuai on 2018/1/13.
 */

'use strict';
import React, { Component } from 'react';
import assign from 'object-assign';

let defaultConfig = {
  // 组件接入方，并不需要知道具体ID
  id: 'EditorID' + new Date().getTime(),
  width: '100%',
  height: 740,
  // 静态资源路径
  path: '/adminstatic/js/',
  autoFocus: false,

  codeFold: true,
  // syncScrolling : false,
  saveHTMLToTextarea: true, // 保存 HTML 到 Textarea
  searchReplace: true,
  // watch : false,                // 关闭实时预览
  htmlDecode: 'style,script,iframe|on*', // 开启 HTML 标签解析，为了安全性，默认不开启
  // toolbar  : false,             //关闭工具栏
  // previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
  emoji: true,
  taskList: true,
  tocm: true, // Using [TOCM]
  tex: true, // 开启科学公式TeX语言支持，默认关闭
  flowChart: true, // 开启流程图支持，默认关闭
  sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
  // dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
  // dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
  // dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
  // dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
  // dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
  imageUpload: true,
  imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
  imageUploadURL: './php/upload.php',
  onload: function() {},
};

class Editor extends Component {
  static defaultProps = {
    config: {},
  };

  componentDidMount() {
    let { config, onChange: changeValue, onSave, content } = this.props;
    config = assign({}, defaultConfig, config);
    // 静态资源地址修改
    if (config.path !== defaultConfig.path) {
      console.warn(
        "Editor warning: Static resource address has changed, if you know exactly what you're doing, ignore this warning"
      );
    }
    let editor = editormd(config.id, {
      ...config,
      onload: function() {
        config.onload(editor, this);
      },
      onchange: function() {
        const markdown = this.getMarkdown();
        changeValue(markdown);
      },
      mySave: function(status) {
        onSave(status);
      },
    });
  }

  render() {
    let { config } = this.props;
    config = assign({}, defaultConfig, config);

    return <div id={config.id} />;
  }
}

export default Editor;
