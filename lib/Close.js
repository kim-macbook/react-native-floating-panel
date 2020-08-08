"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Close = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
exports.Close = function (_a) {
    var onPress = _a.onPress, rootStyle = _a.rootStyle, iconStyle = _a.iconStyle;
    return (<react_native_1.TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[CloseStyles.closeButton, rootStyle]}>
      <react_native_1.View style={[
        CloseStyles.iconLine,
        iconStyle,
        { transform: [{ rotateZ: "45deg" }] },
    ]}/>
      <react_native_1.View style={[
        CloseStyles.iconLine,
        iconStyle,
        { transform: [{ rotateZ: "135deg" }] },
    ]}/>
    </react_native_1.TouchableOpacity>);
};
var CloseStyles = react_native_1.StyleSheet.create({
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: "absolute",
        right: 20,
        top: 20,
        backgroundColor: "#e2e2e2",
        zIndex: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    iconLine: {
        position: "absolute",
        width: 18,
        height: 2,
        borderRadius: 2,
        backgroundColor: "white",
    },
});
