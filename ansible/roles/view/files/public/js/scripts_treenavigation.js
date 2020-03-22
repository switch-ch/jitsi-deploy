/* SWITCH Application Package generated: 2017-10-09T08:37:58 */
(function($) {

    // tree navigation js -----------------------------------------------------------------
    $.fn.treeNavigation = function() {

        return this.each(function() {
            var context = $(this);

            // add spans for navigation arrows
            context.find('li:has(ul)').addClass('parent-li').prepend('<span></span>');

            // setup initial state
            context.find('> ul > li > ul li').hide();

            function openChildren(children, trigger) {
                children.show('fast');
                trigger.parent('li').addClass('open');
            }

            function closeChildren(children, trigger) {
                children.hide('fast');
                trigger.parent('li').removeClass('open');
            }

            function handleChildren(trigger, showOrHide) {
                var children = trigger.parent('li.parent-li').find(' > ul > li');

                showOrHide = typeof showOrHide !== 'undefined' ? showOrHide : !children.is(":visible");

                if (showOrHide) {
                    openChildren(children, trigger);
                } else {
                    closeChildren(children, trigger);
                }
            }

            // handle navigation arrow clicks
            context.find('li.parent-li > span').on('click', function (e) {
                handleChildren($(this));
                e.stopPropagation();
            });

            // handle link clicks
            context.find('a').on('click', function (e) {
                context.find('li').removeClass('active');
                $(this).parent('li').addClass('active');
            });

            // rebuild tree navigation state if there is an .active sublink
            var activeNavigationLink = $(context.not('.swi-tree-xs').find('li.active'));
            if (activeNavigationLink.length > 0) {
                activeNavigationLink.parents('li').addClass('open').find(' > ul > li').show('fast');
                handleChildren($(activeNavigationLink.find(' > a')), true);
            }
        });
    };

}(jQuery));


$(document).ready(function () {

    $('.swi-tree').treeNavigation();

});


