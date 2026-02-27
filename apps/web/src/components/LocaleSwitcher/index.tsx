"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { getOptions } from "./options";

type LocaleSwitcherProps = {
  whiteTrigger?: boolean;
  hideChevron?: boolean;
};

export function LocaleSwitcher({
  whiteTrigger = false,
  hideChevron = false,
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  const options = getOptions(t);

  const handleChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <div className="relative flex items-center">
      <Select defaultValue={locale} onValueChange={handleChange}>
        <SelectTrigger
          aria-label={t("select_locale_aria")}
          className={cn(
            "px-2",
            whiteTrigger ? "text-text" : "",
            hideChevron ? "[&>svg]:hidden" : ""
          )}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent avoidCollisions={false} position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Image
                  alt={option.alt}
                  height={20}
                  src={option.flag}
                  width={20}
                />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
