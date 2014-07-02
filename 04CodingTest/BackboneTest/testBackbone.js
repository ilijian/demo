$(function(){
	var WareArea = Backbone.Model.extend({
		defaults: function(){
			return{
				institutionId: null,	//从session中获得默认值
                institutionName: null,
                warehouseCode: null,
                warehouseName: null,
                wareareaCode: null,
                wareareaName: null,
                wareareaType: null,
                goodsType: null,
                safeQuantity: null,
                state: null,
                networkPointType: null
			};
		}
	});
	
	var WareAreaList = Backbone.Collection.extend({
		model: WareArea
	});
	
	var wareAreas = new WareAreaList;	//新建一个库区list
	
	var WareAreaView = Backbone.View.extend({
		tagName: "tr",
		template: _.template($('#item-template').html()),
		events: {
			"click .toggle": "toggleDone"
		},
		initialize: function(){},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));	//
			return this;
		}
	});
	
	var WareAreaTableView = Backbone.View.extend({
		el: $('#wareAreaManage'),
		events: {
			"click #addBtn":"onAdd",
			"click #editBtn":"onEdit",
			"click #deleteBtn":"onDelete"
		},
		initialize: function() {
		/*
			var wareAreaTable = $("#compactTable").ligerGrid({
				columns: [ 
				{ display: '机构名称', name: 'institutionId', minWidth: 60 },
				{ display: '仓库编号', name: 'wareHouseCode', width: 100, align: 'left'},
				{ display: '仓库名称', name: 'wareHouseName', width: 200, align: 'left' },
				], 
				width: '50%',
				pageSize: 20, 
				checkbox: true
			});
			*/
			this.listenTo(wareAreas, 'add', this.addOne);
			//获取后台存储的data
		},
		render: function(){
			/*
			var wareAreaTable = $("#compactTable").ligerGrid();
			wareAreaTable.add({
				institutionId: "00000000000",
				wareHouseCode: "xxxxxxxxxxx",
				wareHouseName: "WareHouseName",
			});
			*/
			return this;
		},
		onAdd: function(){
			wareAreas.add({
				institutionId: "00000000000",
				wareHouseCode: "xxxxxxxxxxx",
				wareHouseName: "WareHouseName"});
		},
		addOne:function(newWareArea){
			var view = new WareAreaView({model: newWareArea});
			var tempHtml = view.render().el;
			alert(tempHtml);
			this.$("#compactTableBody").append(tempHtml);
		},
		onEdit: function(){
			alert('edit');
		},
		onDelete: function(){
			alert('delete');
		}
	});
	
	var xxx = new WareAreaTableView;
})