"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { NavItemWithOptionalChildren } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { buttonVariants } from "@repo/ui/components/ui/button";

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  isLoading: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({
  items,
  setOpen,
  isLoading = false,
}: DashboardNavProps) {
  const path = usePathname();
  const t = useTranslations("Common");
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  // Helper function to check if any subitem's path matches current path
  const isPathInSubItems = (item: NavItemWithOptionalChildren) => {
    return item.items?.some(
      (subItem) => subItem.href && path.includes(item.href + subItem.href),
    );
  };

  // Set initial open item based on current path
  useEffect(() => {
    const initialIndex = items.findIndex((item) => isPathInSubItems(item));
    if (initialIndex !== -1) {
      setOpenItem(`item-${initialIndex}`);
    }
  }, [path, items]);

  return (
    <nav className="grid items-start gap-2">
      {isLoading && (
        <>
          <Skeleton className="min-h-[36px]" />
          <Skeleton className="min-h-[36px]" />
          <Skeleton className="min-h-[36px]" />
        </>
      )}
      {!isLoading &&
        items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          if (item?.items?.length ?? 0 > 0) {
            return (
              <Accordion
                key={`${item}-${index}`}
                type="single"
                collapsible
                value={openItem}
                onValueChange={setOpenItem}
                className="w-full"
              >
                <AccordionItem value={`item-${index}`} className="border-b-0">
                  <AccordionTrigger
                    className={buttonVariants({
                      variant: "ghost",
                      className:
                        "hover:no-underline pr-1 justify-between hover:bg-accent hover:text-accent-foreground rounded-md h-auto",
                    })}
                  >
                    <span className="flex items-center w-full text-sm font-medium group">
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{t(item.title)}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2 pt-2 pb-2 ml-5">
                    {item.items?.map(
                      (subItem, subIndex) =>
                        subItem.href && (
                          <Link
                            key={`${subIndex}-${index}`}
                            href={
                              subItem.disabled ? "/" : item.href + subItem.href
                            }
                            className={buttonVariants({
                              variant: path.includes(item.href + subItem.href)
                                ? "default"
                                : "ghost",
                              className:
                                "hover:no-underline pr-1 justify-between hover:bg-accent hover:text-accent-foreground rounded-md h-auto w-full",
                            })}
                          >
                            <span className="relative flex items-center w-full text-sm font-medium group">
                              {path.includes(item.href + subItem.href) && (
                                <div className="w-1 rounded mr-[1px] bg-white absolute top-[-0.15rem] left-[-0.65rem] bottom-[-0.15rem]" />
                              )}
                              <Icon className="w-4 h-4 mr-2" />
                              <span>{t(subItem.title)}</span>
                            </span>
                          </Link>
                        ),
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
                className={buttonVariants({
                  variant: path.includes(item.href ?? "") ? "default" : "ghost",
                  className: cn(
                    item.disabled && "cursor-not-allowed opacity-80",
                  ),
                })}
              >
                <span
                  className={cn(
                    "group w-full flex items-center rounded-md text-sm font-medium",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{t(item.title)}</span>
                </span>
              </Link>
            )
          );
        })}
    </nav>
  );
}
