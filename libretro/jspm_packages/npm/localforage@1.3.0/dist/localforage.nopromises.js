/* */ 
"format cjs";
(function(process) {
  (function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
      module.exports = factory();
    else if (typeof define === 'function' && define.amd)
      define([], factory);
    else if (typeof exports === 'object')
      exports["localforage"] = factory();
    else
      root["localforage"] = factory();
  })(this, function() {
    return (function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId])
          return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
          exports: {},
          id: moduleId,
          loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.p = "";
      return __webpack_require__(0);
    })([function(module, exports, __webpack_require__) {
      'use strict';
      exports.__esModule = true;
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }
      (function() {
        'use strict';
        var CustomDrivers = {};
        var DriverType = {
          INDEXEDDB: 'asyncStorage',
          LOCALSTORAGE: 'localStorageWrapper',
          WEBSQL: 'webSQLStorage'
        };
        var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];
        var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];
        var DefaultConfig = {
          description: '',
          driver: DefaultDriverOrder.slice(),
          name: 'localforage',
          size: 4980736,
          storeName: 'keyvaluepairs',
          version: 1.0
        };
        var driverSupport = (function(self) {
          var indexedDB = indexedDB || self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;
          var result = {};
          result[DriverType.WEBSQL] = !!self.openDatabase;
          result[DriverType.INDEXEDDB] = !!(function() {
            if (typeof self.openDatabase !== 'undefined' && self.navigator && self.navigator.userAgent && /Safari/.test(self.navigator.userAgent) && !/Chrome/.test(self.navigator.userAgent)) {
              return false;
            }
            try {
              return indexedDB && typeof indexedDB.open === 'function' && typeof self.IDBKeyRange !== 'undefined';
            } catch (e) {
              return false;
            }
          })();
          result[DriverType.LOCALSTORAGE] = !!(function() {
            try {
              return self.localStorage && 'setItem' in self.localStorage && self.localStorage.setItem;
            } catch (e) {
              return false;
            }
          })();
          return result;
        })(this);
        var isArray = Array.isArray || function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
        function callWhenReady(localForageInstance, libraryMethod) {
          localForageInstance[libraryMethod] = function() {
            var _args = arguments;
            return localForageInstance.ready().then(function() {
              return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
          };
        }
        function extend() {
          for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg) {
              for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                  if (isArray(arg[key])) {
                    arguments[0][key] = arg[key].slice();
                  } else {
                    arguments[0][key] = arg[key];
                  }
                }
              }
            }
          }
          return arguments[0];
        }
        function isLibraryDriver(driverName) {
          for (var driver in DriverType) {
            if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
              return true;
            }
          }
          return false;
        }
        var LocalForage = (function() {
          function LocalForage(options) {
            _classCallCheck(this, LocalForage);
            this.INDEXEDDB = DriverType.INDEXEDDB;
            this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
            this.WEBSQL = DriverType.WEBSQL;
            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;
            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver);
          }
          LocalForage.prototype.config = function config(options) {
            if (typeof options === 'object') {
              if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
              }
              for (var i in options) {
                if (i === 'storeName') {
                  options[i] = options[i].replace(/\W/g, '_');
                }
                this._config[i] = options[i];
              }
              if ('driver' in options && options.driver) {
                this.setDriver(this._config.driver);
              }
              return true;
            } else if (typeof options === 'string') {
              return this._config[options];
            } else {
              return this._config;
            }
          };
          LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise(function(resolve, reject) {
              try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);
                if (!driverObject._driver) {
                  reject(complianceError);
                  return;
                }
                if (isLibraryDriver(driverObject._driver)) {
                  reject(namingError);
                  return;
                }
                var customDriverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0; i < customDriverMethods.length; i++) {
                  var customDriverMethod = customDriverMethods[i];
                  if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                    reject(complianceError);
                    return;
                  }
                }
                var supportPromise = Promise.resolve(true);
                if ('_support' in driverObject) {
                  if (driverObject._support && typeof driverObject._support === 'function') {
                    supportPromise = driverObject._support();
                  } else {
                    supportPromise = Promise.resolve(!!driverObject._support);
                  }
                }
                supportPromise.then(function(supportResult) {
                  driverSupport[driverName] = supportResult;
                  CustomDrivers[driverName] = driverObject;
                  resolve();
                }, reject);
              } catch (e) {
                reject(e);
              }
            });
            promise.then(callback, errorCallback);
            return promise;
          };
          LocalForage.prototype.driver = function driver() {
            return this._driver || null;
          };
          LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var self = this;
            var getDriverPromise = (function() {
              if (isLibraryDriver(driverName)) {
                switch (driverName) {
                  case self.INDEXEDDB:
                    return new Promise(function(resolve, reject) {
                      resolve(__webpack_require__(1));
                    });
                  case self.LOCALSTORAGE:
                    return new Promise(function(resolve, reject) {
                      resolve(__webpack_require__(2));
                    });
                  case self.WEBSQL:
                    return new Promise(function(resolve, reject) {
                      resolve(__webpack_require__(4));
                    });
                }
              } else if (CustomDrivers[driverName]) {
                return Promise.resolve(CustomDrivers[driverName]);
              }
              return Promise.reject(new Error('Driver not found.'));
            })();
            getDriverPromise.then(callback, errorCallback);
            return getDriverPromise;
          };
          LocalForage.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = new Promise(function(resolve, reject) {
              resolve(__webpack_require__(3));
            });
            if (callback && typeof callback === 'function') {
              serializerPromise.then(function(result) {
                callback(result);
              });
            }
            return serializerPromise;
          };
          LocalForage.prototype.ready = function ready(callback) {
            var self = this;
            var promise = self._driverSet.then(function() {
              if (self._ready === null) {
                self._ready = self._initDriver();
              }
              return self._ready;
            });
            promise.then(callback, callback);
            return promise;
          };
          LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self = this;
            if (!isArray(drivers)) {
              drivers = [drivers];
            }
            var supportedDrivers = this._getSupportedDrivers(drivers);
            function setDriverToConfig() {
              self._config.driver = self.driver();
            }
            function initDriver(supportedDrivers) {
              return function() {
                var currentDriverIndex = 0;
                function driverPromiseLoop() {
                  while (currentDriverIndex < supportedDrivers.length) {
                    var driverName = supportedDrivers[currentDriverIndex];
                    currentDriverIndex++;
                    self._dbInfo = null;
                    self._ready = null;
                    return self.getDriver(driverName).then(function(driver) {
                      self._extend(driver);
                      setDriverToConfig();
                      self._ready = self._initStorage(self._config);
                      return self._ready;
                    })['catch'](driverPromiseLoop);
                  }
                  setDriverToConfig();
                  var error = new Error('No available storage method found.');
                  self._driverSet = Promise.reject(error);
                  return self._driverSet;
                }
                return driverPromiseLoop();
              };
            }
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet['catch'](function() {
              return Promise.resolve();
            }) : Promise.resolve();
            this._driverSet = oldDriverSetDone.then(function() {
              var driverName = supportedDrivers[0];
              self._dbInfo = null;
              self._ready = null;
              return self.getDriver(driverName).then(function(driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
              });
            })['catch'](function() {
              setDriverToConfig();
              var error = new Error('No available storage method found.');
              self._driverSet = Promise.reject(error);
              return self._driverSet;
            });
            this._driverSet.then(callback, errorCallback);
            return this._driverSet;
          };
          LocalForage.prototype.supports = function supports(driverName) {
            return !!driverSupport[driverName];
          };
          LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
          };
          LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0,
                len = drivers.length; i < len; i++) {
              var driverName = drivers[i];
              if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
              }
            }
            return supportedDrivers;
          };
          LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            for (var i = 0; i < LibraryMethods.length; i++) {
              callWhenReady(this, LibraryMethods[i]);
            }
          };
          LocalForage.prototype.createInstance = function createInstance(options) {
            return new LocalForage(options);
          };
          return LocalForage;
        })();
        var localForage = new LocalForage();
        exports['default'] = localForage;
      }).call(typeof window !== 'undefined' ? window : self);
      module.exports = exports['default'];
    }, function(module, exports) {
      'use strict';
      exports.__esModule = true;
      (function() {
        'use strict';
        var globalObject = this;
        var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB || this.mozIndexedDB || this.OIndexedDB || this.msIndexedDB;
        if (!indexedDB) {
          return;
        }
        var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
        var supportsBlobs;
        var dbContexts;
        function _createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            var BlobBuilder = globalObject.BlobBuilder || globalObject.MSBlobBuilder || globalObject.MozBlobBuilder || globalObject.WebKitBlobBuilder;
            var builder = new BlobBuilder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        function _binStringToArrayBuffer(bin) {
          var length = bin.length;
          var buf = new ArrayBuffer(length);
          var arr = new Uint8Array(buf);
          for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
          }
          return buf;
        }
        function _blobAjax(url) {
          return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.withCredentials = true;
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = function() {
              if (xhr.readyState !== 4) {
                return;
              }
              if (xhr.status === 200) {
                return resolve({
                  response: xhr.response,
                  type: xhr.getResponseHeader('Content-Type')
                });
              }
              reject({
                status: xhr.status,
                response: xhr.response
              });
            };
            xhr.send();
          });
        }
        function _checkBlobSupportWithoutCaching(idb) {
          return new Promise(function(resolve, reject) {
            var blob = _createBlob([''], {type: 'image/png'});
            var txn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
            txn.oncomplete = function() {
              var blobTxn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
              var getBlobReq = blobTxn.objectStore(DETECT_BLOB_SUPPORT_STORE).get('key');
              getBlobReq.onerror = reject;
              getBlobReq.onsuccess = function(e) {
                var storedBlob = e.target.result;
                var url = URL.createObjectURL(storedBlob);
                _blobAjax(url).then(function(res) {
                  resolve(!!(res && res.type === 'image/png'));
                }, function() {
                  resolve(false);
                }).then(function() {
                  URL.revokeObjectURL(url);
                });
              };
            };
          })['catch'](function() {
            return false;
          });
        }
        function _checkBlobSupport(idb) {
          if (typeof supportsBlobs === 'boolean') {
            return Promise.resolve(supportsBlobs);
          }
          return _checkBlobSupportWithoutCaching(idb).then(function(value) {
            supportsBlobs = value;
            return supportsBlobs;
          });
        }
        function _encodeBlob(blob) {
          return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function(e) {
              var base64 = btoa(e.target.result || '');
              resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
              });
            };
            reader.readAsBinaryString(blob);
          });
        }
        function _decodeBlob(encodedBlob) {
          var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
          return _createBlob([arrayBuff], {type: encodedBlob.type});
        }
        function _isEncodedBlob(value) {
          return value && value.__local_forage_encoded_blob;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {db: null};
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          if (!dbContexts) {
            dbContexts = {};
          }
          var dbContext = dbContexts[dbInfo.name];
          if (!dbContext) {
            dbContext = {
              forages: [],
              db: null
            };
            dbContexts[dbInfo.name] = dbContext;
          }
          dbContext.forages.push(this);
          var readyPromises = [];
          function ignoreErrors() {
            return Promise.resolve();
          }
          for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== this) {
              readyPromises.push(forage.ready()['catch'](ignoreErrors));
            }
          }
          var forages = dbContext.forages.slice(0);
          return Promise.all(readyPromises).then(function() {
            dbInfo.db = dbContext.db;
            return _getOriginalConnection(dbInfo);
          }).then(function(db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
              return _getUpgradedConnection(dbInfo);
            }
            return db;
          }).then(function(db) {
            dbInfo.db = dbContext.db = db;
            self._dbInfo = dbInfo;
            for (var k in forages) {
              var forage = forages[k];
              if (forage !== self) {
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
              }
            }
          });
        }
        function _getOriginalConnection(dbInfo) {
          return _getConnection(dbInfo, false);
        }
        function _getUpgradedConnection(dbInfo) {
          return _getConnection(dbInfo, true);
        }
        function _getConnection(dbInfo, upgradeNeeded) {
          return new Promise(function(resolve, reject) {
            if (dbInfo.db) {
              if (upgradeNeeded) {
                dbInfo.db.close();
              } else {
                return resolve(dbInfo.db);
              }
            }
            var dbArgs = [dbInfo.name];
            if (upgradeNeeded) {
              dbArgs.push(dbInfo.version);
            }
            var openreq = indexedDB.open.apply(indexedDB, dbArgs);
            if (upgradeNeeded) {
              openreq.onupgradeneeded = function(e) {
                var db = openreq.result;
                try {
                  db.createObjectStore(dbInfo.storeName);
                  if (e.oldVersion <= 1) {
                    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                  }
                } catch (ex) {
                  if (ex.name === 'ConstraintError') {
                    globalObject.console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                  } else {
                    throw ex;
                  }
                }
              };
            }
            openreq.onerror = function() {
              reject(openreq.error);
            };
            openreq.onsuccess = function() {
              resolve(openreq.result);
            };
          });
        }
        function _isUpgradeNeeded(dbInfo, defaultVersion) {
          if (!dbInfo.db) {
            return true;
          }
          var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
          var isDowngrade = dbInfo.version < dbInfo.db.version;
          var isUpgrade = dbInfo.version > dbInfo.db.version;
          if (isDowngrade) {
            if (dbInfo.version !== defaultVersion) {
              globalObject.console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
            }
            dbInfo.version = dbInfo.db.version;
          }
          if (isUpgrade || isNewStore) {
            if (isNewStore) {
              var incVersion = dbInfo.db.version + 1;
              if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
              }
            }
            return true;
          }
          return false;
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.get(key);
              req.onsuccess = function() {
                var value = req.result;
                if (value === undefined) {
                  value = null;
                }
                if (_isEncodedBlob(value)) {
                  value = _decodeBlob(value);
                }
                resolve(value);
              };
              req.onerror = function() {
                reject(req.error);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.openCursor();
              var iterationNumber = 1;
              req.onsuccess = function() {
                var cursor = req.result;
                if (cursor) {
                  var value = cursor.value;
                  if (_isEncodedBlob(value)) {
                    value = _decodeBlob(value);
                  }
                  var result = iterator(value, cursor.key, iterationNumber++);
                  if (result !== void 0) {
                    resolve(result);
                  } else {
                    cursor['continue']();
                  }
                } else {
                  resolve();
                }
              };
              req.onerror = function() {
                reject(req.error);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            var dbInfo;
            self.ready().then(function() {
              dbInfo = self._dbInfo;
              return _checkBlobSupport(dbInfo.db);
            }).then(function(blobSupport) {
              if (!blobSupport && value instanceof Blob) {
                return _encodeBlob(value);
              }
              return value;
            }).then(function(value) {
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              if (value === null) {
                value = undefined;
              }
              var req = store.put(value, key);
              transaction.oncomplete = function() {
                if (value === undefined) {
                  value = null;
                }
                resolve(value);
              };
              transaction.onabort = transaction.onerror = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              var req = store['delete'](key);
              transaction.oncomplete = function() {
                resolve();
              };
              transaction.onerror = function() {
                reject(req.error);
              };
              transaction.onabort = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              var req = store.clear();
              transaction.oncomplete = function() {
                resolve();
              };
              transaction.onabort = transaction.onerror = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.count();
              req.onsuccess = function() {
                resolve(req.result);
              };
              req.onerror = function() {
                reject(req.error);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            if (n < 0) {
              resolve(null);
              return;
            }
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var advanced = false;
              var req = store.openCursor();
              req.onsuccess = function() {
                var cursor = req.result;
                if (!cursor) {
                  resolve(null);
                  return;
                }
                if (n === 0) {
                  resolve(cursor.key);
                } else {
                  if (!advanced) {
                    advanced = true;
                    cursor.advance(n);
                  } else {
                    resolve(cursor.key);
                  }
                }
              };
              req.onerror = function() {
                reject(req.error);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.openCursor();
              var keys = [];
              req.onsuccess = function() {
                var cursor = req.result;
                if (!cursor) {
                  resolve(keys);
                  return;
                }
                keys.push(cursor.key);
                cursor['continue']();
              };
              req.onerror = function() {
                reject(req.error);
              };
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var asyncStorage = {
          _driver: 'asyncStorage',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        exports['default'] = asyncStorage;
      }).call(typeof window !== 'undefined' ? window : self);
      module.exports = exports['default'];
    }, function(module, exports, __webpack_require__) {
      'use strict';
      exports.__esModule = true;
      (function() {
        'use strict';
        var globalObject = this;
        var localStorage = null;
        try {
          if (!this.localStorage || !('setItem' in this.localStorage)) {
            return;
          }
          localStorage = this.localStorage;
        } catch (e) {
          return;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {};
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          dbInfo.keyPrefix = dbInfo.name + '/';
          if (dbInfo.storeName !== self._defaultConfig.storeName) {
            dbInfo.keyPrefix += dbInfo.storeName + '/';
          }
          self._dbInfo = dbInfo;
          return new Promise(function(resolve, reject) {
            resolve(__webpack_require__(3));
          }).then(function(lib) {
            dbInfo.serializer = lib;
            return Promise.resolve();
          });
        }
        function clear(callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var keyPrefix = self._dbInfo.keyPrefix;
            for (var i = localStorage.length - 1; i >= 0; i--) {
              var key = localStorage.key(i);
              if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);
            if (result) {
              result = dbInfo.serializer.deserialize(result);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;
            var iterationNumber = 1;
            for (var i = 0; i < length; i++) {
              var key = localStorage.key(i);
              if (key.indexOf(keyPrefix) !== 0) {
                continue;
              }
              var value = localStorage.getItem(key);
              if (value) {
                value = dbInfo.serializer.deserialize(value);
              }
              value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);
              if (value !== void 0) {
                return value;
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var result;
            try {
              result = localStorage.key(n);
            } catch (error) {
              result = null;
            }
            if (result) {
              result = result.substring(dbInfo.keyPrefix.length);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];
            for (var i = 0; i < length; i++) {
              if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
              }
            }
            return keys;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = self.keys().then(function(keys) {
            return keys.length;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            if (value === undefined) {
              value = null;
            }
            var originalValue = value;
            return new Promise(function(resolve, reject) {
              var dbInfo = self._dbInfo;
              dbInfo.serializer.serialize(value, function(value, error) {
                if (error) {
                  reject(error);
                } else {
                  try {
                    localStorage.setItem(dbInfo.keyPrefix + key, value);
                    resolve(originalValue);
                  } catch (e) {
                    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                      reject(e);
                    }
                    reject(e);
                  }
                }
              });
            });
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var localStorageWrapper = {
          _driver: 'localStorageWrapper',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        exports['default'] = localStorageWrapper;
      }).call(typeof window !== 'undefined' ? window : self);
      module.exports = exports['default'];
    }, function(module, exports) {
      'use strict';
      exports.__esModule = true;
      (function() {
        'use strict';
        var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var BLOB_TYPE_PREFIX = '~~local_forage_type~';
        var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
        var SERIALIZED_MARKER = '__lfsc__:';
        var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
        var TYPE_ARRAYBUFFER = 'arbf';
        var TYPE_BLOB = 'blob';
        var TYPE_INT8ARRAY = 'si08';
        var TYPE_UINT8ARRAY = 'ui08';
        var TYPE_UINT8CLAMPEDARRAY = 'uic8';
        var TYPE_INT16ARRAY = 'si16';
        var TYPE_INT32ARRAY = 'si32';
        var TYPE_UINT16ARRAY = 'ur16';
        var TYPE_UINT32ARRAY = 'ui32';
        var TYPE_FLOAT32ARRAY = 'fl32';
        var TYPE_FLOAT64ARRAY = 'fl64';
        var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
        var globalObject = this;
        function _createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (err) {
            if (err.name !== 'TypeError') {
              throw err;
            }
            var BlobBuilder = globalObject.BlobBuilder || globalObject.MSBlobBuilder || globalObject.MozBlobBuilder || globalObject.WebKitBlobBuilder;
            var builder = new BlobBuilder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        function serialize(value, callback) {
          var valueString = '';
          if (value) {
            valueString = value.toString();
          }
          if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
            var buffer;
            var marker = SERIALIZED_MARKER;
            if (value instanceof ArrayBuffer) {
              buffer = value;
              marker += TYPE_ARRAYBUFFER;
            } else {
              buffer = value.buffer;
              if (valueString === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
              } else if (valueString === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
              } else if (valueString === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
              } else if (valueString === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
              } else if (valueString === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
              } else if (valueString === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
              } else if (valueString === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
              } else if (valueString === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
              } else if (valueString === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
              } else {
                callback(new Error('Failed to get type for BinaryArray'));
              }
            }
            callback(marker + bufferToString(buffer));
          } else if (valueString === '[object Blob]') {
            var fileReader = new FileReader();
            fileReader.onload = function() {
              var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);
              callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };
            fileReader.readAsArrayBuffer(value);
          } else {
            try {
              callback(JSON.stringify(value));
            } catch (e) {
              console.error("Couldn't convert value into a JSON string: ", value);
              callback(null, e);
            }
          }
        }
        function deserialize(value) {
          if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
          }
          var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
          var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
          var blobType;
          if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
          }
          var buffer = stringToBuffer(serializedString);
          switch (type) {
            case TYPE_ARRAYBUFFER:
              return buffer;
            case TYPE_BLOB:
              return _createBlob([buffer], {type: blobType});
            case TYPE_INT8ARRAY:
              return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
              return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
              return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
              return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
              return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
              return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
              return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
              return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
              return new Float64Array(buffer);
            default:
              throw new Error('Unkown type: ' + type);
          }
        }
        function stringToBuffer(serializedString) {
          var bufferLength = serializedString.length * 0.75;
          var len = serializedString.length;
          var i;
          var p = 0;
          var encoded1,
              encoded2,
              encoded3,
              encoded4;
          if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
              bufferLength--;
            }
          }
          var buffer = new ArrayBuffer(bufferLength);
          var bytes = new Uint8Array(buffer);
          for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
          }
          return buffer;
        }
        function bufferToString(buffer) {
          var bytes = new Uint8Array(buffer);
          var base64String = '';
          var i;
          for (i = 0; i < bytes.length; i += 3) {
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
          }
          if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
          } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
          }
          return base64String;
        }
        var localforageSerializer = {
          serialize: serialize,
          deserialize: deserialize,
          stringToBuffer: stringToBuffer,
          bufferToString: bufferToString
        };
        exports['default'] = localforageSerializer;
      }).call(typeof window !== 'undefined' ? window : self);
      module.exports = exports['default'];
    }, function(module, exports, __webpack_require__) {
      'use strict';
      exports.__esModule = true;
      (function() {
        'use strict';
        var globalObject = this;
        var openDatabase = this.openDatabase;
        if (!openDatabase) {
          return;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {db: null};
          if (options) {
            for (var i in options) {
              dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
            }
          }
          var dbInfoPromise = new Promise(function(resolve, reject) {
            try {
              dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
              return self.setDriver(self.LOCALSTORAGE).then(function() {
                return self._initStorage(options);
              }).then(resolve)['catch'](reject);
            }
            dbInfo.db.transaction(function(t) {
              t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function() {
                self._dbInfo = dbInfo;
                resolve();
              }, function(t, error) {
                reject(error);
              });
            });
          });
          return new Promise(function(resolve, reject) {
            resolve(__webpack_require__(3));
          }).then(function(lib) {
            dbInfo.serializer = lib;
            return dbInfoPromise;
          });
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function(t, results) {
                  var result = results.rows.length ? results.rows.item(0).value : null;
                  if (result) {
                    result = dbInfo.serializer.deserialize(result);
                  }
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function(t, results) {
                  var rows = results.rows;
                  var length = rows.length;
                  for (var i = 0; i < length; i++) {
                    var item = rows.item(i);
                    var result = item.value;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    result = iterator(result, item.key, i + 1);
                    if (result !== void 0) {
                      resolve(result);
                      return;
                    }
                  }
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              if (value === undefined) {
                value = null;
              }
              var originalValue = value;
              var dbInfo = self._dbInfo;
              dbInfo.serializer.serialize(value, function(value, error) {
                if (error) {
                  reject(error);
                } else {
                  dbInfo.db.transaction(function(t) {
                    t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function() {
                      resolve(originalValue);
                    }, function(t, error) {
                      reject(error);
                    });
                  }, function(sqlError) {
                    if (sqlError.code === sqlError.QUOTA_ERR) {
                      reject(sqlError);
                    }
                  });
                }
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            globalObject.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function() {
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function() {
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function(t, results) {
                  var result = results.rows.item(0).c;
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function(t, results) {
                  var result = results.rows.length ? results.rows.item(0).key : null;
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function(t, results) {
                  var keys = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    keys.push(results.rows.item(i).key);
                  }
                  resolve(keys);
                }, function(t, error) {
                  reject(error);
                });
              });
            })['catch'](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var webSQLStorage = {
          _driver: 'webSQLStorage',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        exports['default'] = webSQLStorage;
      }).call(typeof window !== 'undefined' ? window : self);
      module.exports = exports['default'];
    }]);
  });
  ;
})(require('process'));
