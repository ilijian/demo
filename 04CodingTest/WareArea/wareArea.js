define(["jquery","underscore","backbone","liger","kibo","pager","WdatePicker"],function($,_,Backbone,liger,kibo,page,WdatePicker){
    $.prototype.serializeObject=function(){  
        var obj= {};  
        $.each(this.serializeArray(),function(i,o){  
            if(!(o.name in obj)){
                obj[o.name]=o.value;//不支持checkbox
            }
        });  
        return obj;
    };

    var op = op || {};
    op.sysManage = op.sysManage || {};

    var App = {};
    var AppUrl={
        //获取仓库
        getWarehouseUrl: '/?r=Imei/getWarehouse',
        //新增库区    
        addWareAreaUrl: '/?r=WareArea/addWarearea',
        //查询库区
        queryWareAreaUrl: '/?r=WareArea/getWareareaList',
        //根据id查询库区
        queryWareAreaByIdUrl: '/?r=WareArea/getWareareaList',
        //修改库区
        modifyWareAreaUrl: '/?r=WareArea/updateWarearea',
        //删除库区
        deleteWareAreaUrl: '/?r=WareArea/batchDelWarearea',
        //启用/禁用库区
        disableWareAreaUrl: '/?r=WareArea/ableWarearea',
        //库区编码是否已存在
        isExistsWareaAreaCodeUrl: '/?r=WareArea/existsWareareaCode',
        //库区名称是否已存在
        isExistsWareaAreaNameUrl: '/?r=WareArea/existsWareareaName'
    };

    //==================
    //     Model
    //==================
    op.sysManage.wareAreaModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: null,
                selected: false,
                institutionId: 1,    //从session中获取
                institutionName: "一加科技",  //从session中获取
                warehouseCode: null,
                warehouseName: null,
                wareareaCode: null,
                wareareaName: null,
                wareareaType: null,
                goodsType: null,
                safeQuantity: null,
                state: 1,
                networkPointType: null
            };
        },
        validate:function(attrs, options){

            if(!attrs.institutionName){ //如果字符串为空
                return "机构名称不可为空！";
            };
            if(!attrs.wareareaName){
                return "未选择仓库！";
            }
            if(!attrs.wareareaCode){
                return "库区ID不可为空！";
            }else{
                //查询是否有重复的库区ID
                if(attrs.id && ($('#wareareaCode').val() == $('#wareareaCode').attr('value'))){
                    //如果是正在修改并且库区ID未被改变，则什么都不做
                    return;
                }
                var errMsg = null;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: AppUrl.isExistsWareaAreaCodeUrl,
                    data: attrs,
                    dataType: 'json',
                    success: function(response){
                        if (response.ret != 1) {
                            errMsg =  "查询库区ID出错\n" + response.errMsg;
                        }
                    }
                }).fail(function (){
                    errMsg = '查询库区ID是否存在重复时服务器连接失败！';
                });
                if(errMsg){
                    return errMsg;
                }
            }
            if(!attrs.wareareaName){
                return "库区名称不可为空！";
            }else{
                //查询是否有重复的库区ID
                if(attrs.id && ($('#wareareaName').val() == $('#wareareaName').attr('value'))){
                    //如果是正在修改并且库区ID未被改变，则什么都不做
                    return;
                }
                var errMsg = null;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: AppUrl.isExistsWareaAreaNameUrl,
                    data: attrs,
                    dataType: 'json',
                    success: function(response){
                        if (response.ret != 1) {
                            errMsg = "查询库区名称出错\n" + response.errMsg;
                        }
                    }
                }).fail(function (){
                    errMsg = '查询库区名称是否重复时服务器连接失败！';
                });
                if(errMsg){
                    return errMsg;
                }
            }
        },
        toggle: function(){
            //选中或反选对应的model，并改变collection中的序列状态
            this.set('selected', !this.get('selected'));
        }

    });

    op.sysManage.wareareaCollection = Backbone.Collection.extend({
        model: op.sysManage.wareAreaModel,
        initialize: function(){
        },
        getSelected: function(){
            return this.where({selected: true});
        }/*,
        destroy: function(toBeDeletedModels){
            var _this = this;
            $.post(AppUrl.deleteWareAreaUrl,this.toJSON(),function (response) {
                    if (response.ret != 1) {
                        $.ligerDialog.alert("删除库区失败\n" + response.errMsg);
                        return false;
                    }
                    _this.remove(toBeDeletedModels);
                },'json').fail(function () {
                    $.ligerDialog.alert('服务器连接失败！');
                });
        }*/
    });

    var wareareaList = new op.sysManage.wareareaCollection;

    //== == == == ==
    //  View
    //== == == == ==

    var WareAreaView = Backbone.View.extend({
        tagName: "tr",
        template: _.template($('#item-template').html()),
        events: {
            "click .toggle": "toggleSelection"
        },
        initialize: function(){},
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            if(this.model.get('state') == '2'){
                //停用
                this.$el.attr('style','color:red');
            }
            return this;
        },
        toggleSelection: function(){
            this.model.toggle();
        }
    });

    var WareAreaDialogView = Backbone.View.extend({
        //doing nothing for now
        template: _.template($("#wareAreaAdd-template").html()),
        initialize: function(){
        },
        events: {
            'change #warehouseName':'onSelect'
        },
        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            var thisModel = this.model;
            $.post(AppUrl.getWarehouseUrl, function (response) {
                if (response.ret != 1) {
                    $.ligerDialog.alert("获取仓库列表失败\n" + response.errMsg);
                    return false;
                }
                $("#warehouseName").append(_.template($("#wareHouseItems").html(),response));
                $('#warehouseName option[value=' + thisModel.get('warehouseCode') +']').attr('selected',true);

            },'json').fail(function () {
                $.ligerDialog.alert('获取仓库列表时服务器连接失败！');
            })
            return this;
        },
        onSelect: function(){
            alert('changed');
        }
    });
    popedDialog = null;

    var WareAreaTableView = Backbone.View.extend({
        el:$(".wms"),
        //dataListTpl: _.template($('#dataListTpl').html()),
        //detailListTpl: _.template($('#detailListTpl').html()),
        currentItem:{}, //记录下确认入库的记录，以便操作后刷新回写
        events:{
            "click .l-button-submit":"onSubmit",
            "click #confirmBtn":"confirmStorage",
            "click #returnBtn":"backToDataList"
        },
        initialize:function(){
            _this=this;
            _this.initEventListening();
            _this.initToolBar();
            _this.initData();
        },
        initEventListening:function(){
            //设置本View需要监听的Collection事件
            this.listenTo(wareareaList, 'reset', this.addAll);
            this.listenTo(wareareaList, 'add', this.addOne);
            this.listenTo(wareareaList, 'remove', this.removeAll);
        },
        initToolBar:function(){

            var _thisBar = this;
            //add by ajj
            buttonItems = [
                {text: '新增', click:_thisBar.showDialog, icon: 'add'}, 
                {line: true}, 
                {text: '编辑',click:_thisBar.showDialog, icon: 'edit'}, 
                {line: true}, 
                {text: '删除', click:_thisBar.opDelete, icon: 'delete'},
                {line: true}, 
                {text: '保存', click:_thisBar.saveToDB, icon: 'save'}
            ];

            $("#toptoolbar").ligerToolBar({
                items:buttonItems
            });
        },
        initData:function(){
            //加载数据库中已有的库区信息并渲染
            loadWareareaData();
        },
        addOne:function(wareArea){
            //监听的Collection对象增加一个Model时的响应
            var view = new WareAreaView({model: wareArea});
            this.$("#singlePageList").prepend(view.render().el);
        },
        addAll:function(){
            //从后台请求到的数据被加载到wareAreaList之后的处理
            this.$("#singlePageList").empty();
            wareareaList.each(this.addOne, this);
        },
        removeAll:function(removedModels){
            //wareareaList.each(this.removeOne, this);
            $('#singlePageList :checked').parent().parent().remove();
        },
        showDialog:function(mode){
            var wareAreaModel = new op.sysManage.wareAreaModel;
            var isAdd = (mode.id=="item-1");
            if (!isAdd) {
                //编辑
                var selectedItems = wareareaList.getSelected();  //返回选中的Model
                if(selectedItems.length == 1){
                    //使用选中的记录渲染
                    wareAreaModel = wareareaList.get(selectedItems[0]);
                }else{
                    //未选或者选中多条记录
                    $.ligerDialog.alert('请选择单条记录进行编辑！');
                    return;
                }

            }
            
            var view = new WareAreaDialogView({model: wareAreaModel});
            var dialogContent = view.render().el;
            //为select赋值
            $(dialogContent).find('#warehouseName option[value=' + wareAreaModel.get('warehouseCode') +']').attr('selected',true);
            $(dialogContent).find('#wareareaType option[value=' + wareAreaModel.get('wareareaType') +']').attr('selected',true);
//            $(dialogContent).find('#networkPointType option[value=' + wareAreaModel.get('networkPointType') +']').attr('selected',true);

            $.ligerDialog.open({
                 id: 'add_editDialog',
                 target: dialogContent,
                 left: ($(window).width()/2-350)+"px",
                 width: "700px",
                 height: "400px",
                 isHidden: false,
                 title: isAdd?"新增仓库":"编辑仓库",   //?

                 buttons: [{
                    text: ' 提交', 
                    onclick: function (item, dialog) {
                        popedDialog = dialog;
                        wareAreaModel.set('institutionId',1);    //从session中获取
                        wareAreaModel.set('institutionName','一加科技');  //从session中获取
                        wareAreaModel.set('warehouseCode',$('#warehouseName').val());
                        wareAreaModel.set('warehouseName',$('#warehouseName').find('option:selected').text());
                        wareAreaModel.set('wareareaCode',$('#wareareaCode').val());
                        wareAreaModel.set('wareareaName',$('#wareareaName').val());
                        wareAreaModel.set('wareareaType',$('#wareareaType').val());
                        wareAreaModel.set('goodsType',$('#goodsType').val());
                        wareAreaModel.set('safeQuantity',$('#safeQuantity').val());
                        wareAreaModel.set('state',$('#stateArea :input:checked').val());
                        wareAreaModel.set('networkPointType',$('#networkPointType').val());

                        if (!wareAreaModel.isValid()) {
                            alert(wareAreaModel.validationError);
                            return;
                        }
                        
                        if(isAdd){
                            $.post(AppUrl.addWareAreaUrl,wareAreaModel.toJSON(),function(response) {
                                if (response.ret != 1) {
                                    $.ligerDialog.alert("新增库区失败\n" + response.errMsg);
                                    return false;
                                }
                                //关闭窗口
                                popedDialog.close();
                                loadWareareaData();
                            },'json').fail(function () {
                                $.ligerDialog.alert('服务器连接失败！');
                            });
                        }else{
                             $.post(AppUrl.modifyWareAreaUrl,wareAreaModel.toJSON(),function(response){
                                 if (response.ret != 1) {
                                     $.ligerDialog.alert("更新库区失败\n" + response.errMsg);
                                     return false;
                                 }
                                 popedDialog.close();
                                 loadWareareaData();
                             },'json').fail(function (){
                                 $.ligerDialog.alert('服务器连接失败！');
                             });
                        }
                    }
                },
                {
                    text: '重置',
                    onclick: function (item, dialog) {
                        $('#wareAreaForm')[0].reset();
                    }
                },
                {
                    text: '返回',
                    onclick: function (item, dialog) {
                        dialog.close();
                    }
                }]
             });

        },
        opDelete:function(){
            //删除操作
            var selectedItems = wareareaList.getSelected();  //返回选中的Model
            var ids = [];
            for(var i=0; i<selectedItems.length; i++){
                ids.push(selectedItems[i].get('id').toString());
            }
            var idsObj = {};
            idsObj.ids = ids;
            $.post(AppUrl.deleteWareAreaUrl,idsObj,function(response) {
                if (response.ret != 1) {
                    $.ligerDialog.alert("删除库区失败\n" + response.errMsg);
                    return false;
                }
                //关闭窗口
                wareareaList.remove(selectedItems);
            },'json').fail(function () {
                $.ligerDialog.alert('服务器连接失败！');
            });

        },
        saveToDB:function(){
        },
        opCreate:function(){
            this.showDialog();
        }
    });

    var loadWareareaData= function(){
        $.post(AppUrl.queryWareAreaUrl,function (response) {

            if (response.ret != 1) {
                $.ligerDialog.alert("获取库区列表失败\n" + response.errMsg);
                return false;
            }
            var tempCollection = new op.sysManage.wareareaCollection;
            var wareAreas = response.data.list;
            tempCollection.add(wareAreas);
            wareareaList.reset(tempCollection.models); //以请求返回的数据重置当前的库区collection，触发reset事件

        },'json').fail(function () {

            $.ligerDialog.alert('服务器连接失败！');

        })
    }
    var appView = new WareAreaTableView();
    return {
        init:function(){
            //new WareAreaTableView();
        }
    }
});