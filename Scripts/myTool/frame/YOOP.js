/***********************************************
 OOP框架YOOP    v1.0

 作者：YYC
 日期：2013-06-09
 电子邮箱：395976266@qq.com
 QQ: 395976266
 博客：http://www.cnblogs.com/chaogex/

 ************************************************/
(function () {

    window.YYC = window.YYC || {};

    /************************************************** String对象扩展 ************************************************************/
    if (!String.prototype.contain) {
        String.prototype.contain = function (str) {
            var reg = new RegExp(str);  //str需要转义
            if (this.match(reg)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    /*****************************************************************************************************************************/

    function extendDeep(parent, child) {
        var i = null,
            len = 0,
            toStr = Object.prototype.toString,
            sArr = "[object Array]",
            sOb = "[object Object]",
            type = "",
            _child = null;

        //数组的话，不获得Array原型上的成员。
        if (toStr.call(parent) === sArr) {
            _child = child || [];

            for (i = 0, len = parent.length; i < len; i++) {
                type = toStr.call(parent[i]);
                if (type === sArr || type === sOb) {    //如果为数组或object对象
                    _child[i] = type === sArr ? [] : {};
                    arguments.callee(parent[i], _child[i]);
                } else {
                    _child[i] = parent[i];
                }
            }
        }
        //对象的话，要获得原型链上的成员。因为考虑以下情景：
        //类A继承于类B，现在想要拷贝类A的实例a的成员（包括从类B继承来的成员），那么就需要获得原型链上的成员。
        else if (toStr.call(parent) === sOb) {
            _child = child || {};

            for (i in parent) {
                type = toStr.call(parent[i]);
                if (type === sArr || type === sOb) {
                    _child[i] = type === sArr ? [] : {};
                    arguments.callee(parent[i], _child[i]);
                } else {
                    _child[i] = parent[i];
                }
            }
        }
        else {
            _child = parent;
        }

        return _child;
    };
    function getFunctionName(fn) {
        var name = "";

        if (!fn) {
            return null;
        }

        name = fn.toString().match(/^.*function\s*([^\(]*)/);
        return name === null ? name : name[1];
    };

    function isArray(val) {
        return Object.prototype.toString.call(val) === "[object Array]";
    };

    /*
     Structure写成原型形式，而Interface、AClass、Class不写成原型形式！（如写成:
     Interface.prototype = (function(){
     function I(){
     };

     return {
     ...
     };
     }());
     ）
     因为如果写成原型形式，则Interface/AClass/Class的实例就共享同一个I/A/F类！这样会造成不同的类之间互相干扰！
     */


    (function () {
        function Interface() {
            var that = this;

            this.parent = null;
            this.method = null;
            this.attribute = null;

            function I() {
            }

            function _getByParent(_parent, _method, _attribute) {
                if (_hasParent(_parent)) {
                    _checkInheritInterface(_parent);
                    that.parent = isArray(_parent) ? _parent : [_parent];

                    //形如“Interface(Parent, "A", "B", "GetName");”
                    if (_method && !isArray(_method)) {
                        that.method = Array.prototype.slice.call(arguments, 1);
                        that.attribute = null;
                    }
                    //形如“Interface(Parent, ["A", "B", "GetName"], ["a", "c"]);”
                    else {
                        that.method = _method;
                        that.attribute = _attribute;
                    }
                }
                else {
                    that.parent = null;
                    //形如“Interface("A", "B", "GetName");”
                    if (_parent && !isArray(_parent)) {
                        that.method = Array.prototype.slice.call(arguments, 0);
                        that.attribute = null;
                    }
                    //形如“Interface(["A", "B", "GetName"], ["a", "c"]);”
                    else {
                        that.method = arguments[0];
                        that.attribute = arguments[1];
                    }
                }

                _checkMethod();
            };
            function _hasParent(_parent) {
                return typeof _parent === "function" || (isArray(_parent) && typeof _parent[0] === "function");
            };
            function _checkInheritInterface(_parent) {
                var i = 0,
                    len = 0;

                for (i = 0, len = _parent.length; i < len; i++) {
                    if (getFunctionName(_parent[i]) !== "I") {
                        throw new Error("Interface must inherit interface!");
                    }
                }
            };
            function _checkMethod() {
                if (!that.method) {
                    throw new Error("Interface must has methods");
                }
            };
            function _inherit() {
                var i = 0,
                    len = 0;

                for (i = 0, len = that.parent.length; i < len; i++) {
                    extendDeep(that.parent[i].prototype, I.prototype);
                }
                I.prototype.constructor = I;
            };
            function _addMethod() {
                var i = 0,
                    len = 0;

                for (i = 0, len = that.method.length; i < len; i++) {
                    if (that.method[i] === undefined) {
                        continue;
                    }
                    //加上前缀“Interface_”
                    I.prototype["Interface_" + that.method[i]] = function () {
                        throw new Error("This method must be overwrited!");
                    };
                }
            };
            function _addAttribute() {
                var i = 0,
                    len = 0;

                if (that.attribute) {
                    if (!isArray(that.attribute)) {
                        throw new Error("Attribute must be array!");
                    }
                    else {
                        for (i = 0, len = that.method.length; i < len; i++) {
                            //加上前缀“Interface_”
                            I.prototype["Interface_" + that.attribute[i]] = 0;
                        }
                    }
                }
            };

            this.buildInterface = function (_parent, _method, _attribute) {
                _getByParent(_parent, _method, _attribute);
                if (this.parent) {
                    _inherit();
                }
                _addMethod();
                _addAttribute();

                return I;
            };
        };

        YYC.Interface = function (_parent, _method, _attribute) {
            return new Interface().buildInterface(_parent, _method, _attribute);
        };
    }());

    (function () {

        function Structure() {
        };
        Structure.prototype = (function () {
            return {
                _addToImplementMap: function (name, func) {
                    this.implementaionMap[name] = func;
                },
                _prepareCheckFor: function (module) {
                    var name = null;

                    if (module) {
                        for (name in module) {
                            if (module.hasOwnProperty(name)) {
                                this._prepareCheckForSpecial(name, module);
                                this._addToImplementMap(name, module[name]);
                            }
                        }
                    }
                },
                _prepareCheckForSpecial: function (name, module) {
                    this._addVirtualToImplementMap(name, module);
                },
                _addVirtualToImplementMap: function (name, module) {
                    var name2 = "";

                    if (name === "Virtual") {
                        for (name2 in module[name]) {
                            if (module[name].hasOwnProperty(name2)) {
                                this._addToImplementMap(name2, module[name][name2]);
                            }
                        }
                    }
                },
                P_checkImplementationOfAbstract: function () {
                    var name = "",
                        parentClass = this.parentClass;

                    if (this.parentClass) {
                        for (name in parentClass.prototype) {
                            if (parentClass.prototype.hasOwnProperty(name)) {
                                if (name === "constructor") {
                                    continue;
                                }
                                if (name.contain("Abstract_")) {
                                    if (typeof parentClass.prototype[name] === "function") {
                                        this._checkAbstractMethod(name);
                                    }
                                    else {
                                        this._checkAbstractAttribute(name);
                                    }
                                }
                            }
                        }
                    }
                },
                _checkAbstractMethod: function (name) {
                    var parentClass = this.parentClass,
                        implementaionMap = this.implementaionMap;

                    if (this._noMethodForAbstract(implementaionMap, name) && this._noMethodForAbstract(parentClass.prototype, name)) {
                        throw new Error("Abstract method '" + name + "' must be overwrited!");
                    }
                },
                _checkAbstractAttribute: function (name) {
                    var parentClass = this.parentClass,
                        implementaionMap = this.implementaionMap;

                    if (this._noAttritubeForAbstract(implementaionMap, name) && this._noAttritubeForAbstract(parentClass.prototype, name)) {
                        throw new Error("Abstract attribute '" + name + "' must be overwrited!");
                    }
                },
                P_checkImplementationOfInterface: function (_interface) {
                    var name = "";

                    for (name in _interface.prototype) {
                        if (!name.contain("Interface_")) {
                            continue;
                        }
                        if (typeof _interface.prototype[name] === "function") {
                            this._checkInterfaceMethod(name);
                        }
                        else {
                            this._checkInterfaceAttribute(name);
                        }
                    }
                },
                _checkInterfaceMethod: function (name) {
                    var implementaionMap = this.implementaionMap,
                        parentClassPrototype = this.parentClass ? this.parentClass.prototype : {};

                    if (this._noMethodForInterface(implementaionMap, name) && this._noMethodForInterface(parentClassPrototype, name)) {
                        throw new Error("Interface method '" + name + "' must be overwrited!");
                    }
                },
                _checkInterfaceAttribute: function (name) {
                    var implementaionMap = this.implementaionMap,
                        parentClassPrototype = this.parentClass ? this.parentClass.prototype : {};

                    if (this._noAttritubeForInterface(implementaionMap, name) && this._noAttritubeForInterface(parentClassPrototype, name)) {
                        throw new Error("Interface attribute '" + name + "' must be overwrited!");
                    }
                },
                _noMethodForAbstract: function (_class, name) {
                    return _class[name.slice(9)] === undefined || typeof _class[name.slice(9)] !== "function";
                },
                _noAttritubeForAbstract: function (_class, name) {
                    return _class[name.slice(9)] === undefined || typeof _class[name.slice(9)] === "function";
                },
                _noMethodForInterface: function (_class, name) {
                    return _class[name.slice(10)] === undefined || typeof _class[name.slice(10)] !== "function";
                },
                _noAttritubeForInterface: function (_class, name) {
                    return _class[name.slice(10)] === undefined || typeof _class[name.slice(10)] === "function";
                },
                P_addAbstract: function (abstract) {
                    var name = "",
                        _class = this.P_class;

                    for (name in abstract) {
                        if (abstract.hasOwnProperty(name)) {
                            //抽象方法前面加"Abstract_"前缀
                            _class.prototype["Abstract_" + name] = abstract[name];
                        }
                    }
                },
                //加入虚方法(不能为虚属性)
                P_addVirtualAndCheck: function (virtual) {
                    var name = "",
                        _class = this.P_class;

                    for (name in virtual) {
                        if (virtual.hasOwnProperty(name)) {
                            if (typeof virtual[name] !== "function") {
                                throw new Error("Virtual attribute is not allowed!");
                            }
                            else {
                                _class.prototype[name] = virtual[name];
                            }
                        }
                    }
                },
                //获得在原型prototype中不存在同名的str。
                //如果有同名，则加上前缀"_"
                P_getNoRepeatStrInPrototype: function (prototype, str) {
                    var new_str = "";

                    if (!prototype[str]) {
                        return str;
                    }
                    new_str = "_" + str;

                    return arguments.callee(prototype, new_str);
                },
                P_addStaticMember: function () {
                    var Static = null,
                        k = null,
                        _class = this.P_class,
                        prop = this.prop;

                    Static = prop.Static ? prop.Static : null;

                    for (k in Static) {
                        _class[k] = Static[k];
                    }
                },
                P_inherit: function () {
                    var _class = this.P_class,
                        parentClass = this.parentClass;

                    _class.prototype = extendDeep(parentClass.prototype);
                    _class.prototype.constructor = _class;

                    // 如果父类存在，则实例对象的baseClass指向父类的原型。
                    // 这就提供了在实例对象中调用父类方法的途径。
                    //baseClass的方法是指向this.parentClass.prototype的，不是指向（子类）的！
                    _class.prototype[this.P_getNoRepeatStrInPrototype(parentClass.prototype, "baseClass")] = parentClass.prototype;
                },
                P_addInit: function () {
                    var _class = this.P_class,
                        parentClass = this.parentClass,
                        prop = this.prop;

                    if (prop.Init) {
                        if (parentClass &&
                            typeof prop.Init === "function" &&
                            typeof _class.prototype.Init === "function") {
                            _class.prototype.Init = function (name) {
                                return function () {
                                    this.base = parentClass.prototype[name];

                                    return prop[name].apply(this, arguments);
                                };
                            }("Init");
                        }
                        else {
                            _class.prototype.Init = prop.Init;
                        }
                    }
                },
                P_addPrivateMember: function () {
                    var name = null,
                        _class = this.P_class,
                        private = this.prop.Private;

                    if (private) {
                        for (name in private) {
                            if (private.hasOwnProperty(name)) {
                                _class.prototype[name] = private[name];
                            }
                        }
                    }
                },
                P_addPublicMember: function () {
                    var name = null;

                    if (this.prop.Public) {
                        for (name in this.prop.Public) {
                            if (this.prop.Public.hasOwnProperty(name)) {
                                if (this.P_addSpecial("Public", name) === "continue") {
                                    continue;
                                }
                                this._addPublic(name);
                            }
                        }
                    }
                },
                _addPublic: function (name) {
                    var parentClass = this.parentClass,
                        prop = this.prop,
                        P_class = this.P_class;

                    if (parentClass &&
                        typeof prop.Public[name] === "function" &&
                        typeof P_class.prototype[name] === "function") {
                        P_class.prototype[name] = function (name) {
                            return function () {
                                this.base = parentClass.prototype[name];

                                return prop.Public[name].apply(this, arguments);
                            };
                        }(name);
                    }
                    else {
                        P_class.prototype[name] = prop.Public[name];
                    }
                },
                P_prepareCheck: function () {
                    this._prepareCheckFor(this.prop.Public);
                    this._prepareCheckFor(this.prop.Protected);
                },
                P_addProtectedMember: function () {
                    var name = null;

                    if (this.prop.Protected) {
                        for (name in this.prop.Protected) {
                            if (this.prop.Protected.hasOwnProperty(name)) {
                                if (this.P_addSpecial("Protected", name) === "continue") {
                                    continue;
                                }
                                this.P_class.prototype[name] = this.prop.Protected[name];
                            }
                        }
                    }
                }
            }
        }());

        //创建抽象类
        //抽象类能够继承接口、抽象类以及实体类，但此处约定抽象类只能继承接口和抽象类，不能继承实体类！
        //（这样方便判断抽象类是否包含全部的父类（接口/抽象类）成员）

        function AClass() {
            var that = this;

            this.P_class = A;
            this.implementaionMap = {};
            this.parentClass = null;
            this.interface = null;
            this.prop = null;

            // 创建的类（构造函数）
            function A() {
            };

            function __getByParent(args) {
                var _parent = args[0],
                    _prop = args[1];

                __checkOnlyOneParentClass(args);

                if (_prop === undefined) {
                    that.prop = _parent;
                    that.parentClass = null;
                    that.interface = null;
                }
                //{Class: xx, Interface: xx}
                else if (typeof _parent === "object") {
                    if (!_parent.Class && !_parent.Interface) {
                        throw new Error("Please add AbstractClass or Interface!");
                    }
                    that.parentClass = _parent.Class;
                    if (isArray(_parent.Interface)) {
                        that.interface = _parent.Interface;
                    }
                    else if (typeof _parent.Interface === "function") {
                        that.interface = [_parent.Interface];
                    }
                    that.prop = _prop;
                }
                //直接为xx抽象类
                else if (typeof _parent === "function") {
                    that.parentClass = _parent;
                    that.interface = null;
                    that.prop = _prop;
                }
                else {
                    throw new Error("arguments is not allowed!");
                }
                if (__isInheritFromClass()) {
                    throw new Error("AbstractClass can't inherit class!");
                }
            };
            function __checkOnlyOneParentClass(args) {
                if (args.length >= 3) {
                    throw new Error("AbstractClass can only inherit from one parentClass");
                }

                if (args[0].Class) {
                    if (isArray(args[0].Class) && args[0].Class.length >= 2) {
                        throw new Error("AbstractClass can only inherit from one parentClass");
                    }
                }
            };
            function __isInheritFromClass() {
                return getFunctionName(that.parentClass) === "F";
            };
            this.P_inherit = function () {
                var parentClass = this.parentClass;

                if (this.parentClass) {
                    A.prototype = extendDeep(parentClass.prototype);
                    A.prototype.constructor = A;

                    // 如果父类存在，则实例对象的baseClass指向父类的原型。
                    // 这就提供了在实例对象中调用父类方法的途径。
                    //baseClass的方法是指向this.parentClass.prototype的，不是指向（子类）的！
                    A.prototype[this.P_getNoRepeatStrInPrototype(parentClass.prototype, "baseClass")] = parentClass.prototype;
                }

                if (this.interface) {
                    var i = 0,
                        len = 0;

                    for (i = 0, len = this.interface.length; i < len; i++) {
                        extendDeep(this.interface[i].prototype, A.prototype);
                    }
                }
            };
            this.P_addSpecial = function (moduleName, name) {
                if (name === "Abstract") {
                    this.P_addAbstract(this.prop[moduleName][name]);
                    return "continue";
                }
                if (name === "Virtual") {
                    this.P_addVirtualAndCheck(this.prop[moduleName][name]);
                    return "continue";
                }
                return null;
            };

            this.buildAClass = function (args) {
                __getByParent(args);

                this.P_inherit();

                //抽象类本身因为不能实例化，所以不在A中调用构造函数Init。
                //抽象类中的构造函数供子类构造函数中调用。
                this.P_addInit();
                this.P_addPrivateMember();
                this.P_addProtectedMember();
                this.P_addPublicMember();
                this.P_addStaticMember();
                __addOuterAbstract();
                __addOuterVirtual();

                this.P_prepareCheck();

                return A;
            };

            //放到外面的抽象成员，默认为公有抽象成员
            function __addOuterAbstract() {
                if (that.prop.Abstract) {
                    that.P_addAbstract(that.prop.Abstract);
                }
            };
            function __addOuterVirtual() {
                if (that.prop.Virtual) {
                    that.P_addVirtualAndCheck(that.prop.Virtual);
                }
            };
        };

        AClass.prototype = new Structure();

        //创建普通类
        //父类_parent可以为{Class: xx, Interface: xx}，或者直接为xx类
        function Class() {
            var that = this;

            this.implementaionMap = {};
            this.parentClass = null;
            this.interface = null;
            this.prop = null;

            this.P_class = F;
            //当前是否处于创建类的阶段。
            this.initializing = false;
            //原型恢复标志，用于防止第一次创建实例时恢复原型
            this.mark_resume = false;


            // 创建的类（构造函数）
            function F() {
                var self = this,
                    args = arguments;

                function _restorePrototype() {
                    //防止第一次创建实例时恢复原型
                    if (that.mark_resume) {     //使用that，调用Class的实例成员
                        extendDeep(F.backUp_prototype, F.prototype);
                    }
                    else {
                        that.mark_resume = true;
                    }
                };
                function _init() {
                    // 如果当前处于实例化类的阶段，则调用构造函数Init
                    if (!that.initializing) {
                        self.Init && self.Init.apply(self, args);
                    }
                };

                _restorePrototype();
                _init();

                /*不能删除私有成员和保护成员！否则类的成员就不能调用到私有和保护的成员了（因为已经删除了）！
                 对象的创建算法参考http://www.cnblogs.com/TomXu/archive/2012/02/06/2330609.html




                 //删除私有成员和保护成员，这样外界就不能访问私有和保护成员了！
                 for (name in this) {
                 if (name.search(/(^_)|(^P_)/) !== -1) {
                 delete F.prototype[name];
                 //                                                    this[name] = null;
                 }

                 }
                 */
            }

            function __getByParent(args) {
                var _parent = args[0],
                    _prop = args[1];

                __checkOnlyOneParentClass(args);

                if (_prop === undefined) {
                    that.prop = _parent;
                    that.parentClass = null;
                    that.interface = null;
                }
                //{Class: xx, Interface: xx}
                else if (typeof _parent === "object") {
                    if (!_parent.Class && !_parent.Interface) {
                        throw new Error("Please add Class or Interface!");
                    }
                    that.parentClass = _parent.Class;
                    if (isArray(_parent.Interface)) {
                        that.interface = _parent.Interface;
                    }
                    else if (typeof _parent.Interface === "function") {
                        that.interface = [_parent.Interface];
                    }
                    that.prop = _prop;
                }
                //直接为xx类
                else if (typeof _parent === "function") {
                    that.parentClass = _parent;
                    that.interface = null;
                    that.prop = _prop;
                }
                else {
                    throw new Error("arguments is not allowed!");
                }
            };
            function __checkOnlyOneParentClass(args) {
                if (args.length >= 3) {
                    throw new Error("class can only inherit from one parentClass");
                }

                if (args[0].Class) {
                    if (isArray(args[0].Class) && args[0].Class.length >= 2) {
                        throw new Error("class can only inherit from one parentClass");
                    }
                }
            };
            this.P_addSpecial = function (moduleName, name) {
                if (name === "Abstract") {
                    throw new Error("class can't have abstract members");
                }
                if (name === "Virtual") {
                    this.P_addVirtualAndCheck(this.prop[moduleName][name]);
                    return "continue";
                }
                return null;
            };
            this.buildClass = function (args) {
                __getByParent(args);

                if (this.parentClass) {
                    this.initializing = true;
                    this.P_inherit();
                    this.initializing = false;
                }

                this.P_addInit();
                this.P_addPrivateMember();
                this.P_addProtectedMember();
                this.P_addPublicMember();
                this.P_addStaticMember();
                __addOuterAbstract();
                __addOuterVirtual();

                this.P_prepareCheck();
                this.P_checkImplementationOfAbstract();
                __checkEachImplementationOfInterface();

                __backUpPrototype();

                return F;
            };
            function __checkEachImplementationOfInterface() {
                if (that.interface) {
                    var i = 0,
                        len = 0;

                    for (i = 0, len = that.interface.length; i < len; i++) {
                        that.P_checkImplementationOfInterface(that.interface[i]);
                    }
                }
                if (__hasInterfaceInheritFromParentClass()) {
                    that.P_checkImplementationOfInterface(that.parentClass);
                }
            };
            function __hasInterfaceInheritFromParentClass() {
                var name = "";

                for (name in F.prototype) {
                    if (F.prototype.hasOwnProperty(name)) {
                        if (name.contain("Interface_")) {
                            return true;
                        }
                    }
                }

                return false;
            };
            function __addOuterAbstract() {
                if (that.prop.Abstract) {
                    throw new Error("class can't have abstract members!");
                }
            };
            function __addOuterVirtual() {
                if (that.prop.Virtual) {
                    that.P_addVirtualAndCheck(that.prop.Virtual);
                }
            };
            function __backUpPrototype() {
                F.backUp_prototype = extendDeep(F.prototype);
            };
        };

        Class.prototype = new Structure();

        /*
         下面的写法有问题！因为只有载入YOOP.js时，创建了AClass的实例。
         调用YYC.AClass时，只是引用该实例的buildAClass，而不会再创建AClass实例。
         也就是说，所有YYC.AClass都共用一个AClass的实例！共用AClass实例的属性（如parent等）！

         YYC.AClass = new AClass().buildAClass;
         */


        YYC.AClass = function () {
            return new AClass().buildAClass(arguments);
        };
        YYC.Class = function () {
            return new Class().buildClass(arguments);
        };
    }());
}());