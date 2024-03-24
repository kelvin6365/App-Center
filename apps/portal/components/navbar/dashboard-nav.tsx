'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { NavItem, NavItemWithOptionalChildren } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@app-center/shadcn/util/cn';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  buttonVariants,
  Separator,
} from '@app-center/shadcn/ui';

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight'];
        if (item?.items?.length ?? 0 > 0) {
          return (
            <Accordion
              key={`${item}-${index}`}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value={`item-${index}`} className="border-b-0">
                <AccordionTrigger
                  className={buttonVariants({
                    variant: 'ghost',
                    className:
                      'hover:no-underline pr-1 justify-between hover:bg-accent hover:text-accent-foreground rounded-md h-auto',
                  })}
                >
                  <span className="flex items-center w-full text-sm font-medium group">
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 pt-2">
                  {item.items?.map(
                    (subItem, subIndex) =>
                      subItem.href && (
                        <Link
                          key={`${subIndex}-${index}`}
                          href={
                            subItem.disabled ? '/' : item.href + subItem.href
                          }
                          className={buttonVariants({
                            variant: path.includes(item.href ?? '')
                              ? 'default'
                              : 'ghost',
                            className:
                              'hover:no-underline pr-1 justify-between hover:bg-accent hover:text-accent-foreground rounded-md h-auto w-full',
                          })}
                        >
                          <span className="relative flex items-center w-full text-sm font-medium group">
                            {path.includes(item.href ?? '') && (
                              <div className="w-1 rounded mr-[1px] bg-white absolute top-[-0.15rem] left-[-0.65rem] bottom-[-0.15rem]" />
                            )}
                            <Icon className="w-4 h-4 mr-2" />
                            <span>{subItem.title}</span>
                          </span>
                        </Link>
                      )
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
              href={item.disabled ? '/' : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={buttonVariants({
                variant: path.includes(item.href ?? '') ? 'default' : 'ghost',
                className: cn(item.disabled && 'cursor-not-allowed opacity-80'),
              })}
            >
              <span
                className={cn(
                  'group w-full flex items-center rounded-md text-sm font-medium'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
