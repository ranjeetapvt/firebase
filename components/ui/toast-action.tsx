"use client"

import * as React from "react"

import { Button, type ButtonProps } from "./button"

export interface ToastActionProps extends React.HTMLAttributes<HTMLDivElement> {
  altText?: string
  actionButtonProps?: ButtonProps
}

const ToastAction = React.forwardRef<
  HTMLDivElement,
  ToastActionProps
>(({ children, altText, actionButtonProps, ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-live="assertive"
      {...props}
    >
      <Button
        variant="link"
        size="sm"
        {...actionButtonProps}
      >
        {children}
      </Button>
      {altText ? (
        <span className="sr-only">{altText}</span>
      ) : null}
    </div>
  )
})
ToastAction.displayName = "ToastAction"

export { ToastAction }