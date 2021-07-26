# oracle-fun
Set of JS modules to enhance bug DB reports 

## Description
Makes use of the Grease Monkey browser plugin provide a better user experience while dealing with the bug DB reports by adding extra capabilities like sorting, quick filtering, priority highlights, custom formatting and so on.

## Getting Started with Portal
1) Install Visual Studio 2019 Community Edition (Free, www.visualstudio.com)
2) Open the "Oralce.Portal.sln"

## Getting Started with TamperMonkey
1) Install Grease Monkey plugin in your favorite browser
2) Go to the plugin "Dashboard/Installed Scripts" and click the "+" icon
3) Paste the below template and adjust the path to folder where you haved downloaded the modules and "File / Save"

```
// ==UserScript== 
// @name         Oracle-Fun (BugDB tool)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bug DB - Custom Report helper
// @author       Laurent Devigne / 2021-07-05
// @match        https://bug.oraclecorp.com/pls/bug/webbug_reports.do_custom_report*
// @match        https://bug.oraclecorp.com/pls/bug/WEBBUG_REPORTS.do_edit_report*
// @match        file:///*oracle-fun/tests/data/BugDB*
// @grant GM_setValue
// @grant GM_getValue
// @require      http://code.jquery.com/jquery-2.2.4.min.js

// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.JQuery.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Conversion.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Storage.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Settings.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Formating.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.HTML.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Controls.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Controls.Themes.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Controls.Grids.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Users.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Users.Data.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.BugDB.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.BugDB.BugGrid.js
// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.BugDB.FilterPanel.js

// @require      file://C:\{your_folder_path}\src\portal\Oracle.Portal\wwwroot\lib\oracle\Oracle.Tampermonkey.js
// @require      file://C:\{your_folder_path}\src\tampermonkey\BugDBQueryPage.js

// ==/UserScript== 
```


### Dependencies
Depends on the JQuery

### Executing program
Go to team BugDB repport and you should see the result.

