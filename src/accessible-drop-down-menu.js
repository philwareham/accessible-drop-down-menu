$(function ()
{
	// dropdown menus
	$('.dropdown-menu').each(function ()
	{
		// re-use self reference to save jQuery having to access it repeatedly
		var mainMenu = $(this);

		// set role on primary <ul> tag
		mainMenu.attr({'role': 'menubar'});

		// set role on all <li> tags
		// set role on all <a> tags and disallow tabindex
		mainMenu.find('li').attr({'role': 'presentation'}).find('a').attr({'role': 'menuitem', 'tabindex': '-1'});

		// allow tabindex to first <a> link in the menu, from elsewhere on the page
		mainMenu.find('a:first').attr({'tabindex': '0'});

		// get primary <a> links
		var mainMenuLink = mainMenu.find('li > a');

		// add aria-haspopup if <li> has nested <ul>
		mainMenuLink.each(function ()
		{
			if ($(this).next('ul').length > 0)
			{
				$(this).parent('li').attr({'aria-haspopup': 'true'});
			}
		});

		// set class and aria on secondary <ul> tags
		var subMenu = mainMenu.find('ul').attr({'class': 'menu', 'role': 'menu', 'aria-expanded': 'false', 'aria-hidden': 'true'});

		// set state for secondary <a> links
		var subMenuLink = subMenu.find('a').attr({'aria-selected': 'false'});

		// set state for the active secondary <a> link
		subMenu.find('.active > a').attr({'aria-selected': 'true'});

		// change aria states on hover
		mainMenuLink.hover(function ()
		{
			$(this).next('ul')
				.attr({'aria-expanded': 'true', 'aria-hidden': 'false'})
				.addClass('menu-open');
		},
		function ()
		{
			$(this).parent('li').find('.menu-open')
				.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
				.removeClass('menu-open');
		});

		// bind arrow keys for navigation - primary links behaviour
		mainMenuLink.keydown(function (e)
		{
			// left arrow key
			if (e.keyCode == 37)
			{
				e.preventDefault();
				// is this the first primary item?
				if ($(this).parent('li').prev('li').length == 0)
				{
					$(this).parents('ul').find('> li').last().find('a').first().focus();
				}
				else
				{
					$(this).parent('li').prev('li').find('a').first().focus();
					$('.menu-open')
						.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
						.removeClass('menu-open');
				}
			}

			// right arrow key
			else if (e.keyCode == 39)
			{
				e.preventDefault();
				// is this the last primary item?
				if ($(this).parent('li').next('li').length == 0)
				{
					$(this).parents('ul').find('> li').first().find('a').first().focus();
				}
				else
				{
					$(this).parent('li').next('li').find('a').first().focus();
					$('.menu-open')
						.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
						.removeClass('menu-open');
				}
			}

			// up arrow key
			else if (e.keyCode == 38)
			{
				e.preventDefault();
				if ($(this).next('ul').length > 0)
				{
					$(this).next('ul')
						.attr({'aria-expanded': 'true', 'aria-hidden': 'false'})
						.addClass('menu-open')
						.find('a').last().focus();
				}
			}

			// down arrow key
			else if (e.keyCode == 40)
			{
				e.preventDefault();
				if ($(this).next('ul').length > 0)
				{
					$(this).next('ul')
						.attr({'aria-expanded': 'true', 'aria-hidden': 'false'})
						.addClass('menu-open')
						.find('a').first().focus();
				}
			}

			// enter key (13) and space key (32)
			else if (e.keyCode == 13 || e.keyCode == 32)
			{
				// if submenu is hidden, open it
				e.preventDefault();
				$(this).parent('li').find('ul[aria-hidden=true]')
					.attr('aria-hidden', 'false')
					.addClass('menu-open')
					.find('a').first().focus();
			}

			// esc key
			else if (e.keyCode == 27)
			{
				e.preventDefault();
				$('.menu-open')
					.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
					.removeClass('menu-open');
				$(this).parents('ul').find('a:first').focus();
			}
		});

		// bind arrow keys for navigation - secondary links behaviour
		subMenuLink.keydown(function (e)
		{
			// left arrow key
			if(e.keyCode == 37)
			{
				e.preventDefault();
				$(this)
					.parents('ul').first()
						.prev('a').focus()
						.parents('ul').first().find('.menu-open')
							.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
							.removeClass('menu-open');
			}

			// right arrow key
			else if(e.keyCode == 39)
			{
				e.preventDefault();
				$(this)
					.parents('ul').first()
						.prev('a').focus()
						.parents('ul').first().find('.menu-open')
							.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
							.removeClass('menu-open');
			}

			// up arrow key
			else if(e.keyCode == 38)
			{
				e.preventDefault();
				// is this the first secondary item?
				if ($(this).parent('li').prev('li').length == 0)
				{
					$(this).parents('ul').parents('li').find('a').first().focus();
				}
				else
				{
					$(this).parent('li').prev('li').find('a').first().focus();
				}
			}

			// down arrow key
			else if(e.keyCode == 40)
			{
				e.preventDefault();
				// is this the last secondary item?
				if ($(this).parent('li').next('li').length == 0)
				{
					$(this).parents('ul').parents('li').find('a').first().focus();
				}
				else
				{
					$(this).parent('li').next('li').find('a').first().focus();
				}
			}

			// esc key
			else if(e.keyCode == 27)
			{
				e.preventDefault();
				$(this)
					.parents('ul').first()
						.prev('a').focus()
						.parents('ul').first().find('.menu-open')
							.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
							.removeClass('menu-open');
			}

			// space key
			else if(e.keyCode == 32)
			{
				e.preventDefault();
				$(this).click();
			}
		});

		// hide menu if focus moves out of navigation via tab key
		mainMenu.keydown(function (e)
		{
			if (e.keyCode == 9)
			{
				$('.menu-open')
					.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
					.removeClass('menu-open');
			}
		});

		// hide menu if click occurs outside of menu
		$(document).click(function ()
		{
			$('.menu-open')
				.attr({'aria-expanded': 'false', 'aria-hidden': 'true'})
				.removeClass('menu-open');
		});

		// kill event bubbling on click (TBC?)
		mainMenu.click(function (e)
		{
			e.stopPropagation();
		});
	});
});
