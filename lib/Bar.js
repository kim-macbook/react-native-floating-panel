"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
exports.Bar = function (_a) {
    var barStyle = _a.barStyle;
    return (<react_native_1.View style={BarStyles.barContainer}>
      <react_native_1.View style={[BarStyles.bar, barStyle]}/>
    </react_native_1.View>);
};
var BarStyles = react_native_1.StyleSheet.create({
    barContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    bar: {
        width: "50%",
        height: 6,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#e2e2e2",
    },
});
