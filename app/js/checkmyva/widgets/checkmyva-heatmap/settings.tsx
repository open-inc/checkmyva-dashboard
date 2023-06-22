// @ts-check

import * as React from "react";

import { createWidgetComponent, useTranslation } from "@opendash/core";
import { IconSelect } from "@opendash/ui";
import { Description } from "@opendash/ui";
import { Collapse } from "antd";

import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ draft, updateDraft, ...context }) => {
    return null;
  }
);
