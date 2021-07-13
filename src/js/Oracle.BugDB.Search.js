'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.Search
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    if (!parent.BugDB.hasOwnProperty('Search')) parent.BugDB.Search = {};
    const result = parent.BugDB.Search;

    result.getSearchByTagLink = function(tag) {
        const orc_product = "2421";
        const search_title = "Tag search results for Product ID: " + orc_product + " and Tag: " + tag;
        return "https://bug.oraclecorp.com/pls/bug/WEBBUG_REPORTS.do_edit_report?cid_arr=2&cid_arr=3&cid_arr=9&cid_arr=8&cid_arr=7&cid_arr=11&cid_arr=13&cid_arr=72&c_count=8&query_type=2&fid_arr=1&fcont_arr=" + orc_product + "&fid_arr=125&fcont_arr=" + tag + "&f_count=2&rpt_title=" + search_title + "'";
    }

    return parent;
}(Oracle));
