import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef(function Table({
  className,
  ...props
}, ref) {
  return (
    <table
      ref={ref}
      data-slot="table"
      className={cn("w-full text-left text-sm", className)}
      {...props}
    />
  );
})

const TableHeader = React.forwardRef(function TableHeader({
  className,
  ...props
}, ref) {
  return <thead ref={ref} data-slot="table-header" className={cn(className)} {...props} />;
})

const TableBody = React.forwardRef(function TableBody({
  className,
  ...props
}, ref) {
  return <tbody ref={ref} data-slot="table-body" className={cn(className)} {...props} />;
})

const TableRow = React.forwardRef(function TableRow({
  className,
  ...props
}, ref) {
  return <tr ref={ref} data-slot="table-row" className={cn("border-t border-border", className)} {...props} />;
})

const TableHead = React.forwardRef(function TableHead({
  className,
  ...props
}, ref) {
  return (
    <th
      ref={ref}
      data-slot="table-head"
      className={cn("px-4 py-3 text-left font-medium", className)}
      {...props}
    />
  );
})

const TableCell = React.forwardRef(function TableCell({
  className,
  ...props
}, ref) {
  return <td ref={ref} data-slot="table-cell" className={cn("px-4 py-3", className)} {...props} />;
})

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
}
