// @ts-check

import * as React from "react";

import { useTranslation, AppPortal } from "@opendash/core";
import { HeaderMenuItem } from "@opendash/ui";

import { AddToCategoryDialog } from "./AddToCategoryDialog";

export const AppGlobals = React.memo(function AppGlobals() {
  const t = useTranslation();

  return (
    <>
      <AddToCategoryDialog />
    </>
  );

  return (
    <>
      <AppPortal place="headerAfterLogo">
        <HeaderMenuItem
          onClick={() => {
            window.open(t("checkmyva:nav.guide_url"), "_blank").focus();
          }}
        >
          {t("checkmyva:nav.guide")}
        </HeaderMenuItem>
        <HeaderMenuItem
          onClick={() => {
            window.open(t("checkmyva:nav.faq_url"), "_blank").focus();
          }}
        >
          {t("checkmyva:nav.faq")}
        </HeaderMenuItem>
      </AppPortal>
    </>
  );
});
