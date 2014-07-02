define(["jquery","underscore","backbone","liger","kibo","pager","WdatePicker"],function($,_,Backbone,liger,kibo,page,WdatePicker){
    $.prototype.serializeObject=function(){  
        var obj= {};  
        $.each(this.serializeArray(),function(i,o){  
            if(!(o.name in obj)){
                obj[o.name]=o.value;//��֧��checkbox
            }
        });  
        return obj;
    };

    var op = op || {};
    op.sysManage = op.sysManage || {};

    var App = {};
    var AppUrl={
        //��ȡ�ֿ�
        getWarehouseUrl: '/?r=Imei/getWarehouse',
        //��������    
        addWareAreaUrl: '/?r=WareArea/addWarearea',
        //��ѯ����
        queryWareAreaUrl: '/?r=WareArea/getWareareaList',
        //����id��ѯ����
        queryWareAreaByIdUrl: '/?r=WareArea/getWareareaList',
        //�޸Ŀ���
        modifyWareAreaUrl: '/?r=WareArea/updateWarearea',
        //ɾ������
        deleteWareAreaUrl: '/?r=WareArea/batchDelWarearea',
        //����/���ÿ���
        disableWareAreaUrl: '/?r=WareArea/ableWarearea',
        //���������Ƿ��Ѵ���
        isExistsWareaAreaCodeUrl: '/?r=WareArea/existsWareareaCode',
        //���������Ƿ��Ѵ���
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
                institutionId: 1,    //��session�л�ȡ
                institutionName: "һ�ӿƼ�",  //��session�л�ȡ
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

            if(!attrs.institutionName){ //����ַ���Ϊ��
                return "�������Ʋ���Ϊ�գ�";
            };
            if(!attrs.wareareaName){
                return "δѡ��ֿ⣡";
            }
            if(!attrs.wareareaCode){
                return "����ID����Ϊ�գ�";
            }else{
                //��ѯ�Ƿ����ظ��Ŀ���ID
                if(attrs.id && ($('#wareareaCode').val() == $('#wareareaCode').attr('value'))){
                    //����������޸Ĳ��ҿ���IDδ���ı䣬��ʲô������
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
                            errMsg =  "��ѯ����ID����\n" + response.errMsg;
                        }
                    }
                }).fail(function (){
                    errMsg = '��ѯ����ID�Ƿ�����ظ�ʱ����������ʧ�ܣ�';
                });
                if(errMsg){
                    return errMsg;
                }
            }
            if(!attrs.wareareaName){
                return "�������Ʋ���Ϊ�գ�";
            }else{
                //��ѯ�Ƿ����ظ��Ŀ���ID
                if(attrs.id && ($('#wareareaName').val() == $('#wareareaName').attr('value'))){
                    //����������޸Ĳ��ҿ���IDδ���ı䣬��ʲô������
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
                            errMsg = "��ѯ�������Ƴ���\n" + response.errMsg;
                        }
                    }
                }).fail(function (){
                    errMsg = '��ѯ���������Ƿ��ظ�ʱ����������ʧ�ܣ�';
                });
                if(errMsg){
                    return errMsg;
                }
            }
        },
        toggle: function(){
            //ѡ�л�ѡ��Ӧ��model�����ı�collection�е�����״̬
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
                        $.ligerDialog.alert("ɾ������ʧ��\n" + response.errMsg);
                        return false;
                    }
                    _this.remove(toBeDeletedModels);
                },'json').fail(function () {
                    $.ligerDialog.alert('����������ʧ�ܣ�');
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
                //ͣ��
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
                    $.ligerDialog.alert("��ȡ�ֿ��б�ʧ��\n" + response.errMsg);
                    return false;
                }
                $("#warehouseName").append(_.template($("#wareHouseItems").html(),response));
                $('#warehouseName option[value=' + thisModel.get('warehouseCode') +']').attr('selected',true);

            },'json').fail(function () {
                $.ligerDialog.alert('��ȡ�ֿ��б�ʱ����������ʧ�ܣ�');
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
        currentItem:{}, //��¼��ȷ�����ļ�¼���Ա������ˢ�»�д
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
            //���ñ�View��Ҫ������Collection�¼�
            this.listenTo(wareareaList, 'reset', this.addAll);
            this.listenTo(wareareaList, 'add', this.addOne);
            this.listenTo(wareareaList, 'remove', this.removeAll);
        },
        initToolBar:function(){

            var _thisBar = this;
            //add by ajj
            buttonItems = [
                {text: '����', click:_thisBar.showDialog, icon: 'add'}, 
                {line: true}, 
                {text: '�༭',click:_thisBar.showDialog, icon: 'edit'}, 
                {line: true}, 
                {text: 'ɾ��', click:_thisBar.opDelete, icon: 'delete'},
                {line: true}, 
                {text: '����', click:_thisBar.saveToDB, icon: 'save'}
            ];

            $("#toptoolbar").ligerToolBar({
                items:buttonItems
            });
        },
        initData:function(){
            //�������ݿ������еĿ�����Ϣ����Ⱦ
            loadWareareaData();
        },
        addOne:function(wareArea){
            //������Collection��������һ��Modelʱ����Ӧ
            var view = new WareAreaView({model: wareArea});
            this.$("#singlePageList").prepend(view.render().el);
        },
        addAll:function(){
            //�Ӻ�̨���󵽵����ݱ����ص�wareAreaList֮��Ĵ���
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
                //�༭
                var selectedItems = wareareaList.getSelected();  //����ѡ�е�Model
                if(selectedItems.length == 1){
                    //ʹ��ѡ�еļ�¼��Ⱦ
                    wareAreaModel = wareareaList.get(selectedItems[0]);
                }else{
                    //δѡ����ѡ�ж�����¼
                    $.ligerDialog.alert('��ѡ������¼���б༭��');
                    return;
                }

            }
            
            var view = new WareAreaDialogView({model: wareAreaModel});
            var dialogContent = view.render().el;
            //Ϊselect��ֵ
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
                 title: isAdd?"�����ֿ�":"�༭�ֿ�",   //?

                 buttons: [{
                    text: ' �ύ', 
                    onclick: function (item, dialog) {
                        popedDialog = dialog;
                        wareAreaModel.set('institutionId',1);    //��session�л�ȡ
                        wareAreaModel.set('institutionName','һ�ӿƼ�');  //��session�л�ȡ
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
                                    $.ligerDialog.alert("��������ʧ��\n" + response.errMsg);
                                    return false;
                                }
                                //�رմ���
                                popedDialog.close();
                                loadWareareaData();
                            },'json').fail(function () {
                                $.ligerDialog.alert('����������ʧ�ܣ�');
                            });
                        }else{
                             $.post(AppUrl.modifyWareAreaUrl,wareAreaModel.toJSON(),function(response){
                                 if (response.ret != 1) {
                                     $.ligerDialog.alert("���¿���ʧ��\n" + response.errMsg);
                                     return false;
                                 }
                                 popedDialog.close();
                                 loadWareareaData();
                             },'json').fail(function (){
                                 $.ligerDialog.alert('����������ʧ�ܣ�');
                             });
                        }
                    }
                },
                {
                    text: '����',
                    onclick: function (item, dialog) {
                        $('#wareAreaForm')[0].reset();
                    }
                },
                {
                    text: '����',
                    onclick: function (item, dialog) {
                        dialog.close();
                    }
                }]
             });

        },
        opDelete:function(){
            //ɾ������
            var selectedItems = wareareaList.getSelected();  //����ѡ�е�Model
            var ids = [];
            for(var i=0; i<selectedItems.length; i++){
                ids.push(selectedItems[i].get('id').toString());
            }
            var idsObj = {};
            idsObj.ids = ids;
            $.post(AppUrl.deleteWareAreaUrl,idsObj,function(response) {
                if (response.ret != 1) {
                    $.ligerDialog.alert("ɾ������ʧ��\n" + response.errMsg);
                    return false;
                }
                //�رմ���
                wareareaList.remove(selectedItems);
            },'json').fail(function () {
                $.ligerDialog.alert('����������ʧ�ܣ�');
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
                $.ligerDialog.alert("��ȡ�����б�ʧ��\n" + response.errMsg);
                return false;
            }
            var tempCollection = new op.sysManage.wareareaCollection;
            var wareAreas = response.data.list;
            tempCollection.add(wareAreas);
            wareareaList.reset(tempCollection.models); //�����󷵻ص��������õ�ǰ�Ŀ���collection������reset�¼�

        },'json').fail(function () {

            $.ligerDialog.alert('����������ʧ�ܣ�');

        })
    }
    var appView = new WareAreaTableView();
    return {
        init:function(){
            //new WareAreaTableView();
        }
    }
});