(function(){

/* ---------------- Router ---------------- */
var AppRouter = Backbone.Router.extend({
	routes: {
		'': 'homeRoute',
		'home': 'homeRoute',
		'about': 'aboutRoute',
		'services': 'servicesRoute'
	},
	homeRoute: function(){
		var homeView = new HomeView();
		$('#content').html(homeView.el)
	},
	aboutRoute: function(){
		var aboutView = new AboutView();
		$('#content').html(aboutView.el)
	},
	servicesRoute: function(){
		var servicesView = new ServicesView();
		$('#content').html(servicesView.el)
	}
});


/* ---------------- Views ---------------- */
var HomeView = Backbone.View.extend({ // inline template
	template: '<h2>Home</h2>',
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html(this.template);
		this.$el.append('<div id="selectedService"></div>');
		
		var selectedService = '';

		_.each(serviceObj.getChecked(), function(obj){
			selectedService += '<button>' +obj.get('name')+ '</button> ' ;
		}, this);

		if(selectedService!=''){
		$('#selectedService', this.$el).html('Your selected Servive: ' +selectedService);
		}
	}
});

var AboutView = Backbone.View.extend({  // external template file
	initialize: function(){
		 this.render();
	},
	render: function(){
		var self = this;
		$.get('about.html', function(data){
			var template =  _.template(data, {});
			self.$el.html(template);
			self.$el.after("<a href='#home'>Go to home</a>");
		}, 'html');
	}
});


var ServiceList  = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click': 'toggleService'
	},
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},
	render: function(){
		this.$el.html('<input type="checkbox" value="1" name="'+this.model.get('name')+'"/> '+this.model.get('name')+'<span> Rs. '+this.model.get('price')+'</span>');		
		this.$('input').prop('checked', this.model.get('checked'));		

		return this;
	},
	toggleService: function(){
		this.model.toggleCheck();
	}
});

var ServicesView = Backbone.View.extend({
	template: '<h2>My Services</h2>',
	initialize: function(){
		this.listenTo(serviceObj, 'change', this.render);
		this.$el.append(this.template);
		this.$el.append('<ul id="services"></ul><div id="total">Rs. <span>0</span></div>');	
		
		serviceObj.each(function(serv){
			this.subview = new ServiceList({model: serv});
			$('#services', this.$el).append(this.subview.el);
		}, this);
		this.getTotal();
	},
	render: function(){
		this.getTotal();
		return this;
	},
	getTotal: function(){
		var total = 0;
		_.each(serviceObj.getChecked(), function(obj){
				total += obj.get('price');
		});
		$('#total', this.$el).text('Rs '+ total);
	}
});


var ServiceModel = Backbone.Model.extend({
	default: {
		name: 'My Service',
		price: 200,
		checked:false
	},
	toggleCheck: function(){
		this.set('checked', !this.get('checked'));
	}
});

var ServicesCollection = Backbone.Collection.extend({
	model: ServiceModel,
	getChecked: function(){
		return this.where({checked:true});
	}
});

var serviceObj = new ServicesCollection([
	new ServiceModel({name: 'Web', price: 200, checked:true}),
	new ServiceModel({name: 'Graphic', price: 150, checked:true}),
	new ServiceModel({name: 'Social Media', price: 100, checked:false}),
]);



/* ---------------- Router Initialize ---------------- */
var appRouter = new AppRouter();
Backbone.history.start();


})();