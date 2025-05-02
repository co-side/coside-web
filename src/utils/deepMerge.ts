export function deepMerge<
  T1 extends Record<any, any>,
  T2 extends Record<any, any
  >>(target: T1, source: T2): T1 & T2
export function deepMerge<
  T1 extends Record<any, any>,
  T2 extends Record<any, any>,
  T3 extends Record<any, any>,
>(target: T1, source1: T2, source2: T3): T1 & T2 & T3
export function deepMerge<
  T1 extends Record<any, any>,
  T2 extends Record<any, any>,
  T3 extends Record<any, any>,
  T4 extends Record<any, any>,
>(target: T1, source1: T2, source2: T3, source3: T4): T1 & T2 & T3 & T4
export function deepMerge<
  T1 extends Record<any, any>,
  T2 extends Record<any, any>,
  T3 extends Record<any, any>,
  T4 extends Record<any, any>,
  T5 extends Record<any, any>,
>(target: T1, source1: T2, source2: T3, source3: T4, source4: T5): T1 & T2 & T3 & T4 & T5
export function deepMerge<T extends Record<any, any>>(...args: T[]): T {
  const isObject = (obj: any) => obj && typeof obj === 'object'
  const output: any = Array.isArray(args[0]) ? [] : {}

  for (const obj of args) {
    for (const key in obj) {
      if (isObject(obj[key])) {
        if (!output[key] || !isObject(output[key])) {
          output[key] = {}
        }
        output[key] = deepMerge(output[key], obj[key])
      }
      else {
        output[key] = obj[key]
      }
    }
  }

  return output
}
