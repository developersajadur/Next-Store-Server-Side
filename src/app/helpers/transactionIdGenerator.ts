
export const generateTransactionId = (): string => {
    const timestamp = Date.now().toString().slice(-6).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `TNX-${timestamp}${randomString}`;
    return transactionId;
};