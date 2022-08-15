const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "账号已被注册";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

const repeatValidator = new FieldValidator("txtLoginPwdConfirm", function (
  val
) {
  if (!val) {
    return "请输入确认密码";
  }
  if (val !== loginPwdValidator.input.value) {
    return "密码不一致";
  }
});

const form = $(".user-form");

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    repeatValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const resp = await API.reg(Object.fromEntries(formData.entries()));
  if(resp.code === 0) {
    alert("注册成功");
    location.href = './login.html';
  }
};
