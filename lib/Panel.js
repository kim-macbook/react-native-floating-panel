"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LARGE_PANEL_CONTENT_HEIGHT = exports.SMALL_PANEL_CONTENT_HEIGHT = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var Bar_1 = require("./Bar");
var Close_1 = require("./Close");
var FULL_HEIGHT = react_native_1.Dimensions.get("window").height;
var FULL_WIDTH = react_native_1.Dimensions.get("window").width;
var PANEL_HEIGHT = FULL_HEIGHT - 60;
var STATUS = {
    CLOSED: 0,
    SMALL: 1,
    LARGE: 2,
};
var SwipeablePanel = function (_a) {
    var _b = _a.style, style = _b === void 0 ? {} : _b, onClose = _a.onClose, _c = _a.fullWidth, fullWidth = _c === void 0 ? true : _c, _d = _a.closeRootStyle, closeRootStyle = _d === void 0 ? {} : _d, _e = _a.closeIconStyle, closeIconStyle = _e === void 0 ? {} : _e, _f = _a.openLarge, openLarge = _f === void 0 ? false : _f, _g = _a.onlyLarge, onlyLarge = _g === void 0 ? false : _g, _h = _a.onlySmall, onlySmall = _h === void 0 ? false : _h, _j = _a.showCloseButton, showCloseButton = _j === void 0 ? false : _j, _k = _a.noBar, noBar = _k === void 0 ? false : _k, _l = _a.closeOnTouchOutside, closeOnTouchOutside = _l === void 0 ? false : _l, _m = _a.allowTouchOutside, allowTouchOutside = _m === void 0 ? false : _m, _o = _a.barStyle, barStyle = _o === void 0 ? {} : _o, isActive = _a.isActive, noBackgroundOpacity = _a.noBackgroundOpacity, children = _a.children, pan = _a.pan;
    var animatedValueY = react_1.useRef(0);
    var isActiveState = react_1.useRef(false);
    var status = react_1.useRef(STATUS.CLOSED);
    var canScroll = react_1.useRef(false);
    var _p = react_1.useState({
        showComponent: false,
        opacity: new react_native_1.Animated.Value(0),
        orientation: FULL_HEIGHT >= FULL_WIDTH ? "portrait" : "landscape",
        deviceWidth: FULL_WIDTH,
        deviceHeight: FULL_HEIGHT,
        panelHeight: PANEL_HEIGHT,
        isClosing: false,
    }), state = _p[0], setState = _p[1];
    var animateTo = function (newStatus) {
        if (newStatus === void 0) { newStatus = 0; }
        var newY = 0;
        if (newStatus == STATUS.CLOSED)
            newY = PANEL_HEIGHT;
        else if (newStatus == STATUS.SMALL)
            newY =
                state.orientation === "portrait" ? FULL_HEIGHT - 400 : FULL_HEIGHT / 3;
        else if (newStatus == STATUS.LARGE)
            newY = 0;
        status.current = newStatus;
        setState(__assign(__assign({}, state), { showComponent: true }));
        react_native_1.Animated.spring(pan, {
            toValue: { x: 0, y: newY },
            tension: 80,
            friction: 25,
            useNativeDriver: true,
            restDisplacementThreshold: 10,
            restSpeedThreshold: 10,
        }).start(function () {
            if (newStatus == 0) {
                onClose();
                setState(__assign(__assign({}, state), { showComponent: false }));
            }
            else
                canScroll.current = newStatus == STATUS.LARGE ? true : false;
        });
    };
    var onOrientationChange = function () {
        var dimesions = react_native_1.Dimensions.get("screen");
        FULL_HEIGHT = dimesions.height;
        FULL_WIDTH = dimesions.width;
        PANEL_HEIGHT = FULL_HEIGHT - 100;
        setState(__assign(__assign({}, state), { orientation: dimesions.height >= dimesions.width ? "portrait" : "landscape", deviceWidth: FULL_WIDTH, deviceHeight: FULL_HEIGHT, panelHeight: PANEL_HEIGHT }));
        onClose();
        return dimesions.height >= dimesions.width ? "portrait" : "landscape";
    };
    var panResponder = react_1.useMemo(function () {
        return react_native_1.PanResponder.create({
            onStartShouldSetPanResponder: function () { return true; },
            onPanResponderGrant: function () {
                pan.setOffset({
                    x: 0,
                    y: animatedValueY.current,
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: function (_, gestureState) {
                if ((status.current == 1 &&
                    Math.abs(pan.y._value) <= pan.y._offset) ||
                    (status.current == 2 && pan.y._value > -1))
                    pan.setValue({
                        x: 0,
                        y: gestureState.dy,
                    });
            },
            onPanResponderRelease: function (_, gestureState) {
                pan.flattenOffset();
                if (gestureState.dy == 0)
                    animateTo(status.current);
                else if (gestureState.dy < -100 || gestureState.vy < -0.5) {
                    if (status.current == STATUS.SMALL)
                        animateTo(onlySmall ? STATUS.SMALL : STATUS.LARGE);
                    else
                        animateTo(STATUS.LARGE);
                }
                else if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    if (status.current == STATUS.LARGE)
                        animateTo(onlyLarge ? STATUS.CLOSED : STATUS.SMALL);
                    else
                        animateTo(0);
                }
                else
                    animateTo(status.current);
            },
        });
    }, []);
    react_1.useEffect(function () {
        pan.y.addListener(function (_a) {
            var value = _a.value;
            return (animatedValueY.current = value);
        });
        isActiveState.current = isActive;
        if (isActive) {
            animateTo(onlySmall
                ? STATUS.SMALL
                : openLarge
                    ? STATUS.LARGE
                    : onlyLarge
                        ? STATUS.LARGE
                        : STATUS.SMALL);
        }
        react_native_1.Dimensions.addEventListener("change", onOrientationChange);
    }, []);
    react_1.useEffect(function () {
        if (isActive !== isActiveState.current) {
            isActiveState.current = isActive;
            if (isActive)
                animateTo(onlySmall
                    ? STATUS.SMALL
                    : openLarge
                        ? STATUS.LARGE
                        : onlyLarge
                            ? STATUS.LARGE
                            : STATUS.SMALL);
            else {
                animateTo();
            }
        }
    }, [isActive]);
    return state.showComponent ? (<react_native_1.Animated.View style={[
        SwipeablePanelStyles.background,
        {
            backgroundColor: noBackgroundOpacity
                ? "rgba(0,0,0,0)"
                : "rgba(0,0,0,0.5)",
            height: allowTouchOutside ? "auto" : state.deviceHeight,
            width: state.deviceWidth,
        },
        {
            height: allowTouchOutside ? "auto" : FULL_HEIGHT,
        },
    ]}>
      {closeOnTouchOutside && (<react_native_1.TouchableWithoutFeedback onPress={function () { return onClose(); }}>
          <react_native_1.View style={[
        SwipeablePanelStyles.background,
        {
            width: state.deviceWidth,
            backgroundColor: "rgba(0,0,0,0)",
            height: allowTouchOutside ? "auto" : state.deviceHeight,
        },
    ]}/>
        </react_native_1.TouchableWithoutFeedback>)}
      <react_native_1.Animated.View style={[
        SwipeablePanelStyles.panel,
        {
            width: fullWidth ? state.deviceWidth : state.deviceWidth - 50,
            height: state.panelHeight,
        },
        { transform: pan.getTranslateTransform() },
        style,
    ]} {...panResponder.panHandlers}>
        {!noBar && <Bar_1.Bar barStyle={barStyle}/>}
        {showCloseButton && (<Close_1.Close rootStyle={closeRootStyle} iconStyle={closeIconStyle} onPress={onClose}/>)}
        <react_native_1.ScrollView onTouchStart={function () {
        return false;
    }} onTouchEnd={function () {
        return false;
    }} contentContainerStyle={SwipeablePanelStyles.scrollViewContentContainerStyle} showsVerticalScrollIndicator={false} bounces={false}>
          {canScroll.current ? (<react_native_1.TouchableHighlight>
              <react_1.default.Fragment>{children}</react_1.default.Fragment>
            </react_native_1.TouchableHighlight>) : (children)}
        </react_native_1.ScrollView>
      </react_native_1.Animated.View>
    </react_native_1.Animated.View>) : null;
};
var SwipeablePanelStyles = react_native_1.StyleSheet.create({
    background: {
        position: "absolute",
        zIndex: 1,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    panel: {
        position: "absolute",
        height: PANEL_HEIGHT,
        width: FULL_WIDTH - 50,
        transform: [{ translateY: FULL_HEIGHT - 100 }],
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        bottom: 0,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        zIndex: 2,
    },
    scrollViewContentContainerStyle: {
        width: "100%",
    },
});
exports.default = SwipeablePanel;
exports.SMALL_PANEL_CONTENT_HEIGHT = PANEL_HEIGHT - (FULL_HEIGHT - 400) - 25;
exports.LARGE_PANEL_CONTENT_HEIGHT = PANEL_HEIGHT - 25;
