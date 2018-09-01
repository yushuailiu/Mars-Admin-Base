/**
 * Created by liushuai on 2018/2/21.
 */
export default function dealResponse(response, success, fail) {
  if (!response) {
    return;
  }
  if (response.msg === 'ok') {
    if (success) {
      success();
    }
  } else if (fail) {
    fail();
  }
}
