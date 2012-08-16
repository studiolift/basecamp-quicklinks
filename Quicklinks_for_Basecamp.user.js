// ==UserScript==
// @name        Quicklinks for Basecamp Classic
// @description Adds "quicklinks" to Basecamp Classic to help you get around
// @match       https://*.basecamphq.com/*
// @include     https://*.basecamphq.com/*
// @version     0.1
// @author      Mike Robinson
// @homepage    http://twitter.com/akamike
// ==/UserScript==
(function(){
  var doc = document,
      body = doc.getElementsByTagName('body')[0],
      style = doc.createElement('style'),
      bar;

  // Add custom styles
  style.textContent = [
    '.quick_link { font-size:11px; font-weight:normal; text-decoration:none; background:transparent url(https://asset0.basecamphq.com/images/basecamp_sprites.png) no-repeat 0 0; width:17px; text-indent:-9999px; display:inline-block; line-height:17px; visibility:hidden; }',
    '.todo_list:hover h2 .quick_link, tr:hover .quick_link { visibility:visible; }',
    '.quick_link:hover { background-color:transparent; cursor:pointer; }',
    '.quick_link.time { background-position:-392px 0; }',
    '.quick_link.comments { background-position:-104px 0; width:13px; line-height:11px; margin:2px 0 0 5px; }'
  ].join('\n');

  doc.getElementsByTagName('head')[0].appendChild(style);

  // Quick links
  if (body.className.match(/todoglobal/)) {
    var todoLists = body.querySelectorAll('.todo_list');

    if (todoLists.length > 0) {
      for (var i = 0; i < todoLists.length; i++) {
        var list = todoLists[i],
            h2 = list.getElementsByTagName('h2')[0],
            projectId = h2.getElementsByTagName('a')[0].href.split('/')[4];

        h2.id = 'project_' + projectId;

        // Project Timesheet
        var timesheet = doc.createElement('a');
            timesheet.href = h2.getElementsByTagName('a')[0].href.replace('todo_lists', 'time_entries');
            timesheet.className = 'quick_link time';
            timesheet.textContent = 'Timesheet';
        h2.appendChild(timesheet);

        var proj = h2.getElementsByTagName('a')[0].href.replace('todo_lists', 'todo_items/');

        // Todo comments
        var rows = list.getElementsByTagName('tr');

        for (var x = 0; x < rows.length; x++) {
          var row = rows[x],
              id = row.getElementsByTagName('small')[0].id.split('_'),
              comments = doc.createElement('a'),
              time_log = doc.createElement('a');

          comments.href = proj + id[1] + '/comments';
          comments.className = 'quick_link comments';
          comments.textContent = 'Comments';
          row.querySelector('td:last-child').appendChild(comments);
        }
      }
    }
  } else if (bar = doc.getElementById('dashboard_and_project_switcher')) {
    // Overview quicklink
    var pipe = doc.createElement('div'),
        wrap = doc.createElement('div'),
        link = doc.createElement('a'),
        clear = bar.getElementsByTagName('div'),
        clear = clear[clear.length-1];

    pipe.className = 'pipe';
    pipe.textContent = '|';

    link.href = '/todo_lists';
    link.textContent = 'Your todo overview';

    wrap.className = 'switch';

    wrap.appendChild(link);
    bar.insertBefore(pipe, clear);
    bar.insertBefore(wrap, clear);
  }
})();
