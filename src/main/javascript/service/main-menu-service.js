'use strict';

function MenuEntry(menuEntryId, options) {
    this.id = menuEntryId;
    var _options = options;

    this.getOptions = function () {
        return _options;
    };

    this.isGroup = function () {
        return false;
    };

    this.isMenu = function () {
        return false;
    };
}

function MenuGroup(groupId, options) {
    this.id = groupId;
    var _menuEntries = [];
    var _options = options;

    this.addMenuEntry = function (menuEntryId, options) {
        _menuEntries.push(new MenuEntry(menuEntryId, options));
    };

    this.getOptions = function () {
        return _options;
    };

    this.getEntries = function () {
        return _menuEntries;
    };

    this.isGroup = function () {
        return true;
    };

    this.isMenu = function () {
        return false;
    };
}

function Menu(menuId, options) {
    this.id = menuId;
    var _menuEntries = [];
    var _menuGroups = {};
    var _options = options;

    this.addMenuGroup = function (groupId, options) {
        _menuGroups[groupId] = new MenuGroup(groupId, options);
    };

    this.addMenuEntry = function (groupId, menuEntryId, options) {
        if (_.isUndefined(groupId)) {
            _menuEntries.push(new MenuEntry(menuEntryId, options));
        } else {
            _menuGroups[groupId].addMenuEntry(menuEntryId, options);
        }
    };

    this.getGroups = function () {
        return _.map(_menuGroups, function (menuGroup) {
            return menuGroup;
        });
    };

    this.getEntries = function (groupId) {
        if (_.isUndefined(groupId)) {
            return _menuEntries;
        }
        return _menuGroups[groupId].getEntries();
    };

    this.getFlattened = function () {
        return _.flatten([_menuEntries, _.map(this.getGroups(), function (group) {
            return[group, group.getEntries()];
        })]);
    };

    this.isMenu = function () {
        return true;
    };

    this.isGroup = function () {
        return false;
    };

    this.getOptions = function () {
        return _options;
    };
}

function MenuBar(menuBarId, options) {
    this.id = menuBarId;
    var _menus = {};
    var _options = options;

    this.addMenu = function (menuId, options) {
        _menus[menuId] = new Menu(menuId, options);
    };

    this.addMenuGroup = function (menuId, groupId, options) {
        _menus[menuId].addMenuGroup(groupId, options);
    };

    this.addMenuEntry = function (menuId, groupId, menuEntryId, options) {
        _menus[menuId].addMenuEntry(groupId, menuEntryId, options);
    };

    this.getMenus = function () {
        return _.map(_menus, function (menu) {
            return menu;
        });
    };

    this.getOptions = function () {
        return _options;
    };
}

function MainMenuProvider() {
    var _mainMenu = new MenuBar('main.menu', {});

    var _menus = [];
    var _groups = [];
    var _entries = [];

    this.menu = function (moduleId, options) {
        _menus.push({
            menuId: moduleId,
            options: options
        });
    };

    this.menuGroup = function (moduleId, groupId, options) {
        _groups.push({
            menuId: moduleId,
            groupId: groupId,
            options: options
        });
    };

    this.menuEntry = function (moduleId, groupId, entryId, options) {
        if (_.isUndefined(options)) {
            options = entryId;
            entryId = groupId;
            groupId = undefined;
        }
        _entries.push({
            menuId: moduleId,
            groupId: groupId,
            entryId: entryId,
            options: options
        });
    };

    this.$get = function () {
        _.forEach(_menus, function (menu) {
            _mainMenu.addMenu(menu.menuId, menu.options);
        });

        _.forEach(_groups, function (group) {
            _mainMenu.addMenuGroup(group.menuId, group.groupId, group.options);
        });

        _.forEach(_entries, function (entry) {
            _mainMenu.addMenuEntry(entry.menuId, entry.groupId, entry.entryId, entry.options);
        });

        return _mainMenu;
    };
}

angular.module('cat.service').provider('$mainMenu', MainMenuProvider);
