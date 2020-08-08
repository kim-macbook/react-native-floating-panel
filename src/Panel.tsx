import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";

import { Bar } from "./Bar";
import { Close } from "./Close";

let FULL_HEIGHT = Dimensions.get("window").height;
let FULL_WIDTH = Dimensions.get("window").width;
let PANEL_HEIGHT = FULL_HEIGHT - 60;

const STATUS = {
  CLOSED: 0,
  SMALL: 1,
  LARGE: 2,
};

export type SwipeablePanelProps = {
  isActive: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  fullWidth?: boolean;
  noBackgroundOpacity?: boolean;
  style?: object;
  closeRootStyle?: object;
  closeIconStyle?: object;
  closeOnTouchOutside?: boolean;
  onlyLarge?: boolean;
  onlySmall?: boolean;
  openLarge?: boolean;
  noBar?: boolean;
  barStyle?: object;
  allowTouchOutside?: boolean;
  children?: React.ReactNode;
  pan: Animated.ValueXY;
};

type SwipeablePanelState = {
  showComponent: boolean;
  opacity: Animated.Value;
  orientation: "portrait" | "landscape";
  deviceWidth: number;
  deviceHeight: number;
  panelHeight: number;
  isClosing: boolean;
};

const SwipeablePanel = ({
  style = {},
  onClose,
  fullWidth = true,
  closeRootStyle = {},
  closeIconStyle = {},
  openLarge = false,
  onlyLarge = false,
  onlySmall = false,
  showCloseButton = false,
  noBar = false,
  closeOnTouchOutside = false,
  allowTouchOutside = false,
  barStyle = {},
  isActive,
  noBackgroundOpacity,
  children,
  pan,
}: SwipeablePanelProps) => {
  const animatedValueY = useRef(0);
  const isActiveState = useRef(false);
  const status = useRef(STATUS.CLOSED);
  const canScroll = useRef(false);
  const [state, setState] = useState<SwipeablePanelState>({
    showComponent: false,
    opacity: new Animated.Value(0),
    orientation: FULL_HEIGHT >= FULL_WIDTH ? "portrait" : "landscape",
    deviceWidth: FULL_WIDTH,
    deviceHeight: FULL_HEIGHT,
    panelHeight: PANEL_HEIGHT,
    isClosing: false,
  });

  const animateTo = (newStatus = 0) => {
    let newY = 0;

    if (newStatus == STATUS.CLOSED) newY = PANEL_HEIGHT;
    else if (newStatus == STATUS.SMALL)
      newY =
        state.orientation === "portrait" ? FULL_HEIGHT - 400 : FULL_HEIGHT / 3;
    else if (newStatus == STATUS.LARGE) newY = 0;

    status.current = newStatus;
    setState({ ...state, showComponent: true });

    Animated.spring(pan, {
      toValue: { x: 0, y: newY },
      tension: 80,
      friction: 25,
      useNativeDriver: true,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    }).start(() => {
      if (newStatus == 0) {
        onClose();
        setState({ ...state, showComponent: false });
      } else canScroll.current = newStatus == STATUS.LARGE ? true : false;
    });
  };

  const onOrientationChange = () => {
    const dimesions = Dimensions.get("screen");
    FULL_HEIGHT = dimesions.height;
    FULL_WIDTH = dimesions.width;
    PANEL_HEIGHT = FULL_HEIGHT - 100;

    setState({
      ...state,
      orientation:
        dimesions.height >= dimesions.width ? "portrait" : "landscape",
      deviceWidth: FULL_WIDTH,
      deviceHeight: FULL_HEIGHT,
      panelHeight: PANEL_HEIGHT,
    });

    onClose();
    return dimesions.height >= dimesions.width ? "portrait" : "landscape";
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: 0,
            y: animatedValueY.current,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, gestureState) => {
          if (
            (status.current == 1 &&
              Math.abs((pan.y as any)._value) <= (pan.y as any)._offset) ||
            (status.current == 2 && (pan.y as any)._value > -1)
          )
            pan.setValue({
              x: 0,
              y: gestureState.dy,
            });
        },
        onPanResponderRelease: (_, gestureState) => {
          pan.flattenOffset();

          if (gestureState.dy == 0) animateTo(status.current);
          else if (gestureState.dy < -100 || gestureState.vy < -0.5) {
            if (status.current == STATUS.SMALL)
              animateTo(onlySmall ? STATUS.SMALL : STATUS.LARGE);
            else animateTo(STATUS.LARGE);
          } else if (gestureState.dy > 100 || gestureState.vy > 0.5) {
            if (status.current == STATUS.LARGE)
              animateTo(onlyLarge ? STATUS.CLOSED : STATUS.SMALL);
            else animateTo(0);
          } else animateTo(status.current);
        },
      }),
    []
  );

  useEffect(() => {
    pan.y.addListener(({ value }) => (animatedValueY.current = value));

    isActiveState.current = isActive;

    if (isActive) {
      animateTo(
        onlySmall
          ? STATUS.SMALL
          : openLarge
          ? STATUS.LARGE
          : onlyLarge
          ? STATUS.LARGE
          : STATUS.SMALL
      );
    }

    Dimensions.addEventListener("change", onOrientationChange);
  }, []);

  useEffect(() => {
    if (isActive !== isActiveState.current) {
      isActiveState.current = isActive;
      if (isActive)
        animateTo(
          onlySmall
            ? STATUS.SMALL
            : openLarge
            ? STATUS.LARGE
            : onlyLarge
            ? STATUS.LARGE
            : STATUS.SMALL
        );
      else {
        animateTo();
      }
    }
  }, [isActive]);

  return state.showComponent ? (
    <Animated.View
      style={[
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
      ]}
    >
      {closeOnTouchOutside && (
        <TouchableWithoutFeedback onPress={() => onClose()}>
          <View
            style={[
              SwipeablePanelStyles.background,
              {
                width: state.deviceWidth,
                backgroundColor: "rgba(0,0,0,0)",
                height: allowTouchOutside ? "auto" : state.deviceHeight,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          SwipeablePanelStyles.panel,
          {
            width: fullWidth ? state.deviceWidth : state.deviceWidth - 50,
            height: state.panelHeight,
          },
          { transform: pan.getTranslateTransform() },
          style,
        ]}
        {...panResponder.panHandlers}
      >
        {!noBar && <Bar barStyle={barStyle} />}
        {showCloseButton && (
          <Close
            rootStyle={closeRootStyle}
            iconStyle={closeIconStyle}
            onPress={onClose}
          />
        )}
        <ScrollView
          onTouchStart={() => {
            return false;
          }}
          onTouchEnd={() => {
            return false;
          }}
          contentContainerStyle={
            SwipeablePanelStyles.scrollViewContentContainerStyle
          }
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {canScroll.current ? (
            <TouchableHighlight>
              <React.Fragment>{children}</React.Fragment>
            </TouchableHighlight>
          ) : (
            children
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  ) : null;
};

const SwipeablePanelStyles = StyleSheet.create({
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

export default SwipeablePanel;
export const SMALL_PANEL_CONTENT_HEIGHT =
  PANEL_HEIGHT - (FULL_HEIGHT - 400) - 25;
export const LARGE_PANEL_CONTENT_HEIGHT = PANEL_HEIGHT - 25;
