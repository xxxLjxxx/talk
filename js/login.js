const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(loginIdValidator,loginPwdValidator);
  if(!result) {
    return;
  }
  const formData = new FormData(form);
  const resp = await API.login(Object.fromEntries(formData.entries()));
  if(resp.code === 0) {
    alert("登录成功");
    location.href = "./index.html";
  }else {
    alert("Error!");
  }
}