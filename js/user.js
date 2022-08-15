// 用户验证 登录的表单项验证通用代码
/**
 *  对某一个表单项进行验证的构造函数
 */

class FieldValidator {
  /**
   *
   * @param {*} txtId 文本框的ID，用于选择文本框和错误信息
   * @param {*} validatorFunc
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  static async validate(...validators) {
    const proms = validators.map((value) => {
      return value.validate();
    });
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
