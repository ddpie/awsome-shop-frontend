export const validators = {
  required: (value: string): string | null =>
    value.trim() ? null : '此字段不能为空',

  minLength: (min: number) => (value: string): string | null =>
    value.length >= min ? null : `最少需要 ${min} 个字符`,

  maxLength: (max: number) => (value: string): string | null =>
    value.length <= max ? null : `最多允许 ${max} 个字符`,

  phone: (value: string): string | null =>
    /^1[3-9]\d{9}$/.test(value) ? null : '请输入有效的手机号码',

  positiveInt: (value: number): string | null =>
    Number.isInteger(value) && value > 0 ? null : '请输入正整数',
};
