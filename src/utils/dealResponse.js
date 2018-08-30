/**
 * Created by liushuai on 2018/2/21.
 */
import { message } from 'antd';

export default function dealResponse(response, success, fail) {
  if (!response) {
    return;
  }
  if (response.msg === 'ok') {
    if (success) {
      console.log('call success');
      success();
    } else {
      message.success('操作成功！');
    }
  } else if (fail) {
    fail();
  } else {
    message.fail('操作失败！');

  }
}
