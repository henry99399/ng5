import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})
export class OrgComponent implements OnInit {

  
  tableData: any = [];
  tableDataTree: any = [];
  editRow: any = {};
  // 实例化一个对象
  constructor(private service: AppService) { }

  ngOnInit() {
    this.load();
  }
  load(){
    this._loading = true;
    this.service.post('/api/system/department/getList',{}).then(success => {
      this.tableData = [{
        org_id: this.service.loginUserInfo.org_id,
        dept_id: 0,
        dept_name: this.service.loginUserInfo.org_name,
        children: success.data
      }];
      this.service._toisLeaf(this.tableData);
      this._expanData();
      this._loading = false;
      console.log(this.tableData)
    })
  }
  expandDataCache = {};
  expandDataCacheCol = {};
  _expanData(){
    this.expandDataCacheCol = this.expandDataCache;
    this.expandDataCache = {};
    this.tableData.forEach(item => {
      this.expandDataCache[ item.dept_id ] = this.convertTreeToList(item);
    });
  }
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.dept_id === d.dept_id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  convertTreeToList(root) {
    const stack = [], array = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: true });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      const nodeCol = this.expandDataCacheCol[root.dept_id];
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          let expand = false;
          if(nodeCol){
            let col = null;
            nodeCol.forEach(mm => {
              if(mm.dept_id == node.children[ i ].dept_id)
                col = mm;
            })
            if(col){
              expand = col.expand;
            }
          }
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: expand, parent: node });
        }
        //父级tree节点创建
        if(node.parent){
          node.pname = [];
          if(node.parent.pname){
            node.parent.pname.forEach(element => {
              node.pname.push({
                dept_id: element.dept_id,
                dept_name: element.dept_name
              });
            });
          }
          node.pname.push({
            dept_id: node.parent.dept_id,
            dept_name: node.parent.dept_name
          });
        }
      }
      // if(node.children && node.children.length == 0){
      //   node.children = null;
      // }

    }
    return array;
  }

  visitNode(node, hashMap, array) {
    if (!hashMap[ node.dept_id ]) {
      hashMap[ node.dept_id ] = true;
      array.push(node);
    }
  }

  //编辑
  _editRow(data){
    for(let i in data){
      this.editRow[i] = data[i];
    }
    data.disabled = true;
  }
  //取消编辑
  _cancel(data){
    this.editRow = {};
    this.load();
  }
  _loading: boolean = false;
  //保存
  _saveRow(){
    if(!this.editRow.dept_name){
      this.service.message.error('请填写资源名称');
      return false;
    }
    if(!this.editRow.pname){
      this.service.message.error('请选择父级');
      return false;
    }
    else{
      let pid = this.editRow.pname[this.editRow.pname.length - 1];
      if(typeof(pid) == 'object'){
        pid = pid.dept_id;
      }
      this.editRow.dept_pid = pid == 0 ? null : pid;
    }
    this._loading = true;
    console.log(this.editRow)
    this.editRow.parent = null;
    this.editRow.children = null;
    this.service.post('/api/system/department/save', this.editRow).then(success => {
      if(success.code == 0){
        this.editRow = {};
        this.load();
      }
      else{
        this._loading = false;
        this.service.message.error(success.message);
      }
    })
  }
  //删除
  _delete(data){
    this.service.post('/api/system/department/delete',{
      mark: 'del',
      ids: [data.dept_id]
    }).then( success => {
      this.load();
    })
  }
  //启用/停用
  _enabled(data){
    // data.enabled = data.enabled == 1 ? 2: 1;
    this.service.post('/admin/sysResource/json/update_enabled',data).then(success => {
      this.load();
    })
  }
  //新增同级
  _addAfter(parent : any){
    this.editRow = {
      enabled: 1,
      remark: null,
      address: null,
      dept_code: null,
      dept_path: null,
      dept_id: null,
      org_id: parent.org_id,
      dept_pid: [{
        dept_id: parent.dept_id,
        dept_name: parent.dept_name
      }],
      dept_name: '请填写',
      disabled: true,
      isLeaf: true
    }
    parent.children(this.editRow)
    this._expanData();
  }
  //新增子级
  _addChildren(parent){
    parent.expand = true;
    this.editRow = {
      enabled: 1,
      remark: null,
      address: null,
      dept_code: null,
      dept_path: null,
      dept_id: null,
      org_id: parent.org_id,
      dept_pid: [{
        dept_id: parent.dept_id,
        dept_name: parent.dept_name
      }],
      dept_name: '请填写',
      disabled: true,
      isLeaf: true
    }
    parent.children.push(this.editRow);
    this._expanData();
  }
}
