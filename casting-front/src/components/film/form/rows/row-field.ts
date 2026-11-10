import type { RefCallBack } from 'react-hook-form'

export type RowField<TValue> = {
  name: string
  value: TValue
  onChange: (value: TValue) => void
  onBlur: () => void
  ref: RefCallBack
}