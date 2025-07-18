import type { ChangeEvent } from "react";

export function change<T>(func?: (value: string) => void): ((event: ChangeEvent<T>) => void) {
  return (event) => {
    func?.(((event.target as unknown) as HTMLInputElement).value)
  }
}