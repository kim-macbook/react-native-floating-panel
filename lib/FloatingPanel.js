"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var Panel_1 = __importDefault(require("./Panel"));
var _a = react_native_1.Dimensions.get("window"), width = _a.width, height = _a.height;
var FULL_HEIGHT = height;
var PANEL_HEIGHT = FULL_HEIGHT - 60;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        width: width,
    },
});
function FloatingPanel(_a) {
    var children = _a.children, panelContent = _a.panelContent, statusBarStyle = _a.statusBarStyle, panelProps = __rest(_a, ["children", "panelContent", "statusBarStyle"]);
    var animation = react_1.useRef(new react_native_1.Animated.ValueXY({ x: 0, y: FULL_HEIGHT }));
    return (<react_native_1.SafeAreaView style={[styles.container]}>
      <react_native_1.StatusBar barStyle={statusBarStyle}/>
      <react_native_1.Animated.View style={[
        { justifyContent: "center", alignItems: "center" },
        { backgroundColor: "#fff", width: width, height: height },
        {
            borderRadius: animation.current.y.interpolate({
                inputRange: [0, PANEL_HEIGHT],
                outputRange: [10, 0],
                extrapolate: "clamp",
            }),
        },
        {
            transform: [
                {
                    scale: animation.current.y.interpolate({
                        inputRange: [0, PANEL_HEIGHT],
                        outputRange: [0.9, 1.011],
                        extrapolate: "clamp",
                    }),
                },
            ],
        },
    ]}>
        {children}
      </react_native_1.Animated.View>
      <Panel_1.default {...panelProps} pan={animation.current}>
        {panelContent()}
      </Panel_1.default>
    </react_native_1.SafeAreaView>);
}
exports.default = FloatingPanel;
