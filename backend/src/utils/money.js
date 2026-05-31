export const toNumber = (value) => Number(value || 0);

export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const paise = (rupees) => Math.round(Number(rupees) * 100);

export const fromPaise = (value) => roundMoney(Number(value) / 100);
