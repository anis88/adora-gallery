var addImage = function(els)
{
	els.each(function(el){
		el.addEvent('click', function(e){

			var parent = el.getParent();
			
			e.stop();

			if (parent.getElement('div'))
			{
				return;
			}

			// TODO add indicator
			el.removeClass('image').addClass('loading');

			var target = new Element('div.new-image').inject(el, 'after');

			new Request.HTML({
				onSuccess: function(){
					el.removeClass('loading').addClass('image');
					
					var f = target.getElement('form');

					f.addEvent('submit', function(e){
						e.stop();
						var formData = {};
		
						f.getElements('input[type=text], input[type=hidden], select, textarea').each(function(el){
							// TODO use overlay with loader to disable the form
							el.disabled = true;
							formData[el.get('name')] = el.get('value').trim();
						});

						new Request({
							onSuccess: function(){
								new Fx.Tween(target).start('height', 0).chain(function () {
									target.dispose();
								});
							},
							url: AjaxURL+'addPhoto'
						}).send('data='+JSON.encode(formData));
					});
				},
				update: target,
				url: AjaxURL+'getImageForm'	
			}).send('file='+el.get('href'));
		});
	});	
};

var editUser = function(el)
{
	var li = el.getParent('li');
	
	var div = li.getElement('div');
	
	var id = el.getParent().getElement('span.ID').get('text').toInt();
	
	if(id > 0)
	{	
		new Request.HTML({
			onSuccess:function(responseTree) {
				div.setStyle('display', 'none');

				new Element('div').adopt(responseTree).inject(li);
				
				var ul = li.getElement('ul.user-icons');
		
				ul.addEvent('click', function(){
					ul.setStyle('overflow', 'visible');	
				});
				
				var form = li.getElement('form');
				form.addEvent('submit', function(e){
					e.stop();

					var data = {};

					data.ID = id;

					form.getElements('input[type=text]').each(function(el){
						data[el.get('name')] =  el.get('value');
					});

					new Request({
						onSuccess:function() {
							Object.each(data, function(el){
								li.getElement('.'+Object.keyOf(data, el)).set('text', el);
							});
							var divs = li.getElements('div');
							divs.setStyle('display', 'block');
							divs.getLast().dispose();
						},
						url: AjaxURL+'updateUser'
					}).send('data='+JSON.encode(data));
				});
			},
			url: AjaxURL+'editUser'
		}).send('id='+id);
	}
};

window.addEvent('domready', function(){

	if($('AddImages'))
	{
		addImage($$('#AddImages li a'));
	}

	if($('User'))
	{
		$$('#User li a').addEvent('click', function(e){
			e.stop();
			editUser(this);
		});
	}
	
});