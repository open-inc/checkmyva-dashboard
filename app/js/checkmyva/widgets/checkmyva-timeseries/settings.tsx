// @ts-check

import * as React from "react";

import { createWidgetComponent, useTranslation } from "@opendash/core";
import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ draft, updateDraft, ...context }) => {
    const t = useTranslation();
    return null;
  }
);
