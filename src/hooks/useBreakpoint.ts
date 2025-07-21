import { createBreakpoint } from 'react-use'

export enum Breakpoint {
  XL = 'xl',
  L = 'l',
  S = 's',
}

export const useBreakpoint = createBreakpoint({
  [Breakpoint.XL]: 1280,
  [Breakpoint.L]: 768,
  [Breakpoint.S]: 350,
}) as () => Breakpoint
