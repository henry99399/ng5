import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
//表单 绑定规则、控件组、响应式表单验证（驱动式表单验证）
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  login_type: number = 0; //登录方式
  userName: string; //用户名
  password: string; //密码
  loading: boolean = false; //form提交状态
  constructor(private service: AppService) { }

  ngOnInit() {
    localStorage.clear();
    this.myForm = this.service.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
  //登录
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.loading = true;
      this.service.post('/api/system/login', {
        user_name: this.userName,
        user_pwd: this.password
      }).then(success => {
        if (success.code == 0) {
          this.service.loginTo(success, () => {
            if (this.service.loginUserMenus) {
              this.service.router.navigate(['/home']);
            }
            else {
              this.service.message.error('获取权限失败, 请重新再试~')
              this.loading = false;
            }
          })
        }
        else {
          this.service.message.error(success.message)
          this.loading = false;
        }
      })
    }
  }
  //修改登录方式
  update_login_type() {
    this.login_type = this.login_type ? 0 : 1;
  }
  //获取页面背景
  getLoginBg(n: number): boolean {
    let date = new Date();
    let m = date.getMonth();
    if (n == 1) {
      return m == 2 || m == 3 || m == 4;
    }
    else if (n == 2) {
      return m == 5 || m == 6 || m == 7 || m == 8 || m == 9;
    }
    else if (n == 3) {
      return m == 10 || m == 11;
    }
    else {
      return m == 12 || m == 1;
    }
  }
}
