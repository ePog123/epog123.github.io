System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "npm:picodrive@1.0.0",
      "npm:picodrive@1.0.0/retro",
      "npm:picodrive@1.0.0/core",
      "github:jspm/nodelibs-process@0.1.2",
      "github:jspm/nodelibs-process@0.1.2/index",
      "npm:process@0.11.2",
      "npm:process@0.11.2/browser",
      "npm:vecx@1.0.0",
      "npm:vecx@1.0.0/retro",
      "npm:vecx@1.0.0/core",
      "npm:vba-next@1.0.0",
      "npm:vba-next@1.0.0/retro",
      "npm:vba-next@1.0.0/core",
      "npm:gw@1.0.0",
      "npm:gw@1.0.0/retro",
      "npm:gw@1.0.0/core",
      "npm:snes9x-next@1.0.0",
      "npm:snes9x-next@1.0.0/retro",
      "npm:snes9x-next@1.0.0/core",
      "npm:gambatte@1.0.0",
      "npm:gambatte@1.0.0/retro",
      "npm:gambatte@1.0.0/core",
      "npm:nestopia@1.0.0",
      "npm:nestopia@1.0.0/retro",
      "npm:nestopia@1.0.0/core",
      "index.coffee!github:forresto/system-coffee@0.1.2",
      "github:satazor/sparkmd5@1.0.1",
      "npm:localforage@1.3.0",
      "github:stuk/jszip@2.5.0",
      "utils.js",
      "github:satazor/sparkmd5@1.0.1/spark-md5",
      "npm:localforage@1.3.0/dist/localforage",
      "github:stuk/jszip@2.5.0/dist/jszip",
      "settings.json!github:systemjs/plugin-json@0.1.0",
      "github:matthewbauer/x-game@1.2.2",
      "github:matthewbauer/x-game@1.2.2/x-retro",
      "github:matthewbauer/window@0.0.3",
      "github:matthewbauer/document@0.0.4",
      "npm:babel-runtime@5.8.29/core-js/object/create",
      "github:matthewbauer/x-game@1.2.2/player.coffee!github:forresto/system-coffee@0.1.2",
      "github:matthewbauer/window@0.0.3/window",
      "github:matthewbauer/document@0.0.4/document",
      "npm:core-js@1.2.5/library/fn/object/create",
      "github:mohayonao/web-audio-api-shim@0.3.0",
      "github:webcomponents/webcomponentsjs@0.7.16",
      "npm:core-js@1.2.5/library/modules/$",
      "github:mohayonao/web-audio-api-shim@0.3.0/build/web-audio-api-shim",
      "github:webcomponents/webcomponentsjs@0.7.16/webcomponents-lite"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.33",
    "babel-runtime": "npm:babel-runtime@5.8.29",
    "coffee": "github:forresto/system-coffee@0.1.2",
    "core-js": "npm:core-js@1.2.5",
    "document": "github:matthewbauer/document@0.0.4",
    "gambatte": "npm:gambatte@1.0.0",
    "gw": "npm:gw@1.0.0",
    "json": "github:systemjs/plugin-json@0.1.0",
    "jszip": "github:stuk/jszip@2.5.0",
    "localforage": "npm:localforage@1.3.0",
    "nestopia": "npm:nestopia@1.0.0",
    "picodrive": "npm:picodrive@1.0.0",
    "raw": "github:matthewbauer/plugin-raw@0.3.1",
    "snes9x-next": "npm:snes9x-next@1.0.0",
    "sparkmd5": "github:satazor/sparkmd5@1.0.1",
    "traceur": "github:jmcriffey/bower-traceur@0.0.91",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.91",
    "vba-next": "npm:vba-next@1.0.0",
    "vecx": "npm:vecx@1.0.0",
    "window": "github:matthewbauer/window@0.0.3",
    "x-game": "github:matthewbauer/x-game@1.2.2",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:matthewbauer/document@0.0.4": {
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.7.16"
    },
    "github:matthewbauer/plugin-raw@0.3.1": {
      "fetch": "github:github/fetch@0.9.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "github:matthewbauer/window@0.0.3": {
      "web-audio-api-shim": "github:mohayonao/web-audio-api-shim@0.3.0"
    },
    "github:matthewbauer/x-game@1.2.2": {
      "coffee": "github:forresto/system-coffee@0.1.2",
      "document": "github:matthewbauer/document@0.0.4",
      "jszip": "github:stuk/jszip@2.5.0",
      "raw": "github:matthewbauer/plugin-raw@0.3.1",
      "sparkmd5": "github:satazor/sparkmd5@1.0.1",
      "window": "github:matthewbauer/window@0.0.3"
    },
    "npm:asap@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.29": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.5": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:gambatte@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:gw@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:localforage@1.3.0": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@5.0.0"
    },
    "npm:nestopia@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:picodrive@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:promise@5.0.0": {
      "asap": "npm:asap@1.0.0"
    },
    "npm:snes9x-next@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vba-next@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vecx@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
