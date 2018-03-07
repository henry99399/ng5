import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  tableData: any = []; //数据列表
  _loading: boolean = true;
  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute, private service: AppService, private router: Router) { }
  //表单
  myForm: FormGroup;
  formBean: any={
    pay_type_id:null,           //支付方式id(1:支付宝,2:微信)
    pay_mark:null,              //支付说明
    base_url:null,              //域名
    show_url:null,              //支付成功后跳转地址	
    rsa_private_key:null,       //rsa秘钥
    app_private_key:null,       //私钥
    alipay_public_key:null,     //公钥
    mch_id:null,                //商户id
    app_key:null,               //key
  }
  isVisibleMiddle: boolean = false;
  formTitle: string;
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      pay_mark: false,
      base_url: false,
      show_url: false,
      rsa_private_key: false,
      app_private_key: false,
      alipay_public_key: false,
      mch_id: false,
      app_key: false,
    })
  }
  //打开
  showModalMiddle(data?:any) {
    if (data.pay_type_id == 1) {
      this.formBean.formTitle = "支付宝配置";
      this.service.post('/api/system/pay/config/alipay').then(success => {
        this.formBean = success.data;
      })
      this.myForm = this.service.fb.group({
        pay_mark: [null, [this.service.validators.required]],
        base_url: [null, [this.service.validators.required]],
        show_url: [null, [this.service.validators.required]],
        rsa_private_key: [null, [this.service.validators.required]],
        app_private_key: [null, [this.service.validators.required]],
        alipay_public_key: [null, [this.service.validators.required]],
        mch_id: false,
        app_key: false,
      })
    } else if (data.pay_type_id == 2) {
      this.formBean.formTitle = "微信配置";
      this.service.post('/api/system/pay/config/weixinPay').then(success => {
        this.formBean = success.data;
      })
      this.myForm = this.service.fb.group({
        pay_mark: false,
        base_url: false,
        show_url: false,
        rsa_private_key: false,
        app_private_key: false,
        alipay_public_key: false,
        mch_id: [null, [this.service.validators.required]],
        app_key: [null, [this.service.validators.required]],
      })
    }
    this.isVisibleMiddle = true;
  };
  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.myForm.reset();
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }

  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      let url:string;
      if(this.formBean.pay_type_id==1){
        url='/api/system/pay/config/alipay/save';
      }else if(this.formBean.pay_type_id==2){
        url='/api/system/pay/config/weixinpay/save';
      }
      this.service.post(url, this.formBean).then(success => {
        if (success.code == 0) {
          this.isVisibleMiddle = false;
          this.myForm.reset();
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //重新查询
  reload() {
    this._loading = true;
    this.service.post('/api/system/pay/config/list').then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.tableData = success.data;
      }
      else {
        this.tableData = [];
        this.service.message.error(success.message);
      }
    })
  }

  //启用停用
  enabled(data?: any) {
    this.service.post('/api/system/pay/config/enabled', {
      ids: [data.pay_type_id],
      enabled: data.enabled==1?2:1
    }).then(success => {
      if (success.code == 0) {
        this.reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
}
