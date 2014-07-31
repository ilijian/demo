require.config({
	paths: {
		"jquery": "../../05lib/JS/jquery1.11.1",
		"underscore": "../../05lib/JS/underscore",
		"backbone": "../../05lib/JS/backbone",
		"bootstrap": "../../05lib/UI/bootstrap-3.0.3/dist/js/bootstrap_altered"
	},
	shim: {	//解决bootstrap与jquery的不兼容
        'bootstrap': { 
            deps:['jquery']
        }
    }
});

define(["jquery","underscore","backbone","bootstrap"],function($,_,Backbone){

//----------------------------MODEL-----------------------------------------------------
	var PersonModel = Backbone.Model.extend({
		defaults: function(){
			return {
				selected: false,
				id: null,
				name: null,
				sex: null,
				address: null,
				career: null,
				phone: null
			}
		},
		toggleSelection: function(){
			this.set('selected', !this.get('selected'),{silent:true});	//改变model的selected属性不会触发change事件
		}
	});

//----------------------------COLLECTION------------------------------------------------
	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		initialize: function(){
			//JSON.parse(localStorage.list) || [];
		},
		events:{

		}
	});
	
	var personList = new PersonCollection;
	
//----------------------------VIEW OF SINGLE ENTRY--------------------------------------	
	var PersonView = Backbone.View.extend({
		tagName: "tr",
		template: _.template($('#personTemplate').html()),
		initialize: function(){
			this.model.on('change',this.render,this);
		},
		events: {
			"click .toggle": "clickCheckbox"
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clickCheckbox : function(){
			this.model.toggleSelection();
		}
	});
	
//-----------------------------VIEW OF TABLE----------------------------------------------
	var PersonListView = Backbone.View.extend({
		el: $('#perfectTable'),
		initialize: function(){
			this.listenTo(personList, 'add', this.addOne); //List与View之间是通过调用和事件来实现同步的
		},
		events: {
			
		},
		render: function(){
			return this;
		},
		addOne: function(personModel){
			//alert('addOne')
			var view = new PersonView({model:personModel});
			this.el.$('#perfectTable-tbody').append(view.render().el)
		}

	});

//----------------------------VIEW OF DIALOG-----------------------------------------------	
	var DialogView = Backbone.View.extend({
		el: $('#modalDialog'),
		template: _.template($('#dialogContentTemplate').html()),
		initialize: function(){
			//$('#modalDialog').on('hidden.bs.modal', function (e) {})
			//this.listenTo(this.model,'sync',this.afterSave);
		},
		events: {
			"click #saveChanges": "saveModel",
			"change #demo_form": "formContentChanged"
		},
		render: function(){
			if(this.model){
				var dialogForm = this.template(this.model.toJSON())
				this.$el.find('.modal-body').html(dialogForm);
			}
			return this;
		},
		saveModel: function(){
			//setModelWithUserInput(this.model);
			this.model.name = $('#name').val();
			this.model.sex = $('#sex').val();
			this.model.phone = $('#phone').val();
			this.model.career = $('#career').val();
			this.model.address = $('#address').val();
			personList.add(this.model);	//触发add事件
			localStorage.list = JSON.stringify(personList);

			/*
			this.model.url="http://127.0.0.1:1337/create";
			var isNewOrNot = this.model.isNew();


			this.model.save({
				id: this.model.get('id'),
				name: $('#name').val(),
				sex: $('#sex').val(),
				career:$('#career').val(),
				phone: $('#phone').val(),
				address: $('#address').val()
			},
			{
				success:function(resModel,response){
					if(!resModel.previous('id')){	//如果是新增
						personList.add(resModel);	//触发add事件
					}
					$('#modalDialog').modal('hide');
				},
				error: function(resModel,response){
					alert('error')
				}
			});
			*/
		},
		formContentChanged: function(){
			//alert('changed')
		}
	})
	
	var popDialogView = new DialogView;
	
//----------------------------VIEW OF APP-----------------------------------------------------
	var AppView = Backbone.View.extend({
		el: $('#mainArea'),
		events: {
			//按钮事件绑定
			"click #refreshBtn":"onRefresh",
			"click #addBtn":"onAdd",
			"click #editBtn":"onEdit",
			"click #deleteBtn":"onDelete"
		},
		initialize: function(){
			
		},
		render: function(){},
		onRefresh: function(){},
		onAdd: function(){
			//alert('add')
			var person = new PersonModel();
			//以下被注释掉的这种情况必须注意，每次添加都将导致一个DialogView被创建，必须在使用完毕后及时destroy，否则DialogView数量会不断增长，事件响应会变得混乱，内存占用不断变大
			//var popDialogView = new DialogView({model:person});
			popDialogView.model = person;
			popDialogView.render().$el.modal('show');
		},
		onEdit: function(){
			var selectedOnes = personList.where({selected:true});
			if(selectedOnes.length != 1){
				alert('Please select one item at a time');
				return;
			}
			popDialogView.model = selectedOnes[0];
			popDialogView.render().$el.modal('show');
		},
		onDelete: function(){
			var selectedOnes = personList.where({selected:true});
			if(selectedOnes.length < 1){
				alert('Please select at least one item to delete!');
			}else{
				alert('Are you sure you will delete all these?')
			}
			_.each(selectedOnes,function(eachModel){
				eachModel.url ="http://127.0.0.1:1337/destroy";
				eachModel.destroy({
					success:function(resModel, response){
						alert('success');
					},
					error:function(error){
						alert('failure');
					}
				});
			})
		}
	});
	
//----------------------------FUNCTIONS FOR PUBLIC USE-----------------------------------------------------
	var showAddDialog = function(){
		$('#modalDialog').modal('show');
	}
	
	var setModelWithUserInput = function(personModel){
		
		personModel.set({	//不触发Model的change事件
			name: $('#name').val(),
			sex: $('#sex').val(),
			career:$('#career').val(),
			address: $('#address').val(),
			phone: $('#phone').val()
			},{silent:true});	
	}
	
	
//----------------------------MODEL-----------------------------------------------------
	var app = new AppView();
});
