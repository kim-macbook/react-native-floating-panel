import React, { useRef } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import SwipeablePanel, { SwipeablePanelProps } from "./Panel";

const { width, height } = Dimensions.get("window");

const FULL_HEIGHT = height;
const PANEL_HEIGHT = FULL_HEIGHT - 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    width,
  },
});

export default function FloatingPanel({
  children,
  panelContent,
  statusBarStyle,
  ...panelProps
}: {
  children: React.ReactNode;
  panelContent: () => JSX.Element;
  statusBarStyle: "dark-content" | "light-content";
  isActive: boolean;
} & Omit<SwipeablePanelProps, "pan">) {
  const animation = useRef(new Animated.ValueXY({ x: 0, y: FULL_HEIGHT }));
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={statusBarStyle} />
      <Animated.View
        style={[
          { justifyContent: "center", alignItems: "center" },
          { backgroundColor: "#fff", width, height },
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
        ]}
      >
        {children}
      </Animated.View>
      <SwipeablePanel {...panelProps} pan={animation.current}>
        {panelContent()}
      </SwipeablePanel>
    </SafeAreaView>
  );
}
