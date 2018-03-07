import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {

  tableData: any = [];
  editRow: any = {};
  // 实例化一个对象
  constructor(private service: AppService) { }

  
  ngOnInit() {
    this.load();
  }
  load() {
    this._loading = true;
    this.service.post('/api/system/resource/list', {
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : 1
    }).then(success => {
      this.tableData = [{
        org_id: this.service.loginUserInfo.org_id,
        res_id: 0,
        res_name: '根节点',
        children: success.data
      }];
      this.service._toisLeaf(this.tableData);
      this._expanData();
      this._loading = false;
    })
  }
  expandDataCache = {};
  expandDataCacheCol = {};
  _expanData() {
    this.expandDataCacheCol = this.expandDataCache;
    this.expandDataCache = {};
    this.tableData.forEach(item => {
      this.expandDataCache[item.res_id] = this.convertTreeToList(item);
    });
  }
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.res_id === d.res_id);
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
      const nodeCol = this.expandDataCacheCol[root.res_id];

      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          let expand = false;
          if (nodeCol) {
            let col = null;
            nodeCol.forEach(mm => {
              if (mm.res_id == node.children[i].res_id)
                col = mm;
            })
            if (col) {
              expand = col.expand;
            }
          }
          stack.push({ ...node.children[i], level: node.level + 1, expand: expand, parent: node });
        }
        //父级tree节点创建
        if (node.parent) {
          node.pname = [];
          if (node.parent.pname) {
            node.parent.pname.forEach(element => {
              node.pname.push({
                res_id: element.res_id,
                res_name: element.res_name
              });
            });
          }
          node.pname.push({
            res_id: node.parent.res_id,
            res_name: node.parent.res_name
          });
        }
      }
      // if (node.children && node.children.length == 0) {
      //   node.children = null;
      // }

    }
    return array;
  }

  visitNode(node, hashMap, array) {
    if (!hashMap[node.res_id]) {
      hashMap[node.res_id] = true;
      array.push(node);
    }
  }

  //编辑
  _editRow(data) {
    for (let i in data) {
      this.editRow[i] = data[i];
    }
  }
  //取消编辑
  _cancel(data) {
    this.editRow = {};
    this.load();
  }
  _loading: boolean = false;
  //保存
  _saveRow() {
    if (!this.editRow.res_name) {
      this.service.message.error('请填写资源名称');
      return false;
    }
    if (!this.editRow.pname || this.editRow.pname.length == 0) {
      this.service.message.error('请选择父级');
      return false;
    }
    else {
      let pid = [];
      this.editRow.pname.forEach(element => {
        if (typeof (element) == 'object') {
          pid.push(element.res_id);
        }
        else {
          pid.push(element);
        }
      });
      this.editRow.full_ids_array = pid;
    }
    console.log(this.editRow)
    this._loading = true;
    this.editRow.parent = null;
    this.editRow.children = null;
    this.service.post('/api/system/resource/update', this.editRow).then(success => {
      if (success.code == 0) {
        this.editRow = {};
        this.load();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //删除
  _delete(data) {
    this.service.post('/api/system/resource/delete', {
      mark: 'del',
      res_ids: [data.res_id]
    }).then(success => {
      if (success.code == 0) {
        this.load();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //启用/停用
  _enabled(data) {
    // data.enabled = data.enabled == 1 ? 2: 1;
    this.service.post('/api/system/resource/update/enabled', {
      enabled: data.enabled,
      full_path: data.full_path
    }).then(success => {
      this.load();
    })
  }
  //新增同级
  _addAfter(data: any) {
    this.editRow = {
      enabled: 1,
      order_weight: new Date().getTime(),
      org_id: data.org_id,
      pid: data.res_id,
      parent_name: data.res_name,
      res_name: null,
      res_type: 1,
      res_type_name: '菜单',
      res_id: null,
      disabled: true,
      isLeaf: true
    }
    if (!data.children) data.children = [];
    data.children.push(this.editRow);
    this._expanData();
  }
  //新增子级
  _addChildren(data) {
    data.expand = true;
    this.editRow = {
      enabled: 1,
      res_id: null,
      res_name: null,
      res_key: null,
      full_ids_array: [],
      org_id: data.org_id,
      res_type: 1,
      res_type_name: '菜单',
      res_icon: null,
      res_url: null,
      disabled: true,
      isLeaf: true
    }
    if (!data.children) data.children = [];
    data.children.push(this.editRow);
    this._expanData();
  }
  options: any = [{
    label: '菜单',
    value: 1
  }, {
    label: '按钮',
    value: 2
  }]

}
